const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

document.body.style.textAlign = "center";

// Player Object
const player = {
    x: 100,
    y: 400,
    width: 30,
    height: 30,
    color: "blue",
    speed: 5,
    velocityY: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
    score: 0,
};

// Platforms
const platforms = [
    { x: 50, y: 450, width: 200, height: 10 },
    { x: 300, y: 400, width: 200, height: 10 },
    { x: 550, y: 350, width: 200, height: 10 },
    { x: 200, y: 250, width: 150, height: 10 },
    { x: 450, y: 200, width: 150, height: 10 },
];

// Moving Platforms
const movingPlatforms = [
    { x: 100, y: 300, width: 200, height: 10, speed: 2, direction: 1 },
];

// Enemies
const enemies = [
    { x: 400, y: 370, width: 30, height: 30, speed: 2, direction: 1 },
];

// Key Listeners
const keys = {};
document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));

function update() {
    // Left and right movement
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    
    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    
    // Platform Collision
    player.grounded = false;
    for (let platform of platforms) {
        if (
            player.y + player.height >= platform.y &&
            player.y + player.height - player.velocityY < platform.y &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
            player.score += 10; // Increase score on landing
        }
    }
    
    // Jumping
    if (keys["Space"] && player.grounded) {
        player.velocityY = player.jumpPower;
    }
    
    // Prevent falling off the bottom
    if (player.y > canvas.height) {
        player.y = 400;
        player.velocityY = 0;
        player.score = 0; // Reset score on fall
    }

    // Move Moving Platforms
    for (let platform of movingPlatforms) {
        platform.x += platform.speed * platform.direction;
        if (platform.x <= 50 || platform.x + platform.width >= canvas.width - 50) {
            platform.direction *= -1;
        }
    }

    // Move Enemies
    for (let enemy of enemies) {
        enemy.x += enemy.speed * enemy.direction;
        if (enemy.x <= 50 || enemy.x + enemy.width >= canvas.width - 50) {
            enemy.direction *= -1;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw platforms
    ctx.fillStyle = "black";
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw moving platforms
    ctx.fillStyle = "purple";
    for (let platform of movingPlatforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw enemies
    ctx.fillStyle = "red";
    for (let enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + player.score, 20, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
