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

	this.x = width/2;
  this.y = -this.h*2;

	this.speedY = this.h/10;
  this.constSpeedX = this.w/10/2;
  this.speedX = 0;

  this.score = 0;

  this.frameStart;

  if (brain instanceof NeuralNetwork) {
    this.brain = brain.copy();
    this.brain.mutate(mutate);
  } else {
    this.brain = new NeuralNetwork(14, 25, 3);
  }

  this.timescale = timescale;

  this.copy = function() {
    return new enemy(this.brain);
  }

  this.think = function() {
    let inputs = [];


    for(var i in bullets){
	    //bullet i x,y
	    if(bullets[i] != null) inputs[i*2 +0] = bullets[i].x/width;
	    else inputs[i*2 +0] = -1;

	    if(bullets[i] != null) inputs[i*2+1] = bullets[i].y/height;
	    else inputs[i*2+1] = -1;
		}

    //this x,y
    inputs[10] = this.x/width;
    inputs[11] = this.y/height;

    //player x,y
    inputs[12] = Player.x/width;
    inputs[13] = Player.y/height;

    let action = this.brain.predict(inputs);

    let max = maxOfArray(action);
    if(max == 0) {
      this.turnLeft();
    }else if(max == 1) {
      this.turnRight();
    } else {
      this.Strait();
    }

  }
  this.calculateScore = function(extraPoints = 0){
  	var scoreScreenProgress = this.y/height;
  	var scorePlayerDist = 1.0 / distance(this.x,this.y,Player.x,Player.y); 
  	this.score =  scoreScreenProgress + extraPoints;
  }

  this.show = function() {
    noStroke();
    fill(255, 150, 150);
    triangle(this.x-this.w/2, this.y, this.x, this.y+this.h, this.x+this.w/2, this.y);
  }

  this.update = function() {
    this.y += this.speedY * timescale;
    this.x += this.speedX * timescale;
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