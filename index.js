const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

class Sprite {
  constructor({position, velocity, direction, directionChangeDelay, jumped, color, offset}){
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.direction = direction;
    this.directionChangeDelay = directionChangeDelay || 25;
    this.directionChangeCooldown = 0;
    this.jumped = jumped;
    this.isJumping = false;
    this.attackBox = {
      position:{
        x: this.position.x,
        y: this.position.y
      }, offset,
      width: 100,
      height: 50
    };
    this.color = color,
    this.isAttacking;
    this.attacked = false,
    this.health = 100;
  }

  draw(){
    canvasContext.fillStyle = this.color
    canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);

    // draw attackbox
    if(this.isAttacking){
    canvasContext.fillStyle = "white"
    canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }
  }

  enemyMove(){
    // If player has jumped, enemy has not jumped and enemy is not currently jumping --> Enemy jump at a random time between 0-0.8s
    if(player.jumped && !enemy.jumped && !enemy.isJumping){
      const randomDelay = (Math.random() * 800) 
      enemy.isJumping = true;
      setTimeout(()=>{
        enemy.velocity.y = -12;
        enemy.jumped = true;
        enemy.isJumping = false;
      }, randomDelay)
    }
    // Update enemy movement by direction
     enemy.velocity.x = enemy.direction * 2

    // If within attacking range - attack randomly between 0.5 and 4s
     if (Math.abs(enemy.position.x - player.position.x) <= 120 && !enemy.isAttacking && !enemy.attacked) {
      enemy.attacked = true;
      const attackDelay = Math.random() * 3500 + 500;
      enemy.attack();
      setTimeout(() => {
        enemy.attacked = false;
      }, attackDelay);
    }
  }

  update(){
    this.draw();
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x
    this.attackBox.position.y = this.position.y
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

  attack(){
    this.isAttacking = true;
    setTimeout(()=>{
      this.isAttacking = false
    }, 100)
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
  color: "green",
  offset: {
    x: 50,
    y: 0
  }
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
    color: "red",
    offset: {
      x: 50,
      y: 0
    }
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

function rectangularCollision({
  rectangle1, rectangle2
}){
  return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function offsetAttackBox({ rectangle1, rectangle2 }) {
  const direction = rectangle2.position.x - rectangle1.position.x > 0 ? 1 : -1;
  if (direction !== rectangle1.direction) {
    if (!rectangle1.isAttacking) {
      if (direction > 0 && rectangle1 === player) {
        rectangle1.attackBox.offset.x -= 50;
      } else if (direction > 0 && rectangle1 === enemy){
        rectangle1.attackBox.offset.x -= 50;
      } else if (direction < 0 && rectangle1 === player) {
        rectangle1.attackBox.offset.x += 50;
      } else if (direction < 0 && rectangle1 === enemy){
        rectangle1.attackBox.offset.x += 50;
      }
    }
    rectangle1.direction = direction;
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
  if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking){
    player.isAttacking = false;
    document.querySelector("#score").textContent = +document.querySelector("#score").textContent + (Math.floor(Math.random()*5)*5 + 40)
  }
  if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking){
    enemy.isAttacking = false;
    player.health -= 20
    console.log("comp hit player")
    document.querySelector("#player-health").style.width = player.health + '%';
    document.querySelector("#health-container").style.border = '1px solid red';
    setTimeout(() => {
      document.querySelector("#health-container").style.border = '1px solid transparent';
    }, 500);
  }

  offsetAttackBox({rectangle1: player, rectangle2: enemy})
  offsetAttackBox({rectangle1: enemy, rectangle2: player})
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
    case " ":
    player.attack();
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