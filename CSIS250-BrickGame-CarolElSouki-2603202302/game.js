/********************************************************************
    Project: Break the Bricks.
    Course: CSIS250.
    Description: Break the Bricks is a game where the player must smash a wall of
     bricks by deflecting a bouncing ball with a paddle.
    Author: Carol El Souki.
*********************************************************************/

class Game{
    constructor(){
        /***** Activating the canvas object and declaring the context to start rendering *****/
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext('2d');

        /***** Declaring images *****/
        this.backgroundImg = new Image();
        this.backgroundImg.src = 'effects/images.jpg';

        this.levelImg = new Image();
        this.levelImg.src = 'effects/score.jpg';

        this.livesImg = new Image();
        this.livesImg.src = 'effects/lives.jpg'

        this.gameOverImg = new Image();
        this.gameOverImg.src = 'effects/gameOver.jpg';

        /***** Declaring an array to add the game's elements (ball, paddle, bricks) *****/
        this.sprites = []

    }

    /****** update method used to refresh the elements of the game *****/
    update(){
        /****** Declaring array to delete elements */
        var deleted = []
        for(var i = 0; i < this.sprites.length; i++){
            this.sprites[i].update(this.sprites, this.context);
            if(this.sprites[i] instanceof brickConst){
                var currentStatus = this.sprites[i].update(this.sprites[i]);
                if(currentStatus==true && this.sprites[i].hasPowerUp==true){
                    this.sprites[i-1].active = true;
                }
                if(currentStatus){
                    deleted.push(i);
                    if(deleted.length>0){
                        this.sprites.splice(deleted[0],1);
                    }
                }
            }  
        }
    }
    /****** draw method used to render the elements of the game (including background, text and canvas' border) ******/
    draw(){
        this.context.drawImage(this.backgroundImg, 0 , 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.levelImg, 260 , 5, 30, 30);
        this.context.drawImage(this.livesImg, 10 , 5, 30, 30);
        this.showGameStats(this.context, "Lives " + ball.lives, 50, 30);
        this.showGameStats(this.context, "Score " + ball.score, 290, 30);
        if(ball.start == false){
            this.showGameStats(this.context, "Click anything to start ", 130, 70);
        }
        this.canvas.style.border = '1px solid #0ff';
        for(var i = 0; i < this.sprites.length; i++){
            this.sprites[i].draw(this.context);
        }
    }
    /***** addSprite method used to add the elements to the game *****/
    addSprite(element){
        this.sprites.push(element);
    }
    /***** showGameStats method use to display the text in the canvas *****/
    showGameStats(context, text, textX, textY){
        context.fillStyle = 'white';
        context.font = "25px Germania One";
        context.fillText(text,textX,textY);
    }
}

/****************************************************************************   
    Creating class sprite to use it as a parent class
*****************************************************************************/

class Sprites{
    constructor() {
    }

    update(){
    }

    draw(){
    }
}

/****************************************************************************   
    Creating class Base as a child of the Sprite class
*****************************************************************************/
class Base extends Sprites{
    /***** constructor creates a Base object with the properties width, height, initial positions, velocity  *****/
    constructor(game){
        super();
        this.baseWidth = 70;
        this.baseHeight = 15;
        this.x = canvas.width/2 - this.baseWidth/2;
        this.y = canvas.height - this.baseHeight - 20;
        this.dx = 5;
        this.arrowLeft = false;
        this.arrowRight = false;
        this.shoot = false;
        this.shooting = false;
        this.seconds=0;
    }

    draw(context){
        context.beginPath();
        context.rect(this.x,this.y,this.baseWidth,this.baseHeight);
        context.strokeStyle = "#ff69b4";
        context.fillStyle = "#c71585";
        context.fill();
        context.stroke();
        context.closePath();
    }

