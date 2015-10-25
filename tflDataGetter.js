var env = require('env2')('./config.env');
var https = require('https');
var querystring = require('querystring');

function handleArrivalDataRequests(callback) {
  makeArrivalDataRequests(callback);
}

function sendResponse(arrivalDataResponse, arrivalData) {
  var processedData = processData(arrivalData);
  arrivalDataResponse.writeHead(200, {'Content-Type': 'text/plain'});
  arrivalDataResponse.end(processedData);
}

function processData(rawArrivalData) {
  var allStationArrivalInfo, clockwiseData;
  allStationArrivalInfo = rawArrivalData.map(function(stationArrivalInfo) {
    return {
      stationNumber: getStationNumber(stationArrivalInfo.stationName),
      direction: getDirectionFrom(stationArrivalInfo.towards),
      time: stationArrivalInfo.timeToStation
    };
  });
  allStationArrivalInfo = removeUnfoundStations(allStationArrivalInfo);
  clockwiseData = filterByDirection('clockwise', allStationArrivalInfo);
  return JSON.stringify(createArrivalOutputData(clockwiseData));
}

function makeArrivalDataRequests(callback) {
  var options = createArrivalDataRequestOptions();
  var apiKey = process.env.app_key;
  var apiId = process.env.app_id;
  var postData = querystring.stringify({
      app_key: apiKey,
      app_id: apiId
  });
  var body = '';
  var request = https.request(options, function(response) {
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function(){
      callback(processData(JSON.parse(body)));
    });
  });
  request.end(postData);
}

function createArrivalDataRequestOptions(){
  return {
    hostname : 'api.tfl.gov.uk',
    path : '/Line/Circle/arrivals',
    method : 'GET'
  };
}

function createArrivalOutputData(arrivalData) {
  var out = stopOrder.map(function(stopName, stopIndex) {
    return getShortestTimeForStationNumber(stopIndex, arrivalData);
  });
  return out;
}

function getShortestTimeForStationNumber(targetStationNumber, allStationArrivalInfo) {
  var maxTime = 600;
  var minTime = allStationArrivalInfo.reduce(function(minTime, stationArrivalInfo) {
    if (stationArrivalInfo.stationNumber === targetStationNumber) {
      var arrivalTime = stationArrivalInfo.time;
      return minTime > arrivalTime ? arrivalTime : minTime;
    } else {
      return minTime;
    }
  }, maxTime);
  return minTime/maxTime;
}

function removeUnfoundStations(allStationArrivalInfo) {
  return allStationArrivalInfo.filter(function(stationArrivalInfo) {
    return stationArrivalInfo.stationNumber !== -1;
  });
}

var stopOrder = [
  'Edgware',
  'Baker',
  'Great',
  'Euston',
  'King\'s',
  'Farringdon',
  'Barbican',
  'Moorgate',
  'Liverpool',
  'Aldgate',
  'Tower',
  'Monument',
  'Cannon',
  'Mansion',
  'Blackfriars',
  'Temple',
  'Embankment',
  'Westminster',
  'St.',
  'Victoria',
  'Sloane',
  'South',
  'Gloucester',
  'High',
  'Notting',
  'Bayswater',
  'Paddington'
];

function getStationNumber(stationName) {
  var stationNameFirstWord = stationName.split(' ')[0];
  var index = stopOrder.indexOf(stationNameFirstWord);
  if (index === -1) console.log(stationName);
  return index;
}



function filterByDirection(direction, allStationArrivalInfo) {
  return allStationArrivalInfo.filter(function(stationArrivalInfo) {
    return stationArrivalInfo.direction === direction;
  });
}

function getDirectionFrom(towards) {
  return towards === 'Edgware Road (Circle)' ? 'clockwise' : 'anti-clockwise';
}

module.exports = {
  handleArrivalDataRequests: handleArrivalDataRequests
};
