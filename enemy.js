function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

function enemy(brain) {
	this.h = height/50;
	this.w = this.h;

	this.x = width/2
  this.y = 0;

	this.speedY = this.h/10;
  this.constSpeedX = this.w/10/2;
  this.speedX = this.constSpeedX;

  this.score = 0;

  if (brain instanceof NeuralNetwork) {
    this.brain = brain.copy();
    this.brain.mutate(mutate);
  } else {
    this.brain = new NeuralNetwork(12, 20, 3);
  }

  this.copy = function() {
    return new enemy(this.brain);
  }

  this.think = function() {
    let inputs = [];

    //bullet1 x,y
    if(bullets[0] != null) inputs[0] = bullets[0].x/width;
    else inputs[0] = 0;

    if(bullets[0] != null) inputs[1] = bullets[0].y/height;
    else inputs[1] = 0;

    //bullet2 x,y
    if(bullets[1] != null) inputs[2] = bullets[1].x/width;
    else inputs[2] = 0;

    if(bullets[1] != null) inputs[3] = bullets[1].y/height;
    else inputs[3] = 0;

    //bullet3 x,y
    if(bullets[2] != null) inputs[4] = bullets[2].x/width;
    else inputs[4] = 0;

    if(bullets[2] != null) inputs[5] = bullets[2].y/height;
    else inputs[5] = 0;

    //bullet4 x,y
    if(bullets[3] != null) inputs[6] = bullets[3].x/width;
    else inputs[6] = 0;

    if(bullets[3] != null) inputs[7] = bullets[3].y/height;
    else inputs[7] = 0;

    //bullet5 x,y
    if(bullets[4] != null) inputs[8] = bullets[4].x/width;
    else inputs[8] = 0;

    if(bullets[4] != null) inputs[9] = bullets[4].y/height;
    else inputs[9] = 0;

    //this x,y
    inputs[10] = this.x/width;
    inputs[11] = this.y/height;

    let action = this.brain.predict(inputs);
    // if (action[0] > action[1]) {
    //   this.turn();
    // }
    let max = maxOfArray(action);
    if(max == 0) {
      this.turnLeft();
    }else if(max == 1) {
      this.turnRight();
    } else {
      this.Strait();
    }

  }

	this.show = function() {
    noStroke();
    fill(255, 150, 150);
    triangle(this.x-this.w/2, this.y, this.x, this.y+this.h, this.x+this.w/2, this.y);
  }

  this.update = function() {
    this.y += this.speedY;
    this.x += this.speedX;
  }

  this.outOfScreenLR = function() {
    if(this.x-this.w/2 > width || this.x+this.w/2 < 0){
      return true;
    }
    return false;
  }

  this.outOfScreenB = function() {
    if(this.y > height > 0){
      return true;
    }
    return false;
  }

  this.turnLeft = function() {
    this.speedX = -this.constSpeedX;
  }

  this.turnRight = function() {
    this.speedX = this.constSpeedX;
  }

  this.Strait = function() {
    this.speedX = 0;
  }
  
}