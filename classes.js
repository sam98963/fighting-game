
class Sprite {
  constructor({position, img, scale = 1}){
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.img = new Image();
    this.img.src = img;
    this.scale = scale;
  }

  draw(){
    canvasContext.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.img.width * this.scale,
      this.img.height * this.scale);
  }

  update(){
    this.draw();
  }
}





class Fighter{
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
    this.reduceHeight = false;
  }

  draw(){
    canvasContext.fillStyle = this.color
    const adjustedHeight = this.reduceHeight ? 75 : 150;
    canvasContext.fillRect(this.position.x, this.position.y, this.width, adjustedHeight);

    // draw attackbox
    if(this.isAttacking){
    canvasContext.fillStyle = "white"
    canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }
  }



  update(){
    this.draw();
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x
    this.attackBox.position.y = this.position.y
    enemyMove();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if(this.position.y + this.height >= canvas.height){
      this.position.y = canvas.height - this.height;
      this.velocity.y = 0;
      this.jumped = false;
      this.reduceHeight = false;
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