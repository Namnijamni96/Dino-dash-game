let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let score = 0;
let highScore = 0;
let gameSpeed = 5;
let fps = 60;
let isGameOver = false;
let darkMode = false;
let dino = { x: 50, y: 150, width: 20, height: 20, jumpStrength: 13, velocityY: 0, gravity: 1 };
let obstacles = [];
let frameCount = 0;

function restartGame() {
    score = 0;
    frameCount = 0;
    isGameOver = false;
    dino.y = 150;
    dino.velocityY = 0;
    obstacles = [];
    document.getElementById("creator").textContent = '';
    updateScore();
    gameLoop();
}

function updateScore() {
    document.getElementById("currentScore").textContent = score;
    document.getElementById("highScore").textContent = highScore;
}

function jump() {
    if (dino.y === 150) {
        dino.velocityY = -dino.jumpStrength;
    }
}

function generateObstacle() {
    if (frameCount % 100 === 0) {
        obstacles.push({ x: canvas.width, y: 150, width: 20, height: 20 });
    }
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;
    }
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    obstacles.forEach(obstacle => {
        if (obstacle.x + obstacle.width === dino.x) {
            score++;
            if (score > highScore) {
                highScore = score;
            }
            updateScore();
        }
    });
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            dino.x < obstacles[i].x + obstacles[i].width &&
            dino.x + dino.width > obstacles[i].x &&
            dino.y < obstacles[i].y + obstacles[i].height &&
            dino.y + dino.height > obstacles[i].y
        ) {
            return true;
        }
    }
    return false;
}

function checkForEasterEgg() {
    if (score === 100) {
        score += 50;
        alert("Congratulations! You found an Easter egg! You gained 50 extra points.");
    }
}

function checkForCheating() {
    if (score > 10000) {
        alert("Cheating detected! Your score is too high.");
        return true;
    }
    return false;
}

function gameLoop() {
    if (isGameOver) return;

    frameCount++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dino Physics
    dino.velocityY += dino.gravity;
    dino.y += dino.velocityY;
    if (dino.y > 150) {
        dino.y = 150;
        dino.velocityY = 0;
    }

    // Draw Dino
    ctx.fillStyle = darkMode ? "yellow" : "green";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Generate and move obstacles
    generateObstacle();
    moveObstacles();

    // Draw obstacles
    ctx.fillStyle = "red";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }

    // Check for collisions
    if (checkCollision()) {
        isGameOver = true;
        displayCreatorName();
        return;
    }

    // Check for Easter egg and cheating
    checkForEasterEgg();
    if (checkForCheating()) {
        restartGame();
    }

    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, 1000 / fps);
}

function setGameSpeed(difficulty) {
    switch (difficulty) {
        case 'easy':
            gameSpeed = 4;
            break;
        case 'normal':
            gameSpeed = 5;
            break;
        case 'hard':
            gameSpeed = 6;
            break;
        case 'extreme':
            gameSpeed = 7;
            break;
        default:
            gameSpeed = 5;
            break;
    }
    restartGame();
}

function setSensitivity(level) {
    switch (level) {
        case 'low':
            dino.jumpStrength = 10;
            break;
        case 'medium':
            dino.jumpStrength = 13;
            break;
        case 'high':
            dino.jumpStrength = 16;
            break;
        default:
            dino.jumpStrength = 13;
            break;
    }
    restartGame();
}

function setFPS(newFPS) {
    fps = parseInt(newFPS);
    restartGame();
}

function startGameLoading() {
    const loadingText = document.getElementById("loadingText");
    const loadingBar = document.getElementById("loadingBar");
    const loadingScreen = document.getElementById("loadingScreen");

    let percentage = 0;
    let interval = setInterval(() => {
        percentage += 1;  // Increase the percentage by 1 every iteration
        loadingBar.style.width = percentage + "%";
        loadingText.textContent = "Loading... " + percentage + "%";
        
        // If percentage reaches 100, stop the interval and start the game
        if (percentage >= 100) {
            clearInterval(interval);  // Stop the loading bar progression
            loadingScreen.style.display = "none";  // Hide the loading screen
            restartGame();  // Start the game
        }
    }, 20);  // This value sets the speed of the loading bar progression
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? '#333' : '#f4f4f4';
    document.body.style.color = darkMode ? '#fff' : '#333';
    document.getElementById("menuBar").style.backgroundColor = darkMode ? '#555' : '#333';
    document.getElementById("canvas").style.backgroundColor = darkMode ? '#222' : 'lightblue';
    showDarkModeNotification();
}

function displayCreatorName() {
    const creatorElement = document.getElementById("creator");
    let colorIndex = 0;
    const colors = ["red", "green", "blue", "yellow", "purple", "cyan", "sky-blue"];

    function changeColor() {
        creatorElement.style.color = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
        if (isGameOver) {
            setTimeout(changeColor, 500);
        }
    }

    creatorElement.textContent = 'Game Over! Created by Naman';
    changeColor();
}

function showDarkModeNotification() {
    const notification = document.getElementById("darkModeNotification");
    notification.style.opacity = 1;
    setTimeout(() => {
        notification.style.opacity = 0;
    }, 2000);
}

document.addEventListener("keydown", event => {
    if (event.code === "Space") {
        jump();
    }
});

canvas.addEventListener("click", () => {
    if (isGameOver) {
        restartGame();
    } else {
        jump();
    }
});

// Start the loading process
startGameLoading();