    update(sprites){
        this.moveBase(sprites);

        if(this.shoot==true){
            if(pressedKeys[0]){
                this.shootBullets(game);
            }
        }
    }
    /***** moveBase method use to move the paddle (right or left)*****/
    moveBase(sprites){
        for(var count = 0 ; count < sprites.length ; count++){
            if(sprites[count] instanceof Base){
                break;
            }
        }

        if(sprites[count].arrowRight && sprites[count].x 
            + sprites[count].baseWidth < game.canvas.width )
        {
            sprites[count].x += sprites[count].dx;
        }
        
        else if(sprites[count].arrowLeft && sprites[count].x >= 0)
        {
            sprites[count].x-=sprites[count].dx
        }
    }
    shootBullets(game){
        if(this.seconds<8){
            this.seconds++;
            return;
        }
        var bullet = new miniBullets(this.x, this.y,0);
        var bullet2 = new miniBullets(this.x + this.baseWidth,this.y,);
        game.addSprite(bullet);
        game.addSprite(bullet2);
        this.seconds = 0 ;
    }

}
/****************************************************************************   
    Creating class Ball as a child of the Sprite class
*****************************************************************************/
class Ball extends Sprites{

    constructor(){
        super();
        this.speed = 3;
        this.radius = 7;
        this.x = canvas.width/2 - 5;
        this.y = canvas.height - 43 - this.radius;
        this.directionX = 3 * (Math.random()*2 - 1);
        this.directionY = -1 * this.speed;
        this.score = 0;
        this.lives = 3;
        this.start = false;
        this.won = false;
        this.seconds = 0;

        /****** Declaring and adjusting sound effects *****/
        this.livesSound = new Audio('effects/lives--.mp3');
        this.livesSound.volume = 0.3;
        this.hitWall= new Audio("effects/ballWall.mp3");
        this.hitWall.volume = 0.2;
        this.win = new Audio();
        this.win.src = 'effects/win.mp3';
    }

    draw(context){
        context.beginPath();
        context.arc(this.x + this.radius,this.y + this.radius, this.radius, 0, Math.PI*2);
        context.strokeStyle = "#A9A9A9";
        context.fillStyle = "#696969";
        context.fill();
        context.stroke();
        context.closePath();
    }

