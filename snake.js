const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

const box = 20;
const canvasSize = 20; // 20x20 grid

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction;
let food = generateFood();
let score = 0;

document.addEventListener('keydown', setDirection);
document.addEventListener('keydown', resetGameOnGameOver);

function generateFood() {
    return {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
}

function setDirection(event) {
    const key = event.key.toUpperCase(); // Para lidar com teclas maiúsculas e minúsculas uniformemente

    if ((key === 'ARROWLEFT' || key === 'a') && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if ((key === 'ARROWUP' || key === 'w') && direction !== 'DOWN') {
        direction = 'UP';
    } else if ((key === 'ARROWRIGHT' || key === 'd') && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if ((key === 'ARROWDOWN' || key === 's') && direction !== 'UP') {
        direction = 'DOWN';
    }
}


function resetGameOnGameOver(event) {
    if (gameOverElement.style.display === 'block') {
        restartGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#228B22' : '#32CD32';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = '#006400';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#FF4500';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = 'Score: ' + score;
        food = generateFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    clearInterval(game);
    gameOverElement.style.display = 'block';
}

function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    food = generateFood();
    score = 0;
    scoreElement.innerHTML = 'Score: ' + score;
    gameOverElement.style.display = 'none';
    game = setInterval(draw, 100);
}

let game = setInterval(draw, 100);
