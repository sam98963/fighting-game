// ROUNDS AND SPAWNING
function startRoundCountdown() {
  gameRunning = false;
  let counter = 3;
  const countdown = document.querySelector("#countdown-container")
  const roundNumber = document.querySelector("#round-number-container")
  roundNumber.textContent = "Round " + currentRound + "!";
  countdown.style.visibility = "visible";
  roundNumber.style.visibility = "visible";
  const countdownInterval = setInterval(() => {
    counter--;
    countdown.textContent = counter;
    if (counter === 0) {
      clearInterval(countdownInterval);
      startNewRound();
      gameRunning = true;
      animate();
      countdown.style.visibility = "hidden";
      roundNumber.style.visibility = "hidden";
      countdown.textContent = 3;
    }
  }, 1000);
}
function startNewRound() {
  currentRound++;
  player.health = 100;
  player.position.x = 0;
  player.position.y = 0;
  player.velocity.x = 0;
  player.jumped = false;

  playerHealthDiv.style.width = player.health + "%"
  enemy = initializeNewEnemy();
  enemyHealthDiv.style.width = ((enemy.health / maxEnemyHealth)*100) + "%"
}
function initializeNewEnemy() {
  const enemy = new Fighter({
    position: {
      x: 400,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    direction: -1,
    jumped: false,
    color: "red",
      offset: {
      x: 50,
      y: 0
    },
  });

  enemy.velocity.x = 2 + (currentRound - 1) * 0.5;
  maxEnemyHealth = 100 + (currentRound - 1) * 50;
  enemy.health = maxEnemyHealth;
  return enemy;
}
// ATTACK AND COLLISION
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
function canPlayerAttack(){
  const currentTime = Date.now();
  return currentTime - lastAttackTime >= attackCooldown
}
function resetAttackCooldown(){
  lastAttackTime = Date.now()
}
// MOVEMENT
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
function enemyMove(){
  // If player has jumped, enemy has not jumped and enemy is not currently jumping --> Enemy jump at a random time between 0-0.8s
  if(player.jumped && !enemy.jumped && !enemy.isJumping){
    const randomDelay = (Math.random() * 800) 
    enemy.isJumping = true;
    setTimeout(()=>{
      enemy.reduceHeight = true;
      enemy.velocity.y = -12;
      enemy.jumped = true;
      enemy.isJumping = false;
    }, randomDelay)
    enemy.reduceHeight = false
  }
  // Update enemy movement by direction
   enemy.velocity.x = enemy.direction * 2

  // If within attacking range - attack randomly between 0.5 and 4s
   if (Math.abs(enemy.position.x - player.position.x) <= 120 && !enemy.isAttacking && !enemy.attacked) {
    enemy.attacked = true;
    const attackDelay = Math.random() * 3250 + 750;
    enemy.attack();
    setTimeout(() => {
      enemy.attacked = false;
    }, attackDelay);
  }
}
// VISUAL
function shakeScreen(intensity, duration) {
  const originalX = canvas.width / 2;
  const originalY = canvas.height / 2;
  const shakeInterval = 1000 / 60; // 60 FPS

  const startTime = Date.now();

  function updateShake() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
          const xOffset = Math.random() * intensity - intensity / 2;
          const yOffset = Math.random() * intensity - intensity / 2;
          canvasContext.translate(xOffset, yOffset);
          background.draw()
          player.draw();
          enemy.draw();
          canvasContext.translate(-xOffset, -yOffset);
          requestAnimationFrame(updateShake);
      } else {
          // Reset the canvas to its original position
          canvasContext.setTransform(1, 0, 0, 1, 0, 0);
      }
  }
  requestAnimationFrame(updateShake);
}