const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

class Sprite {
  constructor({position, velocity, direction}){
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastKey;
    this.direction = direction;
  }

  draw(){
    canvasContext.fillStyle = "red"
    canvasContext.fillRect(this.position.x, this.position.y, 60, this.height);
  }

  enemyMove(){
     enemy.direction = player.position.x > enemy.position.x ? 1 : -1
     enemy.velocity.x = enemy.direction * 2
  }

  update(){
    this.draw();
    this.enemyMove();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if(this.position.y + this.height >= canvas.height){
      this.velocity.y = 0;
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
  }})

const enemy = new Sprite({
  position:{
    x:400,
    y:0
    },
    velocity: {
      x: 0,
      y: 0,
    }, direction: -1
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
      player.velocity.y = -12;
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