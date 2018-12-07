var Player;

var bullets = [];

var enemies = [];
var oldEnemies = [];

var fireTime;
var fireTimeLimit;
var bulletAmount;

let enemyMaxPop;
let currentAliveEnemies;

let firstRound;
let oldEnCount;

let autoFire;

let totalEnemies;
let totalKills;
let totalPassed;
let generation;

function setup() {
	createCanvas(500, 800);
	frameRate(60);

	fireTime = 0;
	fireTimeLimit = 15;
	bulletAmount = 5;

	enemyMaxPop = 10;
	currentAliveEnemies = 0;

	firstRound = true;

	autoFire = false;

	totalEnemies = 0;
	totalKills = 0;
	totalPassed = 0;
	generation = 1;

	Player = new player();
}

function draw() {
	background(0);

	//textAlign(RIGHT);.
	text("Generation: " + generation, 5, 15);
	text("TotalAlive: " + totalEnemies, 5, 30);
	text("Kills: " + totalKills, 5, 45);
	text("Passed: " + totalPassed, 5, 60);

	//key 79 = o
	if (keyIsDown(79)) {
		autoFire = true;
  	}

  	//key 80 = p
	if (keyIsDown(80)) {
		autoFire = false;
  	}

	//ENEMIES
	for (let i = enemies.length-1; i >= 0; i--){
		enemies[i].think();
		enemies[i].update();
		enemies[i].show();

		if(enemies[i].outOfScreenLR()) {
			enemies[i].score = enemies[i].y/height;
			oldEnemies.push(enemies[i]);
			enemies.splice(i, 1);
			break;
		}

		if(enemies[i].outOfScreenB()) {
			
			enemies[i].score = (enemies[i].y/height)+100;
			oldEnemies.push(enemies[i]);
			enemies.splice(i, 1);

			totalPassed++;

			break;
		}

		// if(random(0, 10) < 1 && frameCount % 10 == 0){
		// 	enemies[i].turn();
		// }
	}

	//PLAYER
	if(keyIsDown(37) && (Player.x-Player.w/2 > 0)) {
    	Player.left();
  	}

  	if (keyIsDown(39) && (Player.x+Player.w/2 < width)) {
  		Player.right();
  	}

  	fireTime++;
  	if(bullets.length < bulletAmount && fireTime > fireTimeLimit){
  		if(keyIsDown(32) || autoFire) {
  			Player.fire();
  			fireTime = 0;
  		}
  	}

  	////////////
  	// if(bullets.length < bulletAmount && fireTime > fireTimeLimit){
  	// 	if(autoFire) {
  	// 		bullets.push(new bullet(random(10,width-10), height - height/25/10-height/25));
  	// 		fireTime = 0;
  	// 	}
  	// }

	Player.show();

	//BULLETS
	for (let i = bullets.length-1; i >= 0; i--){
		bullets[i].update();
		bullets[i].show();
		
		if(bullets[i].outOfScreen()) {
			bullets.splice(i, 1);
			break;
		}

		for(let j = enemies.length-1; j >= 0; j--) {
			if(bullets[i].hitted(enemies[j])) {
				bullets.splice(i, 1);

				enemies[j].score = enemies[j].y/height;
				oldEnemies.push(enemies[j]);
				enemies.splice(j, 1);

				totalKills++;

				break;
			}
		}	
	}

	//Spawn enemy
	if(currentAliveEnemies < enemyMaxPop) {
		if(frameCount % 15 == 0){
			let enem;
			if(firstRound){
				enem = new enemy();
			}else{
				enem = new enemy(poolSelection());
			}
			enemies.push(enem);

			totalEnemies++;
			currentAliveEnemies++;
		}
	}else{
		if(enemies.length == 0){
			//New Generation
			firstRound = false;
			
			oldEnCount = oldEnemies.length;

			generation++;

			currentAliveEnemies = 0;
		}
	}
}

function poolSelection() {
	let sum1 = 0;
	let sum2 = 0;

	for(let i = oldEnCount-1; i >= oldEnCount-enemyMaxPop; i--) {
		sum1 += oldEnemies[i].score;
	}

	let randVal = random(0, sum1);

	for(let i = oldEnCount-1; i >= oldEnCount-enemyMaxPop; i--) {
		sum2 += oldEnemies[i].score;
		if(sum2 > randVal) {
			return oldEnemies[i].brain;
		}
	}
	//never gonna return null...just in case
	return null;
}

function maxOfArray(array) {
	let maxIndex = 0;
	for(let i = 0; i < array.length; i++) {
		if(array[maxIndex] < array[i]) maxIndex = i;
	}
	return maxIndex;
}