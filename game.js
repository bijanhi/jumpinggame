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
};

// Platforms
const platforms = [
    { x: 50, y: 450, width: 200, height: 10 },
    { x: 300, y: 400, width: 200, height: 10 },
    { x: 550, y: 350, width: 200, height: 10 },
    { x: 200, y: 250, width: 150, height: 10 },
    { x: 450, y: 200, width: 150, height: 10 },
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
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
