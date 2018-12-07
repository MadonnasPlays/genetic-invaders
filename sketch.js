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

let createNewGeneration;

function setup() {
	createCanvas(500, 800);
	frameRate(60);

	fireTime = 0;
	fireTimeLimit = 15;
	bulletAmount = 5;

	enemyMaxPop = 50;
	currentAliveEnemies = 0;

	firstRound = true;

	autoFire = true;

	totalEnemies = 0;
	totalKills = 0;
	totalPassed = 0;
	generation = 1;

	createNewGeneration = true;

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
		if(enemies[i].frameStart >= frameCount) continue;

		enemies[i].think();
		enemies[i].update();
		enemies[i].show();

		if(enemies[i].outOfScreenLR()) {
			enemies[i].score = enemies[i].y/height;
			oldEnemies.push(enemies[i]);
			enemies.splice(i, 1);
			continue;
		}

		if(enemies[i].outOfScreenB()) {
			enemies[i].score = (enemies[i].y/height)+2;
			oldEnemies.push(enemies[i]);
			enemies.splice(i, 1);
			totalPassed++;
		}
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

	Player.show();

	//BULLETS
	for (let i = bullets.length-1; i >= 0; i--){
		bullets[i].update();
		bullets[i].show();
		
		if(bullets[i].outOfScreen()) {
			bullets.splice(i, 1);
			continue;
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
	if(createNewGeneration) {
		//if(frameCount % 15 == 0){
		for(let i = 0; i < enemyMaxPop; i++) {
			let enem;
			if(firstRound){
				enem = new enemy();
			}else{
				enem = new enemy(poolSelection());
			}
			enem.frameStart = frameCount + (15 * i);
			enemies.push(enem);

			totalEnemies++;
			currentAliveEnemies++;
		}

		createNewGeneration = false;

		oldEnemies = [];
		//}
	}else{
		if(enemies.length == 0){
			//New Generation
			firstRound = false;
			
			oldEnCount = oldEnemies.length;

			generation++;

			createNewGeneration = true;
		}
	}
}

function poolSelection() {
	let sum1 = 0;
	let sum2 = 0;

	for(let i = enemyMaxPop-1; i >= 0; i--) {
		sum1 += oldEnemies[i].score;
	}
	
	let randVal = random(0, sum1);

	for(let i = enemyMaxPop-1; i >= 0; i--) {
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