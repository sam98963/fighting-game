const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");
const enemyHealthDiv = document.querySelector("#enemy-health")
const playerHealthDiv = document.querySelector("#player-health")
let gameRunning = true;

canvas.width = 1024;
canvas.height = 576;

let currentRound = 1;
let maxEnemyHealth = 100;
let lastAttackTime = 0;
const attackCooldown = 150;
let enemyBehind = false;
let string = ""

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imgSrc: "./img/jungle.jpg",
  scale: 0.2
})

const player = new Fighter({
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
  imgSrc: "./img/player_sprite/Idle.png",
  maxFrames: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 180
  },
  sprites: {
    idle: {
      imgSrc: "./img/player_sprite/Idle.png",
      maxFrames: 8
    },
    run: {
      imgSrc: "./img/player_sprite/Run.png",
      maxFrames: 8
    },
    runLeft: {
      imgSrc: "./img/player_sprite/Run-Left.png",
      maxFrames: 8
    },
    jump: {
      imgSrc: "./img/player_sprite/Jump.png",
      maxFrames: 2
    },
    fall: {
      imgSrc: "./img/player_sprite/Fall.png",
      maxFrames: 2
    },
    attack1: {
      imgSrc: "./img/player_sprite/Attack1.png",
      maxFrames: 6
    }
  },
  attackBox: {
    offset: {
      x: 75,
      y: 0
    }, width: 160,
    height: 120
  }
})
let enemy = initializeNewEnemy();
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
animate();
startRoundCountdown();

function animate(){
  if (!gameRunning) {
    return;
  }
  window.requestAnimationFrame(animate)

  canvasContext.fillStyle = "black"
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  player.update()
  enemy.update()

  offsetAttackBox({rectangle1: player, rectangle2: enemy})
  offsetAttackBox({rectangle1: enemy, rectangle2: player})

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  // Player Movement

  if(enemyBehind){
    string = "Left"
  } else {
    string = ""
  }
  console.log(string)

  if(keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -3;
    player.switchSprite(`run${string}`);
  } else if(keys.d.pressed && player.lastKey === "d"){
    player.velocity.x = 3;
    player.switchSprite(`run${string}`);
  } else {
    player.switchSprite("idle");
  }

  if(player.velocity.y < 0){
    player.switchSprite("jump");
  } else if(player.velocity.y > 0){
    player.switchSprite("fall")
  }

  
  if(player.velocity.y !== 0){
    player.isJumping = true;
  } else{
    player.isJumping = false;
  }

  // Hit Detection
  if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.currentFrame === 4){
    document.querySelector("#score").textContent = +document.querySelector("#score").textContent + (Math.floor(Math.random()*5)*5 + 40)
    enemy.health -= 20
    player.isAttacking = false
    shakeScreen(10, 200);
    enemyHealthDiv.style.width = ((enemy.health / maxEnemyHealth)*100) + "%"
    document.querySelector("#enemy-health-container").style.border = '1px solid red';
    setTimeout(() => {
      document.querySelector("#enemy-health-container").style.border = '1px solid transparent';
    }, 500);
  }
  if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.currentFrame === 2){
    player.health -= 20
    shakeScreen(12, 200);
    enemy.isAttacking = false;
    playerHealthDiv.style.width = player.health + '%';
    document.querySelector("#player-health-container").style.border = '1px solid red';
    setTimeout(() => {
      document.querySelector("#player-health-container").style.border = '1px solid transparent';
    }, 500);
  }

  if(player.isAttacking && player.currentFrame === 4){
    player.isAttacking === false;
  }
  if(enemy.isAttacking && enemy.currentFrame === 3){
    enemy.isAttacking === false;
  }



// End round based on health
  if(player.health<=0){
    gameRunning = false;
    document.querySelector("#result").textContent = 'Computer Wins!';
  }

  // Check if the player has defeated the current enemy
  if (enemy.health <= 0) {
    startRoundCountdown();
  }
}

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
      player.velocity.y = -15;
      player.jumped = true;
      player.reduceHeight = true;
      }
    break;
    case " ":
      if(!player.isJumping && canPlayerAttack()){
        player.attack();
        resetAttackCooldown();
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



