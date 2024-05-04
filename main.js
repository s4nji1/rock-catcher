const game = document.getElementById('game');
const player = document.getElementById('player');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
let score = 0;
let rockInterval;
let gameRunning = false;

function movePlayer(e) {
    if (gameRunning) {
        const gameRect = game.getBoundingClientRect();
        const playerWidth = player.offsetWidth;
        const mouseX = e.clientX - gameRect.left;
        const minX = playerWidth / 2;
        const maxX = game.offsetWidth - playerWidth / 2;
        const newX = Math.min(Math.max(mouseX, minX), maxX);
        player.style.left = newX - playerWidth / 2 + 'px';
    }
}

game.addEventListener('mousemove', movePlayer);

function createRock() {
    if (gameRunning) {
        const rock = document.createElement('div');
        rock.classList.add('rock');
        rock.style.left = Math.random() * (game.offsetWidth - 50) + 'px';
        game.appendChild(rock);

        const fallInterval = setInterval(() => {
            const rockBottom = rock.getBoundingClientRect().bottom;
            const gameBottom = game.getBoundingClientRect().bottom;
            if (rockBottom >= gameBottom) {
                clearInterval(fallInterval);
                rock.remove();
                if (!isCaught(rock)) {
                    gameOver();
                }
            } else {
                rock.style.top = (rock.offsetTop + 1) + 'px';
                if (isCaught(rock)) {
                    clearInterval(fallInterval);
                    rock.remove();
                    score++;
                    document.getElementById('score').innerText = "Score : " + score;
                    if (score === 30) {
                        clearInterval(rockInterval);
                        gameRunning = false;
                        const rocks = document.querySelectorAll('.rock');
                        rocks.forEach(rock => rock.remove());
                        document.getElementById('score').innerText = 'You Won! Score :'+ score;
                    }
                }
            }
        }, 10);
    }
}

function isCaught(rock) {
    const rockRect = rock.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    return (
        rockRect.bottom >= playerRect.top &&
        rockRect.top <= playerRect.bottom &&
        rockRect.left >= playerRect.left &&
        rockRect.right <= playerRect.right
    );
}

function gameOver() {
    clearInterval(rockInterval);
    document.getElementById('score').innerText  = 'Game Over! Your Score : ' + score;
    score = 0;
    gameRunning = false;
    const rocks = document.querySelectorAll('.rock');
    rocks.forEach(rock => rock.remove());
}

startBtn.addEventListener('click', () => {
    if (!gameRunning) {
        startGame();
    }
});

stopBtn.addEventListener('click', () => {
    clearInterval(rockInterval);
    gameRunning = false;
    const rocks = document.querySelectorAll('.rock');
    rocks.forEach(rock => rock.remove());
    score = 0;
    document.getElementById('score').innerText  = 'Score : ' + score;
});

function startGame() {
    score = 0;
    document.getElementById('score').innerText  = 'Score : ' + score;
    gameRunning = true;
    rockInterval = setInterval(createRock, 2000);
}
