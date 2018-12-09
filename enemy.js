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
  	input_size = 4+bulletAmount*2;
  	output_size =3;
  	hidden_size = 5;
    this.brain = new NeuralNetwork(input_size, hidden_size, output_size);
  }

  this.timescale = timescale;

  this.copy = function() {
    return new enemy(this.brain);
  }

  this.think = function() {
    let inputs = [];
    
    //this x,y
    inputs[0] = this.x/width;
    inputs[1] = this.y/height;

    //player x,y
    inputs[2] = Player.x/width;
    inputs[3] = Player.y/height;

    for(var i=0;i<bulletAmount;i++){
	    //bullet i x,y
	    if(bullets[i] != null) inputs[4+i*2 +0] = bullets[i].x/width;
	    else inputs[4+i*2 +0] = -1;

	    if(bullets[i] != null) inputs[4+i*2+1] = bullets[i].y/height;
	    else inputs[4+i*2+1] = -1;
		}


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