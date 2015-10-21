var mainWrapper = document.querySelector('div.wrapper');
var req = new XMLHttpRequest();
req.open('GET', 'https://api.tfl.gov.uk/Line/Circle/arrivals?app_id=835f25cf&app_key=dc0f2d114ba4e4fa542473a670755267');
req.onreadystatechange = function() {
  if (req.readyState === 4) {
    if (req.status === 200) {
      var data = JSON.parse(req.responseText);
      mainWrapper.innerHTML = 'fetch!';
      allStationArrivalInfo = data.map(function(stationArrivalInfo) {
        return {
          stationNumber: getStationNumber(stationArrivalInfo.stationName),
          direction: getDirectionFrom(stationArrivalInfo.towards),
          time: stationArrivalInfo.timeToStation
        };
      });
      allStationArrivalInfo = removeUnfoundStations(allStationArrivalInfo);
      clockwiseData = filterByDirection('clockwise', allStationArrivalInfo);
      var numStations = stopOrder.length;
      var points = dataToCoords(numStations, createArrivalOutputData(clockwiseData));
      console.log(points);
      draw(points);
    } else {
      console.log('error. state = ', req.status);
    }
  }
}
req.send();

function createArrivalOutputData(arrivalData) {
  var out = stopOrder.map(function(stopName, stopIndex) {
    return getShortestTimeForStationNumber(stopIndex, arrivalData) + 1;
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
    return stationArrivalInfo.stationNumber !== -1
  });
}

function dataToCoords(numberOfPoints, values) {
  console.log(values);
  return values.map(function(value, i) {
    var angle = (i/numberOfPoints)*2*Math.PI;
    var r = value;
    return [(r*Math.cos(angle)+2)*100, (r*Math.sin(angle)+2)*100];
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

function draw(data) {

  var points = data;

  var svgContainer = d3.select("body").append("svg")
      .attr("width", 960)
      .attr("height", 500);

  var path = svgContainer.
    append("path").data([points]).attr("d",
    d3.svg.line().tension(.5).interpolate("cardinal-closed"));

  svgContainer.selectAll(".point")
      .data(points)
    .enter().append("circle")
      .attr("r", 4)
      .attr("transform", function(d) { return "translate(" + d + ")"; });

  // var circle = svg.append("circle")
  //     .attr("r", 13)
  //     .attr("transform", "translate(" + points[0] + ")");
  //
  // transition();
  //
  // function transition() {
  //   circle.transition()
  //       .duration(10000)
  //       .attrTween("transform", translateAlong(path.node()))
  //       .each("end", transition);
  // }
  //
  // // Returns an attrTween for translating along the specified path element.
  // function translateAlong(path) {
  //   var l = path.getTotalLength();
  //   return function(d, i, a) {
  //     return function(t) {
  //       var p = path.getPointAtLength(t * l);
  //       return "translate(" + p.x + "," + p.y + ")";
  //     };
  //   };
  // }
}
