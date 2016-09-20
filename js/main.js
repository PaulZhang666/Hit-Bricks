var canvas = document.getElementById("HitBlocks");
var ctx = canvas.getContext("2d");

var paddleHeight = 10;
var paddleWidth = 80;
var paddlePoint = (canvas.width - paddleWidth)/2;

var ballRadius = 10;
var x_0 = canvas.width/2;
var y_0 = canvas.height - paddleHeight - ballRadius;
var dx_0 = (Math.random()-0.5)*5;
var dy_0 = -1;

var x_1 = canvas.width/2;
var y_1 = canvas.height - paddleHeight - 3*ballRadius;
var dx_1 = (Math.random()-0.5)*5;
var dy_1 = -1;

var rightPressed = false;
var leftPressed = false;

var startBool = false;
var score = 0;

var blockRowCount = 4;
var blockColumnCount = 5;
var blockWidth = 75;
var blockHeight = 20;
var blockPadding = 10;
var blockOffsetTop = 70;
var blockOffsetLeft = 92;
var blocks = [];
for(var i = 0; i<blockRowCount*blockColumnCount; i++){
    blocks[i] = 1;
}

function detectHit(x, y, num){
    for(var i = 0; i<blocks.length; i++){
        if(blocks[i] == 1){
            var blockX = blockOffsetLeft + i%blockColumnCount * (blockWidth + blockPadding);
            var blockY = blockOffsetTop + Math.floor(i/blockColumnCount) * (blockHeight + blockPadding);

            if(((x <= blockX + blockWidth + ballRadius)&&(y >= blockY)&&(y <= blockY + blockHeight)) &&
                ((x >= blockX - ballRadius)&&(y >= blockY)&&(y <= blockY + blockHeight))){
                //hit with the right or left side of blocks
                blocks[i] = 0;
                switch(num){
                    case 0:
                        dx_0 = -dx_0;
                        break;
                    case 1:
                        dx_1 = -dx_1;
                        break;
                }
                score++;
                if(score == blockRowCount*blockColumnCount){
                    alert("Good Game, Well Played!");
                    document.location.reload();
                }
                return;
            }
            if(((y <= blockY + blockHeight + ballRadius)&&(x >= blockX)&&(x <= blockX + blockWidth)) &&
                ((y >= blockY - ballRadius)&&(x >= blockX)&&(x <= blockX + blockWidth))){
                //hit with the up or down side of blocks
                blocks[i] = 0;
                switch(num){
                    case 0:
                        dy_0 = -dy_0;
                        break;
                    case 1:
                        dy_1 = -dy_1;
                }
                score++;
                if(score == blockRowCount*blockColumnCount){
                    alert("Good Game, Well Played!");
                    document.location.reload();
                }
                return;
            }
        }
    }
}

function detectCollide(){
    if(Math.abs(x_0-x_1) < ballRadius*2){
        x_0 = -x_0;
        x_1 = -x_1;
    }
    if(Math.abs(y_0-y_1) < ballRadius*2){
        y_0 = -y_0;
        y_1 = -y_1;
    }
}

function drawBall(x, y, num){
    if(x >= canvas.width - ballRadius||x <= ballRadius){
        //collide with right or left side of canvas
        switch (num){
            case 0:
                dx_0 = -dx_0;
                break;
            case 1:
                dx_1 = -dx_1;
                break;
        }
    }
    if((y == canvas.height - ballRadius - paddleHeight && paddlePoint <= x && x <= paddlePoint + paddleWidth)||
        (y <= ballRadius)){
        //collide with up or down side of canvas
        switch(num){
            case 0:
                dy_0 = -dy_0;
                break;
            case 1:
                dy_1 = -dy_1;
                break;
        }
    }else if(y == canvas.height - ballRadius - paddleHeight){
        alert("Oops!");
        document.location.reload();
    }
    //detect the border
    detectHit(x, y, num);
    //detectCollide();
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    if(rightPressed && paddlePoint < canvas.width-paddleWidth) {
        paddlePoint += 3;
    }
    else if(leftPressed && paddlePoint > 0) {
        paddlePoint -= 3;
    }

    ctx.beginPath();
    ctx.rect(paddlePoint, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "Green";
    ctx.fill();
    ctx.closePath();
}

function drawSingleBlock(x, y){
    ctx.beginPath();
    ctx.rect(x, y, blockWidth, blockHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBlocks(){
    for(var i = 0; i < blocks.length; i++){
        if(blocks[i] == 1){
            drawSingleBlock(blockOffsetLeft + i%blockColumnCount * (blockWidth + blockPadding), blockOffsetTop + Math.floor(i/blockColumnCount) * (blockHeight + blockPadding))
        }
    }
}

function drawScore(num){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    switch(num){
        case 0:
            ctx.fillText("Score: " + score, 8, 20);
            break;
        case 1:
            ctx.fillText("Score: " + score*5, 8, 20);
            break;
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(x_0, y_0, 0);
    drawBall(x_1, y_1, 1);
    drawPaddle();
    drawBlocks();
    drawScore(difficulty);
    x_0 += dx_0;
    y_0 += dy_0;
    x_1 += dx_1;
    y_1 += dy_1;
}

var difficulty = 0;

function showEZ(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("difficulty_select").style.visibility = "hidden";
    drawPaddle();
    drawBlocks();
    drawScore(0);
    drawBall(x_0, y_0, 0);
    difficulty = 0;
}

function showInsane(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("difficulty_select").style.visibility = "hidden";
    drawPaddle();
    drawBlocks();
    drawScore(1);
    drawBall(x_0, y_0, 0);
    drawBall(x_1, y_1, 1);
    difficulty = 1;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", startHandler, false);


function keyDownHandler(e){
    if(e.keyCode == 39){
        rightPressed = true;
    }else if(e.keyCode == 37){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode == 39){
        rightPressed = false;
    }else if(e.keyCode == 37){
        leftPressed = false;
    }
}

function startHandler(e){
    if(e.keyCode == 32 && startBool == false){
        setInterval(draw, 1);
        startBool = true;
        document.addEventListener("mousemove", mouseMoveHandler, false);
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddlePoint = relativeX - paddleWidth/2;
    }
}

