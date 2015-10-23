var socketio = require('socket.io');
var tfl = require('./tflDataGetter.js');

var io;

function attachServer(server){
  io = socketio(server);
  io.on('connection', manageConnection);
}

function manageConnection(socket){
  console.log('socket connected');
  socket.on('disconnect', function(){
    console.log('socket disconnected');
  });

function repeatReq() {
  tfl.handleArrivalDataRequests(function(poly){
    socket.emit('update poly', poly);
    console.log("im socket");
  });
}

  repeatReq();
  setInterval(repeatReq, 5000);

}

module.exports = attachServer;
