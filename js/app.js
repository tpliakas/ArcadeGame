let low = 15,
    medium = 50,
    high = 90;
var allEnemies = [];
var myScoreBoard;
myScoreBoard = document.createElement('h1');
document.body.appendChild(myScoreBoard);

var GameObjects = function (x, y) {
    this.startPoint = 0;
    this.endPoint = 550;
    this.x = 0;
    this.y = 0;
    this.sprite;
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    GameObjects.call(this, Enemy);
    this.sprite = 'images/enemy-bug.png';
    this.x = (Math.floor(Math.random() * (-2000)) + 2);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.y = 60;
    for (let i = 0; i < allEnemies.length; i++) {
        allEnemies[i].startPoint = (Math.floor(Math.random() * (-2000)) + 2);
        // allEnemies[i].x += (low * dt);
        //Determines the speed of the bugs depending on your score
        if (player.score === 0 || player.score <= 1000) {
            allEnemies[i].x += (low * dt);
        } else if (player.score >= 1001 || player.score <= 2000) {
            allEnemies[i].x += (medium * dt);
        } else {
            allEnemies[i].x += (high * dt);
        }

        //Set the y-coordinate of the enemy
        allEnemies[i].y = allEnemies[i].y + 80;
        //Ensure your bugs doesnt go beyond their vertical limits (y-axis)
        if (allEnemies[i].y > 220) {
            allEnemies[i].y = 60;
        }
        //Ensure your bugs doesnt go beyond their horizontal limits x-axis
        if (allEnemies[i].x >= this.endPoint) {
            allEnemies[i].x = allEnemies[i].startPoint;
        } 
        
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var enemy6 = new Enemy();
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var enemy5 = new Enemy();
allEnemies.push(enemy1);
allEnemies.push(enemy6);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);
allEnemies.push(enemy5);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    GameObjects.call(this, Player);
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.lives = 3;
    this.x = 200;
    this.y = 380;
}

Player.prototype = Object.create(GameObjects);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    //updates the score board of the player
    myScoreBoard.innerHTML = `Score: ${player.score} Lives: ${player.lives}`;
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    checkCollision(this.x, this.y);
};

Player.prototype.handleInput = function (userInput) {
    //what arrowkey was pressed and move the player object
    switch (userInput) {
        case 'left':
            if (player.x >= 50) {
                player.x -= 100;
            }
            break;
        case 'right':
            if (player.x <= 300) {
                player.x += 100;
            }
            break;
        case 'up':
            if (player.y > 60) {
                player.y -= 80;
            } else {
                player.score += 100;
                player.y = 380;
                player.x = 200;
            }

            break;
        case 'down':
            if (this.y <= 300) {
                this.y += 80;
            }

            break;

    }
};

//takes the player object and pad its coordinates with extra space i.e  adding a range to each game object
function playerPositionRange(xAxis, yAxis) {
    var coordRange = {
        xBegin: xAxis,
        xEnd: xAxis + 99,
        yBegin: yAxis - 20,
        yEnd: yAxis + 50
    }
    return coordRange;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

//collision algorthim loops through each enemy to see if any player object coordinates equals the enemy coordinates
//if it does, a collision has occured
function checkCollision(x, y) {
    var coords = playerPositionRange(x, y);
    //Add and substract 37 to include padding  
    let pad = 37;
    allEnemies.forEach(ene => {
        if ((ene.x + pad >= coords.xBegin - pad && ene.x + pad <= coords.xEnd - pad) && (ene.y >= coords.yBegin && ene.y <= coords.yEnd)) {
            //collision has occured, reset position and reduce lives
            player.y = 380;
            player.lives -= 1;
            //if lives is zero, game over
            if (player.lives === 0) {
                alert(`Game Over!!! Your Score was ${player.score}`);
                player.score = 0;
                location.reload()

            }
        }
    });

    return coords.end;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//disable scroll controlled by arrowkeys
window.addEventListener('keydown', function (event) {
    if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
});
