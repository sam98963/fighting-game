const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

class Sprite {
  constructor({position, velocity, direction, directionChangeDelay, jumped, color}){
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.direction = direction;
    this.directionChangeDelay = directionChangeDelay || 25;
    this.directionChangeCooldown = 0;
    this.jumped = jumped;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50
    };
    this.color = color
  }

  draw(){
    canvasContext.fillStyle = this.color
    canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);

    // draw attackbox
    canvasContext.fillStyle = "white"
    canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
  }

  enemyMove(){
    if (this.directionChangeCooldown <= 0) {
      enemy.direction = player.position.x > this.position.x ? 1 : -1;
      this.directionChangeCooldown = this.directionChangeDelay;
    } else {
      this.directionChangeCooldown--;
    }
     enemy.velocity.y = player.velocity.y
     enemy.velocity.x = enemy.direction * 2
  }

  update(){
    this.draw();
    this.enemyMove();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if(this.position.y + this.height >= canvas.height){
      this.position.y = canvas.height - this.height;
      this.velocity.y = 0;
      this.jumped = false;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position:{
  x:0,
  y:0
  },
  velocity: {
    x: 0,
    y: 10,
  },
  jumped: false,
  color: "green"
})

const enemy = new Sprite({
  position:{
    x:400,
    y:0
    },
    velocity: {
      x: 0,
      y: 0,
    }, direction: -1,
    jumped: false,
    color: "red"
  })

player.draw();
enemy.draw();

const keys = {
  a : {
    pressed: false
  },
  d : {
    pressed: false
  },
  w : {
    pressed: false
  }
}

function animate(){
  window.requestAnimationFrame(animate)
  canvasContext.fillStyle = "black"
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player Movement
  if(keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -3;
  } else if(keys.d.pressed && player.lastKey === "d"){
    player.velocity.x = 3;
  }

  // Hit Detection
  if(player.attackBox.position.x + player.attackBox.width >= enemy.position.x 
    && player.attackBox.position.x <= enemy.position.x + enemy.width
    && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
    && player.attackBox.position.y <= enemy.position.y + enemy.height){
    console.log("hit")
  }
}

animate();

window.addEventListener("keydown", (e)=>{
  switch(e.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
    break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
    break;
    case "w":
      if(!player.jumped){
      player.velocity.y = -12;
      player.jumped = true;
      }
    break;
  }
})
window.addEventListener("keyup", (e)=>{
  switch(e.key) {
    case "d":
      keys.d.pressed = false;
    break;
    case "a":
      keys.a.pressed = false;
    break;
  }
})