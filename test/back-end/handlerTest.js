var test = require('tape');
var shot = require('shot');
var router = require('./../../router.js');
var fs = require('fs');


function serveTest(url, callback){
  test('msg', function(t){
    var req = {
      method : 'GET',
      url : url
    };
    shot.inject(router, req, function(res){
      callback(res, t);
      t.end();
    });
  });
}

function statusTest(code){
  return function(res, t) {
    t.equal(res.statusCode, code, "test passed!");
  };
}

serveTest('/', statusTest(200));
serveTest('/jack', statusTest(404));
serveTest('404', statusTest(404));
serveTest('/mainjs', statusTest(200));
serveTest('/maincss', statusTest(200));
serveTest('/index', statusTest(200));
serveTest('/favicon.ico', statusTest(200));
