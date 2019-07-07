var playersinfo = [];
function Player(id,x,y,a,score){
  this.id = id;
  this.x = x;
  this.y = y;
  this.a = a;
  this.score = score;
}

var express = require('express');
var app = express();
var server = app.listen(3000);


app.use(express.static('public'));
console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', playersinfo);
}

io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('new connection: ' + socket.id);
  io.to(socket.id).emit("clientid", socket.id);
  socket.on('start',
  function(data){
    console.log(socket.id + " " + data.x + " " + data.y  + " " + data.a + " " + data.score);
    var player = new Player(socket.id, data.x, data.y, data.a, data.score);
    playersinfo.push(player);
    }
  );

socket.on('update',
  function(data){
    var player;
    for (var i = 0; i < playersinfo.length; i++) {
      if(socket.id == playersinfo[i].id) {
        player = playersinfo[i];
      }
    }
    player.x = data.x;
    player.y = data.y;
    player.a = data.a;
    player.score = data.score;

  });

  socket.on('killplayer',
    function(data){
      io.to(data).emit('killed',true);
    });





}
