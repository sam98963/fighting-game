const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);


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

    if(this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0;
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

function animate(){
  window.requestAnimationFrame(animate)
  canvasContext.fillStyle = "black"
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()
}

animate();