var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//booleans
var isPaused = false;
var canJump = false;
var won = false;

//constants
const GRAVITY = 0.05;
const JUMP_VELOCITY = 4;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 20;
const FLOOR_HEIGHT = 100;

//variables
let nIntervId;
var getMaxY;
var collision = false;
var coinsCollect = 0;
var maxCoins = 27;

//utilty functions
//get mouse position when moving
//mouse positions
// var mousePos = {
//     x: 0,
//     y: 0
// };
// //get mouse position of canvas and log to console
// canvas.addEventListener('mousemove', function(evt) {
//     var rect = canvas.getBoundingClientRect();
//     mousePos = {
//         x: evt.clientX - rect.left,
//         y: evt.clientY - rect.top
//     };
//     console.log(mousePos);
// }, false);






function startGame(){
    //hide the menu
    document.getElementById("menu").style.display = "none";
    isPaused = false;
    //play a song
    document.getElementById("song").play();
    //start the game loop
    gameLoop();
}

window.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
      // show the menu
        document.getElementById("menu").style.display = "block";
        document.getElementById("song").pause();
        isPaused = true;
    }
  });

class Player{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.gravity = 0;
        this.speedY = 0;
    }

    draw(){
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, 50, 50);
    }
    move(){
        this.gravity += GRAVITY;
        this.y += this.speedY + this.gravity;
    }

    changeGravity(){
        this.gravity = 0;
    }
}


//cases when user uses spacebar
window.addEventListener('keydown', function(event) {
    //when jumping add delay to next press
    if (event.key === "w") {
        if(canJump == true){
            for(let i = 0; i < 7; i++){
                //make player jump with animation
                player.speedY = -JUMP_VELOCITY;
            }
        //when the player hits his max height dependant of currPos reset speed
        getMaxY = player.y - 150; 
        canJump = false;
        }
    }
    //s key
    if (event.key === "s") {
        if(collision == true){
        player.y += 60;
        }
    }

    if (event.key === "a") {
        player.x -= PLAYER_SPEED;
    }
    if (event.key === "d") {
        player.x += PLAYER_SPEED;
    }
    });


//collision detection for player and floor
function collisionDetection(Floor, f){
    if(player.y + PLAYER_HEIGHT >= f.y){
        player.y = floor.y - PLAYER_HEIGHT;
        player.changeGravity();
        canJump = true;
        collision = true;
    }
    collision = false;
}

function platformCollision(Floor, f){
    if(player.y + PLAYER_HEIGHT >= f.y && player.y <= f.y +3){
        if(player.x + PLAYER_WIDTH >= f.x && player.x <= f.x + f.width){
            player.y = f.y - PLAYER_HEIGHT;
            player.changeGravity();
            canJump = true;
            collision = true;
        }
    }
    
}

//collision detection agasint walls
function wallCollision(){
    if(player.x + PLAYER_WIDTH >= canvas.width){
        player.x = canvas.width - PLAYER_WIDTH;
    }
    if(player.x <= 0){
        player.x = 0;
    }
}


//when player hits his peak
function maxJump(){
    if(player.y < getMaxY){
        player.speedY = 0;
    }
}

//create some coins player can pick up
class Coin{
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fill();

        if(player.x + PLAYER_WIDTH >= this.x && player.x <= this.x + this.width){
            if(player.y + PLAYER_HEIGHT >= this.y && player.y <= this.y + this.height){
                this.destroy();
                coinsCollect += 1;
            }
        }
    }
    destroy(){
        this.x = 100;
        this.y = 100;
        this.width = 0;
        this.height = 0;
    }
}

//create floors with this
class Floor{
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#2dca18";
    }
    draw(){
        ctx.fillStyle = this.color;
        //create circle for coin
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
//initiating objects

//player
player = new Player(100, 500);
//coins
var coins = [];
for (let i = 0; i < 10; i++) {
    coins.push(new Coin( 420 + (i*60), 560, 20, 20, "yellow"));
}
for (let i = 0; i < 10; i++) {
    coins.push(new Coin( 30 + (i*60), 404, 20, 20, "yellow"));
}
for (let i = 0; i < 10; i++) {
    coins.push(new Coin( canvas.width - (i*60), 240, 20, 20, "yellow"));
}

//display coins collected in top right of screen
function displayCoins(){
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Coins: " + coinsCollect, 10, 30);
}


//basefloor
floor = new Floor(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);

//extraplatforms
floor2 = new Floor(400, 600, 600, 30);
floor3 = new Floor(0, 444, 600, 30);
floor4 = new Floor(220, 280, 600, 30);

function gameLoop(){
    if(isPaused == false){
        
        //update
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //collision detection
        collisionDetection(player, floor);

        //collision with flatforms
        platformCollision(player, floor2);
        platformCollision(player, floor3);
        platformCollision(player, floor4);

        wallCollision();
        //draw the sun
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, 2 * Math.PI);
        ctx.fill();

        //draw some floors
        floor2.draw();
        floor3.draw();
        floor4.draw();

        //base floor
        floor.draw();

        //draw coins
        for (let i = 0; i < 30; i++) {
            coins[i].draw();
        }

        displayCoins();

        if(coinsCollect == maxCoins){
            //make a triangle point towards west that has brown post
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.moveTo(100, 550);
            ctx.lineTo(170, 550);
            ctx.lineTo(100, 500);
            ctx.fill();
            //make a post under flag
            ctx.fillStyle = "brown";
            ctx.fillRect(100, 550, 10, 150);
            

            if(player.x + PLAYER_WIDTH >= 100 && player.x <= 100 + 150){
                if(player.y + PLAYER_HEIGHT >= 550 && player.y <= 550 + 150){
                    //wait 3 seconds then reset program
                    won = true;
                    setTimeout(function(){
                        location.reload();
                    }
                    , 3000);
                }
            }

        }

        if(won == true) {
            ctx.fillStyle = "green";
            ctx.font = "77px Arial";
            //center text and say you win
            ctx.fillText("You Win!", canvas.width/2 - 200, canvas.height/2);
        }

        //draw the player
        player.draw();
        player.move();

        console.log(collision);
        //max height of jump
        maxJump();
    
        window.requestAnimationFrame(gameLoop);
    }
}