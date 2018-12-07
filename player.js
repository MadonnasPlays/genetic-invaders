function player() {
	this.h = height/25;
	this.w = this.h;

	this.x = width/2;
	this.y = height - this.h/10;

	this.speed = this.w/5;

	this.show = function() {
    	noStroke();
    	fill(255, 255, 255);
    	triangle(this.x-this.w/2, this.y, this.x, this.y-this.h, this.x+this.w/2, this.y);
  	}

  	this.left = function() {
		this.x -= this.speed;
  	}

  	this.right = function() {
  		this.x += this.speed;
  	}

  	this.fire = function() {
  		bullets.push(new bullet(this.x, this.y-this.h));
  	}
}

function bullet(x, y) {
	this.h = width/40;
	this.w = this.h/3;

	this.x = x;
	this.y = y;

	this.speed = this.h/2;

	this.show = function() {
		noStroke();
    	fill(255, 255, 255);
    	rect(this.x, this.y, this.w, this.h);
	}

	this.update = function() {
		this.y -= this.speed;
	}

	this.outOfScreen = function() {
		if(this.y < 0){
			return true;
		}
		return false;
	}


	this.hitted = function(ene) {
	    if( ((ene.x + (ene.w/2)) > (this.x - (this.w/2)) && (ene.x - (ene.w/2)) < (this.x + (this.w/2))) && ((ene.y + (ene.h/2)) > (this.y - (this.h/2)) && (ene.y - (ene.h/2)) < (this.y + (this.h/2))) ){
	        return true;
		}
	    return false;
	}
}