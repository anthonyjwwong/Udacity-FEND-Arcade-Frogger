"use strict";

//Global Variable
const livesTracker = document.querySelector('.lifeDecrease');
const scoreIncrease = document.querySelector('.scoreIncrease');
const heartIncrease = document.querySelector('.heartIncrease');

//Variables for Character selection
const charBoy = document.querySelector('.charboy');
const charGirl = document.querySelector('.chargirl');
const charHorn = document.querySelector('.charhorn');
const harPrincess = document.querySelector('.charprincess');
const charPink = document.querySelector('.charpink');
const bug = document.querySelector('.bug');

//All these event Listeners are for you to pick characters.
charGirl.addEventListener('click', function() {
  if(player.sprite !== charGirl) {
    player.sprite = 'images/char-cat-girl.png';
  }
});

charBoy.addEventListener('click', function() {
  if(player.sprite !== charBoy) {
    player.sprite = 'images/char-boy.png';
  }
});

charHorn.addEventListener('click', function() {
  if(player.sprite !== charHorn) {
    player.sprite = 'images/char-horn-girl.png';
  }
});

charPink.addEventListener('click', function() {
  if(player.sprite !== charPink) {
    player.sprite = 'images/char-pink-girl.png';
  }
});

bug.addEventListener('click', function() {
  if(player.sprite !== bug) {
    player.sprite = 'images/enemy-bug.png';
  }
});


//Random number generator for x, y, speed coordinate
let getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

//Character class
class Character {
  constructor(x, y, width = 75, height = 60) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  //Render image for subclasses
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

//Enemy subclass
class Enemy extends Character {
  constructor(x, y, speed, sprite, width, height) {
    super(x, y, width, height);
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
  }
  
  render() {
    super.render();
  }

  //calculate speed, as well as on/off screen
  update(dt) {
    if(this.x <= 505) {
       this.x = this.x + this.speed * dt;
    } else {
       this.x = getRandomInt(-2, -200);
       this.speed = getRandomInt(350, 200);
    }
    //Add difficulty the higher the player score gets
    if (player.score > 10 && player.score <= 15) {
       this.speed = getRandomInt(450, 375);
    } else if (player.score > 15 && player.score < 20) {
       this.speed = getRandomInt(450, 400);
    }
  }
  
  //check for collision between player and enemy
  checkCollisions() {
    livesTracker.innerHTML = player.lives;
    
    if (player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y < this.y + this.height &&
        player.height + player.y > this.y) {
      
        //if collide, moves player back to starting position, and -1 life.
         player.x = 200;
         player.y = 485;
         player.lives--;
        //if player life = 0 , game resets
         player.gameLost();
    }
  }
}

//subclass for character, the player.
class Player extends Character {
  constructor(x, y, width, height, speed, sprite, lives = 3, score = 0) {
    super(x, y, width, height);
    this.lives = lives;
    this.score = score;
    this.sprite = "images/char-boy.png";
  }

  render() {
    super.render();
  }

  //handles the movements, as well as the border limit.
  handleInput(keys) {
    switch(keys) {
  		case 'left' :
        this.x = this.x - 100;
        if (this.x < 0) {
          this.x = 0;
        }
  		break;

  		case 'right' :
        this.x = this.x + 100;
        if (this.x > 400) {
          this.x = 400;
        }
  		break;

  		case 'down' :
        this.y = this.y + 85;
        if (this.y > 485) {
          this.y = 485;
        }
  		break;
        
      //if player reaches the river, player ++.
  		case 'up' :
        this.y = this.y - 85;
        if (this.y <= -25) {
          this.x = 200;
          this.y = 485;
          this.score++;
          scoreIncrease.innerHTML = this.score;
        //if player gets to 20, win games!
          if (this.score === 20) {
           this.winGame();
           this.reset();
          }
        }
  		break;
  	}
  }
  //reset function for winning or losing
  reset() {
    this.x = 200;
    this.y = 485;
    this.score = 0;
    scoreIncrease.innerHTML = 0;
    this.lives = 3;
    livesTracker.innerHTML = 3;
  }
  
  //life reaches 0;
  gameLost() {
    if (this.lives <= 0 && this.score < 20) {
       gameEnd();
       this.reset();
    }
  }
  //when u win game
  winGame() {
    gameWon();
  }

}

let player = new Player(200, 485, this.lives, this.score, this.sprite);

let allEnemies = [new Enemy(getRandomInt(-100, -700), 300, getRandomInt(400, 300)),
                  new Enemy(getRandomInt(-100, -700), 220, getRandomInt(300, 200)),
                  new Enemy(getRandomInt(-100, -700), 130, getRandomInt(430, 200))];

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//MODAL //START AND END MODAL!
let modal = document.getElementById('myModal');
let span = document.getElementsByClassName("close");
let endModal = document.getElementById('endModal');
let endModalScore = document.querySelector('.endModalScore');
let winModal = document.querySelector('#winModal');

window.onload = function modalUsed() {
  modal.style.display = 'block';
};

span.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == modal || event.target == endModal || event.target == winModal) {
        modal.style.display = 'none';
        endModal.style.display = 'none';
        winModal.style.display = 'none';
    }
};

function gameEnd() {
  endModal.style.display = "block";
  endModalScore.innerHTML = player.score;
}

function gameWon() {
  winModal.style.display = "block";
}
