"use strict";

const WIDTH = 55;
const CANVAS_WIDTH = 400;

// game variables
const imageWidth = 55;
const imageHeight = 55;
// let highestScore = 0;
// let currentScore = 0;
// enemies variables
const numberOfEnemies = 4;
const yPositionArray = [60, 145, 225];
const initialEnemyXPosition = -125 ;
const enemyImage = 'images/enemy-bug.png';
// stores all instances of Enemy
const allEnemies = [];
// player Variables
const initialPlayerXPosition = 202;
const initialPlayerYPosition = 405;

//knockout setup
if (!localStorage.highestScore) {
  localStorage.setItem("highestScore", 0);
}
//knockout ViewModel
var gameViewModel = {
    highestScore: ko.observable(localStorage.highestScore),
    currentScore: ko.observable(0)
};
// bind the model
ko.applyBindings(gameViewModel);


// Enemies our player must avoid
const Enemy = function() {
    // Variables applied to each of our instances go here,

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = enemyImage;
    this.yPositionArray = yPositionArray;
    this.x = initialEnemyXPosition;
    this.y = this.yPositionArray[Math.floor(Math.random() * this.yPositionArray.lenght)];
    this.speed = (Math.random() * (300-100)) + 100;
    this.height = imageWidth;
    this.width = imageHeight;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if(this.x > CANVAS_WIDTH + 100) {
      this.x = -125;
      this.y = this.yPositionArray[Math.round(Math.random() * this.yPositionArray.length)];
    }

    this.x += this.speed *dt;

    this.left = this.x;
    this.top = this.y;
    this.right = this.x + WIDTH;
    this.bottom = this.y + WIDTH;

    this.checkCollisions(this, player);
};

//Bounding box collision algorithm
// https://www.youtube.com/watch?v=8b_reDI7iPM
Enemy.prototype.isColliding = (enemy, player) => {

    if((player.x + player.width) >= (enemy.x) &&
      (player.x) <= (enemy.x + enemy.width) &&
      (player.y + player.height) >= (enemy.y) &&
      (player.y) <= (enemy.y + enemy.height)){
        return true;
      };
};

// If enemy and player touch, then reset player to starting position
Enemy.prototype.checkCollisions = (enemy, player) => {
  if(enemy.isColliding(enemy, player)){
    // collison has happened, reset the game
    game.reset(player);
  }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player
const Player = function(){
  this.sprite = 'images/char-boy.png';
  this.x = initialPlayerXPosition;
  this.y = initialPlayerYPosition;
  this.height = imageWidth;
  this.width = imageHeight;
}

Player.prototype.update = function() {
  //check the position of player and do the needful :)
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x > CANVAS_WIDTH) {
    player.x = CANVAS_WIDTH;
  } else if  (player.y > initialPlayerYPosition) {
    player.y = initialPlayerYPosition;
  } else if (player.y < 0) {
    // make sure player doesn't go out of bound
    player.y = 0;
    // player has reached to water, add point and restart the game
    game.restart(player);
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
};

Player.prototype.handleInput = function(key) {
  const player = this;
  if (key === 'up') {
    player.y -=83;
  } else if (key === 'down') {
    player.y += 83;
  } else if (key === 'left') {
    player.x -= 102;
  } else if(key === 'right'){
    player.x += 102;
  }

  player.update();

};

//responsible for reseting and restarting the game
const game = {
  // handle the case when player has reached water and add 1 point to score
  restart: (player)=>{
    console.log('Game restart');
    player.x = initialPlayerXPosition;
    player.y = initialPlayerYPosition;
    //update the currentScore, once player reaches river
    gameViewModel.currentScore(gameViewModel.currentScore() + 1);
  },
  // resets the game and set score to zero
  reset: (player)=>{
    console.log('game reset');
    // if current score is greater than highestScore , set the new score as highest score
    if(gameViewModel.currentScore() > localStorage.highestScore){
      // update the localStorage
      localStorage.highestScore = gameViewModel.currentScore();
      // update knockout model
      gameViewModel.highestScore(localStorage.highestScore);
    }
    // reset current score
    gameViewModel.currentScore(0);
    // reset player position
    player.x = initialPlayerXPosition;
    player.y = initialPlayerYPosition;
  }
}


// Now instantiate Enemy and Player objects.
// Place all enemy objects in an array called allEnemies
for (let i = 0; i < numberOfEnemies; i++){
  allEnemies.push(new Enemy());
}

// Place the player object in a variable called player
const player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
