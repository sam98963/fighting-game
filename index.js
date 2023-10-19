const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {
  constructor({position, velocity}){
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw(){
    canvasContext.fillStyle = "red"
    canvasContext.fillRect(this.position.x, this.position.y, 60, this.height);
  }

  update(){
    this.draw();
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
    }})

player.draw();
enemy.draw();

const keys = {
  a : {
    pressed: false
  },
  d : {
    pressed: false
  }
}

let lastKey = "";

function animate(){
  window.requestAnimationFrame(animate)
  canvasContext.fillStyle = "black"
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  if(keys.a.pressed && lastKey === "a") {
    player.velocity.x = -1;
  } else if(keys.d.pressed && lastKey === "d"){
    player.velocity.x = 1;
  } else {
    player.velocity.x = 0;
  }
}

animate();

window.addEventListener("keydown", (e)=>{
  switch(e.key) {
    case "d":
      keys.d.pressed = true;
      lastKey = "d"
    break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a"
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