    update(sprites){
        /****** checking if the user clicked to start the game ******/

        for(var i = 0 ; i <sprites.length ; i++){
            if(sprites[i] instanceof Ball){
                break;
            }
        }

        if(this.start==true){
            sprites[i].x += sprites[i].directionX;
            sprites[i].y += sprites[i].directionY;
        }
        this.checkCollisionWithBorders(sprites, i);
        this.checkCollisionWithPaddle(sprites, i);
        this.checkCollisionWithBricks(sprites, i);
        this.checkIfWon(sprites);

    }
    /****** checkCollisionWithBorders created to check for collisions with the borders ******/
    checkCollisionWithBorders(sprites, i){
        if(sprites[i].x>canvas.width - 2*this.radius || sprites[i].x<0){
            sprites[i].directionX = -1*sprites[i].directionX;
            this.hitWall.play();
        }

        if(sprites[i].y + this.radius*2 <= 0 + this.radius*2){
            sprites[i].directionY = -1*sprites[i].directionY;
            this.hitWall.play();
        }

        if(sprites[i].y>canvas.height - this.radius*2){
            sprites[i].x = canvas.width/2 -5;;
            sprites[i].y = canvas.height - 43 - this.radius;
            sprites[i].directionX = 3 * (Math.random()*2 - 1);
            sprites[i].directionY = -1*sprites[i].directionY;
            this.lives--;
            for(var i = 0 ; i< sprites.length ; i ++ ){
                if(sprites[i] instanceof Base){
                    sprites[i].shoot = false;
                }
            }
            if(this.lives==0){
                if (confirm("You have lost! Press OK to play again")) {
                    location.reload();
                }
                else{
                    close();
                }
            }
            else{
                this.livesSound.play();
            }
        }
    }
    /***** checkCollisionWithPaddle created to check for collisions with the paddle *****/
    checkCollisionWithPaddle(sprites, i ){
        for(var y = 0 ; sprites.length ; y++){
            if(sprites[y] instanceof Base){
                break;
            }
        }

        if(sprites[i].x < sprites[y].x + sprites[y].baseWidth 
            && sprites[i].x > sprites[y].x 
            && sprites[y].y < sprites[y].y + sprites[y].baseHeight 
            && sprites[i].y > sprites[y].y - sprites[y].baseHeight){
                sprites[i].directionX = -1 * 3 * (Math.random()*2 - 1);
                sprites[i].directionY *=-1;
                this.hitWall.play();
            }
    }
    /***** checkCollisionWithBricks created to check for collisions with the bricks and to evaluate if the user wins *****/
    checkCollisionWithBricks(sprites,z){
        for(var count = 0 ; count < sprites.length ; count++){
            if(sprites[count] instanceof brickConst){
                if(sprites[z].x + sprites[z].radius > sprites[count].initialX
                    && sprites[z].x - sprites[z].radius < sprites[count].initialX + sprites[count].width
                    && sprites[z].y + sprites[z].radius > sprites[count].initialY 
                    && sprites[z].y - sprites[z].radius < sprites[count].initialY + sprites[count].height){
                        for(var i =0; i<sprites.length;i++){
                            if(sprites[i] instanceof Ball)
                            sprites[i].directionY = -1*sprites[i].directionY;
                            sprites[count].broken = true;
                            sprites[i].score +=10;
                        }
                    }
            }
        }
    }
    /*** Creating a check if won method, if the length of the sprites array is 2 (ball, paddle) if yes the user won */
    checkIfWon(sprites){
        for(var i = 0 ; i < sprites.length ; i++){
            if(sprites[i] instanceof brickConst){
                return;
            }
        }
        this.seconds++;
        this.win.play();
            if(this.seconds==80){
                if(confirm("Do you want to play again?"))
                    location.reload();
                else{
                    close();
                }
            }
        }
}


/****************************************************************************   
    Creating brickConst as a child of the Sprite class
*****************************************************************************/
class brickConst extends Sprites{
    constructor(){
        super();
        this.initialY = 50;
        this.initialX = 50;
        this.width = 55;
        this.height = 20;
        this.level1 = 70;
        this.broken = false;
        this.hasPowerUp = false;
    }
    draw(context){
        // /****** I don't need to check if the bricks are broken because if hitten they will be directly deleted ******/
            context.beginPath();
            context.rect(this.initialX,this.initialY,this.width,this.height);
            context.fillStyle = 'gray';
            context.fill();
            context.strokeStyle = 'white';
            context.stroke();
            context.closePath();

    }
    update(sprites){
        return sprites.broken;
    }
}
/****************************************************************************   
    Creating class Bricks as a child of the brickConst class, so I can 
    use its constructor
*****************************************************************************/
class Bricks extends brickConst{
    constructor(){        
        super();
        this.drawAllBricks();
        this.alreadyExecuted = false;
    }
    draw(context){
        super.draw(context);
    }
    /****** drawAllBricks function used to create the bricks by calling the constructor 
    of the parent class *******/
    drawAllBricks(){
        var incrementX = 50;
        var incrementY = 50;
        for(var bNumber = 0 ; bNumber < this.level1 ; bNumber++){
            var brick = new brickConst();
            brick.initialX = incrementX + brick.width + 5;
            brick.initialY = incrementY;
            incrementX = brick.initialX;
            if(bNumber%5==0){
                brick.initialY = incrementY + brick.height + 10;
                brick.initialX = this.initialX;
                incrementX = brick.initialX;
                incrementY = brick.initialY;
            }
            if(bNumber==8 || bNumber==15 || bNumber==45|| bNumber==66){
                var power = new Power(brick.initialX + brick.width/2, brick.initialY);
                brick.hasPowerUp = true;
                game.addSprite(power);
            }
            game.addSprite(brick);
        }
    }
    update(sprites){
            return sprites.broken;

    }
}

