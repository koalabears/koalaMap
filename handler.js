var handler = module.exports = {};
var fs = require('fs');

var index = fs.readFileSync(__dirname + '/public/html/index.html');
var mainJs = fs.readFileSync(__dirname + '/public/js/main.js');
var mainCss = fs.readFileSync(__dirname + '/public/css/main.css');


var headersHtml = {
  'Content-Type' : 'text/html'
};
var headersJs = {
  'Content-Type' : 'text/js'
};
var headersCss = {
  'Content-Type' : 'text/css'
};


handler.home = function(req, res){
  res.writeHead(200, headersHtml);
  res.end(index);
};

handler.notFound = function(req, res){
  res.writeHead(404, headersHtml);
  res.end('Resource not found');
};

handler.favicon = function(req, res){
  res.writeHead(200, headersHtml);
  res.end();
};

handler.index = function(req, res) {
  res.writeHead(200, headersHtml);
  res.end(index);
};

handler.mainJs = function(req, res){
  res.writeHead(200, headersJs);
  res.end(mainJs);
};

handler.mainCss = function(req, res){
  res.writeHead(200, headersCss);
  res.end(mainCss);
};
