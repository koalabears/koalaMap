var handler = require('./handler.js');
var fs = require('fs');
var tfl = require('./tflDataGetter.js');

var routes = {
  "/" : handler.home,
  '404' : handler.notFound,
  '/favicon.ico' : handler.favicon,
  '/main.js' : handler.mainJs,
  '/main.css' : handler.mainCss,
  '/index' : handler.index,
  '/arrivalData' : tfl.handleArrivalDataRequests

};

module.exports = function(req, res){
  console.log(req.url);
  if(routes[req.url]){
    routes[req.url](req, res);
  } else {
    routes[404](req, res);
  }
};