/****************************************************************************   
    Creating class PowerUp as a child of Sprites 
*****************************************************************************/

class Power extends Sprites{
    constructor(positionX,positionY){
        super();
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = 2;
        this.height = 10;
        this.width = 10;
        this.active = false

    }

    draw(context){
        context.beginPath();
        context.rect(this.positionX,this.positionY, this.width, this.height);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
    }
    update(sprites){
        if(this.active ==true){
            this.positionY+=this.speed;
            return this.checkforCollisions(sprites)
        }
    }
    checkforCollisions(sprites){
        // Check collision with paddle
        for (let i = 0; i < sprites.length; i++) {
            if (sprites[i] instanceof Base &&
                this.positionX < sprites[i].x + sprites[i].baseWidth 
            && this.positionX  > sprites[i].x 
            && this.positionY < sprites[i].y + sprites[i].baseHeight 
            && this.positionY > sprites[i].y - sprites[i].baseHeight)
            {
                sprites[i].shoot = true;
            }
            //this will delete the powerups
            if(this.positionY > sprites[i].y + sprites[i].height){
                return true;
            }

        }
    }
}

class miniBullets extends Sprites{
    constructor(positionX,positionY, width){
        super();
        this.radius = 5;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = 2;
        this.width = width;
    }

    draw(context){
        context.beginPath();
        context.arc(this.positionX,this.positionY,this.radius, 0, 2*Math.PI);
        context.fillStyle = "red";
        context.fill();
        context.stroke();
        context.closePath();
    }

    update(sprites){
        this.positionY-=this.speed;
        this.checkCollisionWithBricks(sprites);
        return this.checkCollisionWithTopBorder();
    }
    checkCollisionWithBricks(sprites){
        for(var count = 0 ; count < sprites.length ; count++){
            if(sprites[count] instanceof brickConst){
                if(this.positionX + this.radius > sprites[count].initialX
                    && this.positionX - this.radius < sprites[count].initialX 
                    + sprites[count].width
                    && this.positionY + this.radius > sprites[count].initialY 
                    && this.positionY - this.radius < sprites[count].initialY 
                    + sprites[count].height){
                        sprites[count].broken = true;
                        for (let i = 0; i < sprites.length; i++) {
                            if (sprites[i] instanceof Ball) {
                                sprites[i].score += 10;
                            }
                        }
                    }
            }
        }
    }
    checkCollisionWithTopBorder(){
        if(this.positionY>=650){
            return true;
        }
    }
}

/********************************************************************
    Function used to know the browser the user is running the game on
*********************************************************************/
var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000/60);
            };
})();

var game = new Game();

var base = new Base(game);

var ball = new Ball();

var severalBricks = new Bricks();

var pressedKeys = [];

game.addSprite(base);
game.addSprite(ball);
game.addSprite(severalBricks);

/****** checking pressed keys ****/
document.addEventListener('keydown', function(event){
    if(event.keyCode == 37){
        base.arrowLeft = true;
    }
    else if(event.keyCode == 39) {
        base.arrowRight = true;
    }
});
document.addEventListener('keyup', function(event){
    if(event.keyCode == 37){
        base.arrowLeft = false;
    }
    else if(event.keyCode == 39) {
        base.arrowRight = false;
    }
});
/****** checking if the user started the game ****/
document.addEventListener("click", function(){
    ball.start = true;
});

document.addEventListener('keydown' , function(event) { 
    if(event.keyCode == 32){
        pressedKeys[0]=true;
    }
})
document.addEventListener('keyup' , function(event) { 
    if(event.keyCode == 32){
        pressedKeys[0]=false;
    }
})

function startTheGame(){
    game.update();
    game.draw();
    requestAnimFrame(startTheGame);
}

startTheGame();

console.log(game.sprites);
console.log(game.sprites.length);