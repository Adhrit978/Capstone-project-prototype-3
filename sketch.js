const Engine=Matter.Engine;
const World=Matter.World;
const Body=Matter.Body;
const Bodies=Matter.Bodies;

let engine;
let world;

var backgroundimg;
var sub;
var subimg;
var wall1;
var wall2;
var wall3;
var wall4;
var hunter;
var hunters=[];
var nhunters=0;
var destroyedhunters=0;
var launcher;
var missile;
var nmissiles=0;
var missiles=[];
var explosionimg;
var gamestate="play";

function preload() {
  backgroundimg=loadImage("background.jpeg");
  subimg=loadImage("sub.png");
  explosionimg=loadImage("explosion.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine=Engine.create();
  world=engine.world;

  sub=createSprite(190, height/2, 50, 50);
  sub.addImage(subimg);
  sub.scale=0.75;

  wall1=createSprite(0, height/2, 1, height*2);
  wall2=createSprite(width/2, height/2, 1, height*2);
  wall3=createSprite(width/2, 0, width*2, 1);
  wall4=createSprite(width/2, height, width*2, 1);
  wall1.visible=false;
  wall2.visible=false;
  wall3.visible=false;
  wall4.visible=false;

  launcher=new Launcher(sub.x+50, sub.y-50, 130, 50);

  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  Engine.update(engine);

  background(backgroundimg);

  if (destroyedhunters>=50) {
    gamepass();
    gamestate="pass";
  }

  if (gamestate=="play") {
    subcontrols();
    createhunters();
    showmissile();
    missilecount();
    huntercount();
    drawSprites();
    launcher.display();
    Matter.Body.setPosition(launcher.body, {x:sub.x+44, y:sub.y-50});
  }
}

function subcontrols() {
  if (keyDown(RIGHT_ARROW)) {
    sub.x+=4;
  }
  
  if (keyDown(LEFT_ARROW)) {
    sub.x-=4;
  }
  
  if (keyDown(UP_ARROW)) {
    sub.y-=4;
  }
  
  if (keyDown(DOWN_ARROW)) {
    sub.y+=4;
  }

  sub.bounceOff(wall1);
  sub.bounceOff(wall2);
  sub.bounceOff(wall3);
  sub.bounceOff(wall4);
}

function createhunters() {
  if (nhunters<50) {
    if (frameCount%60==0) {
      hunter=new Hunter(width, random(40, height-121), 90, 60);
      hunters.push(hunter);
      nhunters+=1;
    }
  }
  for (let i=0; i<hunters.length; i++) {
    hunters[i].display();
    hunters[i].move();
    if (hunters[i].body.position.x<=10) {
      gamefail();
      gamestate="fail";
    }
  }
}

function missilecount() {
  if (nmissiles<61) {
    stroke("black");
    fill("black");
    if (nmissiles>=40) {
      stroke("orange");
      fill("orange");
    }
    if (nmissiles>=50) {
      stroke("red");
      fill("red");
    }
    textSize(20);
    text(60-nmissiles+" missiles left", 15, 30);
  }
  else{
    stroke("red");
    fill("red");
    textSize(20);
    text(0+" missiles left", 15, 30);
  }
}

function huntercount() {
  if (destroyedhunters<51) {
    stroke("red");
    fill("red");
    if (destroyedhunters>=15) {
      stroke("orange");
      fill("orange");
    }
    if (destroyedhunters>=30) {
      stroke("black");
      fill("black");
    }
    textSize(20);
    text(50-destroyedhunters+ " hunters left", 15, 50);
  }
  else {
    stroke("black");
    fill("black");
    textSize(20);
    text(0+ "hunters left", 15, 50);
  }
}

function keyPressed() {
  if (gamestate=="play"&&missiles.length<1) {
    if (nmissiles<=60) {
      if (keyCode==32) {
        missile=new Missile(sub.x+44, sub.y-50, 100, 30, launcher.body.angle);
        missiles.push(missile);
        nmissiles+=1;
        missile.launch(launcher.angle);
      }
    }
  }
  if (gamestate=="fail") {
    if (keyCode==32) {
      location.reload();
    }
  }
  if (gamestate=="pass") {
    if (keyCode==32) {
      location.reload();
    }
  }
}

function showmissile() {
  if (hunters.length>0&&missiles.length>0) {
    var loopBreak=false;
    for (let i=0; i<missiles.length; i++) {
      missiles[i].display();
      for (let j=0; j<hunters.length; j++) {
        if (missiles.length<=0) {
          loopBreak=true;
          break;
        }
        var d=dist(missiles[i].body.position.x, missiles[i].body.position.y, hunters[j].body.position.x, hunters[j].body.position.y);
        if (missiles.length<=0) {
          loopBreak=true;
          break;
        }
        if (d<=100) {
          if (missiles.length<=0) {
            loopBreak=true;
            break;
          }
          var explosion=createSprite(hunters[j].body.position.x, hunters[j].body.position.y, 50, 50);
          explosion.addImage(explosionimg);
          explosion.scale=0.4;
          explosion.lifetime=10;
          if (missiles.length<=0) {
            loopBreak=true;
            break;
          }
          Matter.World.remove(world, missiles[i].body);
          missiles.splice(i, 1);
          Matter.World.remove(world, hunters[j].body);
          hunters[j].body=null;
          hunters.splice(j, 1);
          destroyedhunters+=1;
        }
        if (missiles.length<=0) {
          loopBreak=true;
          break;
        }
      }
      if (loopBreak==true) {
        break;
      }
      if (missiles[i].body.position.x>=width||missiles[i].body.position.y>=height||missiles[i].body.position.x<=0||missiles[i].body.position.y<=0) {
        if (loopBreak==true) {
          break;
        }
        Matter.World.remove(world, missiles[i].body);
        missiles.splice(i, 1);
      }
      if (loopBreak==true) {
        break;
      }
    }
  }
}

function gamepass() {
  swal(
    {
      title: `You win :)`,
      imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/sub.png",
      imageSize: "222x222",
      confirmButtonText: 'Play again'
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
        gameatate="play";
      }
    }
  );  
}

function gamefail() {
  swal(
    {
      title: `You lose :(`,
      imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/hunter.png",
      imageSize: "222x222",
      confirmButtonText: 'Play again'
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
        gamestate="play";
      }
    }
  );
}