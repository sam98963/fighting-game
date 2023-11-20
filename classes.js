
class Sprite {
  constructor({position, img, scale = 1, maxFrames = 1, offset = {x: 0, y: 0}}){
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.img = new Image();
    this.img.src = img;
    this.scale = scale;
    this.maxFrames = maxFrames;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.frameDuration = 1;
    this.offset = offset;
  }

  draw(){
    canvasContext.drawImage(
      this.img,
      // crop code for frame sheet
      this.currentFrame * (this.img.width / this.maxFrames),
      0,
      this.img.width / this.maxFrames,
      this.img.height,
      // End
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.img.width / this.maxFrames) * this.scale,
      this.img.height * this.scale);
  }

  update(){
    this.draw();
    this.elapsedFrames++
    if(this.elapsedFrames % this.frameDuration === 0){
      if(this.currentFrame < this.maxFrames - 1){
      this.currentFrame++
      } else{
        this.currentFrame = 0;
      }
    }
  }
}

class Fighter extends Sprite{
  constructor({
    position,
    velocity,
    direction,
    directionChangeDelay,
    jumped,
    color,
    img,
    scale = 1,
    maxFrames = 1,
    offset = {x: 0, y: 0}}){
      
      super({
          position, img, scale, maxFrames, offset
      })
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
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.frameDuration = 1;
  }




  // draw(){
  //   canvasContext.fillStyle = this.color
  //   const adjustedHeight = this.reduceHeight ? 75 : 150;
  //   canvasContext.fillRect(this.position.x, this.position.y, this.width, adjustedHeight);

  //   // draw attackbox
  //   if(this.isAttacking){
  //   canvasContext.fillStyle = "white"
  //   canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
  //   }
  // }



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