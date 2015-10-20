var handler = require('./handler.js');

var routes = {
  "/" : handler.home,
  '404' : handler.notFound
};

module.exports = function(req, res){
  if(routes[req.url]){
    routes[req.url](req, res);
  } else {
    routes[404](req, res);
  }
};
