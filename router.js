var handler = require('./handler.js');
var fs = require('fs');


var routes = {
  "/" : handler.home,
  '404' : handler.notFound,
  '/favicon.ico' : handler.favicon,
  '/main.js' : handler.mainJs,
  '/main.css' : handler.mainCss,
  '/index' :handler.index
};

module.exports = function(req, res){
  if(routes[req.url]){
    routes[req.url](req, res);
  } else {
    routes[404](req, res);
  }
};
