

// Keep track of our socket connection

var socket;
var playerid;
var scoreadd;
var player;
var playersinfo = [];
var slope;
var d;
var b;
var othera;
var killed;
let enemyImage;
let playerImage;
let sword;
function setup() {

  createCanvas(displayWidth, displayHeight-100);
  frameRate(60);
  playerImage = loadImage('player.png');
  enemyImage = loadImage('playerred.png');
  sword = loadImage('sword.png');
  //command for ngrok: 'ngrok http 3000'
  //socket = io.connect('http://422a9a36.ngrok.io');
  socket = io.connect('http://localhost:3000');

  player = new Player(random(width-60), random(height-60), 0.1, 0);

  var data = {
  x: 
  player.x, 
  y: 
  player.y, 
  a: 
  player.a, 
  score: 
  player.score
};

socket.emit('start', data);

socket.on('heartbeat', 
  function(data) {
  //console.log(data);
  playersinfo = data;
}
);


socket.on('killed', 
  function(data) {
  killed = data;
  console.log('got killed data');
}
);




socket.on('clientid', 
  function(data) {
  playerid = data;
}
);

}


function draw() {
  if (killed == true) {
    background(255);
    textSize(30);
    textAlign(CENTER);
    text('You were murdered! Press r to start again!', width/2, height/2);


  
  player.x = -1000;
  if (keyIsPressed == true && key == 'r') {
    killed = false;
    player.x = random(width);
    player.y = random(height);

  }
} else {
  background(100, 232, 88);
  console.log(playerid);
  for (var i = playersinfo.length -1; i >=0; i--) {
    console.log("in for"+i);
    var id = playersinfo[i].id;
    if (playersinfo[i].id == playerid) {
      if (scoreadd) {
        player.score = playersinfo[i].score + 1;

        scoreadd = false;
      }
    }
    if (id.substring(2, id.length) != socket.id) {
      console.log('first if');
      if (playersinfo[i].id != playerid) {
        console.log('second if');
        noFill();
        ellipse(playersinfo[i].x, playersinfo[i].y, 30, 30);
        imageMode(CENTER);
        image(enemyImage, playersinfo[i].x, playersinfo[i].y, 90, 90);

        push();
        fill(0);
        translate(playersinfo[i].x, playersinfo[i].y);
        rotate(playersinfo[i].a);
        imageMode(CORNER);

        image(sword, -30, -50, 130, 108);
        pop();


        d = dist(player.x, player.y, playersinfo[i].x, playersinfo[i].y);
        slope = (player.y - mouseY) / (player.x - mouseX);
        b = player.y - slope * player.x;
        angle = atan2(playersinfo[i].y - player.y, playersinfo[i].x - player.x);
        othera = atan2(mouseY - player.y, mouseX - player.x);
        console.log('finished calc d: ' + d);
        if (slope * playersinfo[i].x + b > playersinfo[i].y - 15 && slope *  playersinfo[i].x + b < playersinfo[i].y + 15||
          (playersinfo[i].y - b)/slope>playersinfo[i].x - 15 && (playersinfo[i].y - b)/slope<playersinfo[i].x + 15) {
          if (d<100 && angle > othera - 90 && angle < othera + 90) {
            scoreadd = true;
            socket.emit('killplayer', playersinfo[i].id);
          }
        }
      }
      fill(255);
      textAlign(CENTER);
      textSize(8);
      text(playersinfo[i].id, playersinfo[i].x, playersinfo[i].y + 35);

      textAlign(RIGHT);
      textSize(16);
      text(playersinfo[i].id + "........" + playersinfo[i].score, width - 40, 30 + i * 20);
    }
  }
  player.update();    
  player.show();
}

var data = {
  x:
player.x, 
  y:
player.y, 
  a:
player.a, 
  score: 
player.score
  };

socket.emit('update', data);

}


function Player(x, y, a, score) {
  this.x = x;
  this.y = y;
  this.a = a;
  this.score = score;
  this.update = function() {
    var slope = (this.y - mouseY) / (this.x -mouseX);
    var b = this.y - slope*this.x;
    if (keyIsDown(UP_ARROW) && this.y > 30) {
      this.y -= 3;
    }
    if (keyIsDown(DOWN_ARROW) && this.y < height - 120) {
      this.y += 3;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < width - 80) {
      this.x += 3;
    }
    if (keyIsDown(LEFT_ARROW) && this.x > 30) {
      this.x -= 3;
    }
  }

  this.show = function() {

    noStroke();
    noFill();
    ellipse(this.x, this.y, 30, 30);
    fill(0);
    imageMode(CENTER);
    image(playerImage, this.x, this.y, 90, 90);
    fill(0);
    this.a = atan2(mouseY - this.y, mouseX - this.x);

    push();
    translate(this.x, this.y);
    rotate(this.a);
    imageMode(CORNER);
    image(sword, -30, -50, 130, 108);
    pop();
  }
}
