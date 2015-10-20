var handler = module.exports = {};

var headers = {
  'Content-Type' : 'text/html'
};

handler.home = function(req, res){
  res.writeHead(200, headers);
  res.end('You are home');
};

handler.notFound = function(req, res){
  res.writeHead(404, headers);
  res.end('Resource not found');
};
