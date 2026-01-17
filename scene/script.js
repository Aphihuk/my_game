const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ດຶງອົງປະກອບ HTML ຂອງໜ້າຈໍ Game Over ມາໄວ້
const gameOverScreen = document.getElementById("gameOverScreen");
const btnRetry = document.getElementById("btnRetry");
const btnMenu = document.getElementById("btnMenu");

// ໃຫ້ Canvas ຮັບຄຳສັ່ງຈາກຄີບອດທັນທີ
canvas.focus();

// --- ຕັ້ງຄ່າສຽງ (Audio Setup) ---
const moveSound = new Audio("../assets/sound/Race_Car.mp3");
const shootSound = new Audio("../assets/sound/Laser Gun Sound Effect.mp3");
const hitSound = new Audio("../assets/sound/roblox-death-sound_1.mp3");
const gameOverSound = new Audio("../assets/sound/bruh-sound-effect_WstdzdM.mp3");

// --- Movement Constants ---
const ACCEL = 0.5;
const FRICTION = 0.9;
const MAX_SPEED = 10;

// --- ຕົວປ່ຽນຂອງເກມ (Game Variables) ---
// ຂໍ້ມູນຂອງຜູ້ຫຼິ້ນ (ລົດ)
let player = { x: 100, y: 100, vx: 0, vy: 0, size: 60, emoji: "🚗", hp: 5 };

// ຂໍ້ມູນຂອງສັດຕູ (ເກັບເປັນ Array ເພາະມີຫຼາຍໂຕ)
let enemies = []; 

// ເກັບລູກກະສຸນທັງໝົດ
let bullets = [];
// ເກັບປຸ່ມທີ່ກົດ
let keys = {};
// ເກັບສະຖານະຫົວໃຈ (ຊີວິດ)
let playerHearts = []; 
// ສະຖານະວ່າເກມຈົບຫຼືຍັງ
let isGameOver = false;

// ຕົວປ່ຽນສຳລັບເກັບ ID ຂອງເວລາ (Timer) ເພື່ອເອົາໄວ້ສັ່ງຢຸດພາຍຫຼັງ
let enemySpawnerInterval;

// ຕົວປ່ຽນສຳລັບ Dash
let isDashing = false;
let dashDuration = 0;
let dashDx = 0;
let dashDy = 0;
let dashCooldown = 0;
let maxDashCooldown = 300; // 5 seconds at 60fps



// ຕົວປ່ຽນສຳລັບການເປັນອະນາເມັດ 5 ວິນາທີເລີ່ມຕົ້ນ
let startTime;
let invincibilityDuration = 5000; // 5 ວິນາທີໃນ milliseconds

// --- ຟັງຊັນຕັ້ງຄ່າຫົວໃຈເລີ່ມຕົ້ນ ---
function initHearts() {
    playerHearts = [];
    for (let i = 0; i < player.hp; i++) {
        playerHearts.push(true); // true = ຫົວໃຈສີແດງ (ຍັງບໍ່ຖືກຍິງ)
    }
}

// --- ຟັງຊັນສ້າງສັດຕູ (Spawn Enemy) ---
function spawnEnemy() {
    // ສຸ່ມຕຳແໜ່ງເກີດ (Random X, Y)
    let randomX = Math.random() * (canvas.width - 60);
    let randomY = Math.random() * (canvas.height - 60);

    // ສ້າງ Object ສັດຕູໂຕໃໝ່
    let newEnemy = { 
        x: randomX, 
        y: randomY, 
        size: 60, 
        emoji: "👻", 
        speed: 1.5 
    };

    // ເພີ່ມສັດຕູເຂົ້າໄປໃນກອງທັບ (Array)
    enemies.push(newEnemy);
}

// --- ຟັງຊັນເລີ່ມຕົ້ນເກມ (Init Game) ---
function initGame() {
    startTime = Date.now(); // ເລີ່ມນັບເວລາສຳລັບການເປັນອະນາເມັດ
    initHearts(); // ຣີເຊັດຫົວໃຈ
    enemies = []; // ລົບສັດຕູເກົ່າອອກໃຫ້ໝົດ
    spawnEnemy(); // ສ້າງສັດຕູໂຕທຳອິດທັນທີ

    // ຕັ້ງໂມງຈັບເວລາໃຫ້ສ້າງສັດຕູເພີ່ມທຸກໆ 20 ວິນາທີ (20000 ms)
    // ຕ້ອງລ້າງເວລາເກົ່າກ່ອນສະເໝີ ເພື່ອບໍ່ໃຫ້ມັນທັບຊ້ອນກັນ
    if (enemySpawnerInterval) clearInterval(enemySpawnerInterval);

    enemySpawnerInterval = setInterval(() => {
        if (!isGameOver) {
            spawnEnemy(); // ສ້າງສັດຕູເພີ່ມ
        }
    }, 20000);
}

// ເອີ້ນໃຊ້ຟັງຊັນເລີ່ມເກມ
initGame();

// --- ຮັບຄ່າການກົດປຸ່ມ (Event Listeners) ---
canvas.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
canvas.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// ປຸ່ມກົດຕອນ Game Over
btnRetry.addEventListener('click', () => {
    location.reload(); // ໂຫຼດໜ້າເວັບໃໝ່ (ຫຼິ້ນໃໝ່)
});

btnMenu.addEventListener('click', () => {
    window.location.href = '../frontend/index.html'; // ກັບໄປໜ້າເມນູ
});

// --- ຟັງຊັນຍິງລູກກະສຸນ ---
function shootBullet(shooter) {
    if(isGameOver) return; // ຖ້າເກມຈົບແລ້ວ ຫ້າມຍິງ

    // ຄຳນວນທິດທາງຈາກ ສັດຕູ -> ໄປຫາ -> ຜູ້ຫຼິ້ນ
    let dx = (player.x - shooter.x) / 100; 
    let dy = (player.y - shooter.y) / 100;
    
    bullets.push({ 
        x: shooter.x, 
        y: shooter.y, 
        size: 30, 
        emoji: "❤️", 
        dx: dx, 
        dy: dy 
    });

    shootSound.currentTime = 0;
    shootSound.play().catch(()=>{}); // ຫຼິ້ນສຽງຍິງ
}

// --- ຟັງຊັນກວດສອບການຕຳກັນ (Collision) ---
function isCollide(a, b) {
    return Math.abs(a.x - b.x) < (a.size/2 + b.size/2) && 
           Math.abs(a.y - b.y) < (a.size/2 + b.size/2);
}

// --- ຟັງຊັນຈົບເກມ (Game Over) ---
function triggerGameOver() {
    isGameOver = true;
    // ສັ່ງຢຸດການສ້າງສັດຕູເພີ່ມ (ຢຸດ Timer)

	gameOverSound.play().catch(()=>{});
    clearInterval(enemySpawnerInterval);
    // ສະແດງໜ້າຈໍ Game Over (ເອົາ class 'hidden' ອອກ)
    gameOverScreen.classList.remove('hidden');
}

// --- ຟັງຊັນອັບເດດເກມ (Update Loop) ---
// ຟັງຊັນນີ້ຈະເຮັດວຽກຊ້ຳໆ 60 ເທື່ອຕໍ່ວິນາທີ
function update() {
    if (isGameOver) return; // ຖ້າເກມຈົບ ໃຫ້ຢຸດເຮັດວຽກທັນທີ

    // 1. ຄວບຄຸມການຍ່າງຂອງຜູ້ຫຼິ້ນ
    // Apply acceleration
    if (keys['w']) player.vy -= ACCEL;
    if (keys['s']) player.vy += ACCEL;
    if (keys['a']) player.vx -= ACCEL;
    if (keys['d']) player.vx += ACCEL;

    // Apply friction
    player.vx *= FRICTION;
    player.vy *= FRICTION;

    // Clamp speed
    let speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
    if (speed > MAX_SPEED) {
        player.vx = (player.vx / speed) * MAX_SPEED;
        player.vy = (player.vy / speed) * MAX_SPEED;
    }

    // Update position
    player.x += player.vx;
    player.y += player.vy;

    // Set emoji based on dominant direction
    if (Math.abs(player.vy) > Math.abs(player.vx)) {
        if (player.vy < -1) player.emoji = "🥺";
        else if (player.vy > 1) player.emoji = "😁";
        else player.emoji = "🚗";
    } else if (Math.abs(player.vx) > 1) {
        if (player.vx < -1) player.emoji = "😎";
        else if (player.vx > 1) player.emoji = "😒";
        else player.emoji = "🚗";
    } else {
        player.emoji = "🚗"; // default
    }

    // Handle dash
    if (keys['e'] && dashCooldown === 0 && !isDashing) {
        // Calculate direction based on currently held keys
        dashDx = 0;
        dashDy = 0;
        if (keys['w']) dashDy -= 1;
        if (keys['s']) dashDy += 1;
        if (keys['a']) dashDx -= 1;
        if (keys['d']) dashDx += 1;
        // Normalize if diagonal
        let len = Math.sqrt(dashDx*dashDx + dashDy*dashDy);
        if (len > 0) {
            dashDx /= len;
            dashDy /= len;
        } else {
            // No direction, default to up
            dashDx = 0;
            dashDy = -1;
        }
        isDashing = true;
        dashDuration = 20; // 20 frames for smooth animation, total 100 pixels
        dashCooldown = maxDashCooldown;
        moveSound.play().catch(()=>{}); // Play sound
    }

    if (isDashing) {
        player.emoji = "🚀";
        player.x += dashDx * 20; // 20 pixels per frame
        player.y += dashDy * 20;
        dashDuration--;
        if (dashDuration <= 0) isDashing = false;
    }

    // Decrement dash cooldown
    if (dashCooldown > 0) dashCooldown--;

    // Clamp player position to canvas boundaries
    player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, player.x));
    player.y = Math.max(player.size / 2, Math.min(canvas.height - player.size / 2, player.y));

    // 2. ຄວບຄຸມສັດຕູທຸກໂຕ (Enemies Logic)
    enemies.forEach(enemy => {
        // [ແກ້ໄຂແລ້ວ] ຄຳນວນໄລຍະຫ່າງລະຫວ່າງ ຜີ ກັບ ຄົນ
        let dirX = player.x - enemy.x;
        let dirY = player.y - enemy.y;
        let dist = Math.sqrt(dirX*dirX + dirY*dirY);
        
        // ສັ່ງໃຫ້ຜີຍ່າງເຂົ້າຫາຜູ້ຫຼິ້ນ
        if(dist > 1){
            enemy.x += (dirX/dist) * enemy.speed;
            enemy.y += (dirY/dist) * enemy.speed;
        }

        // ສຸ່ມໃຫ້ຜີຍິງລູກກະສຸນ (ໂອກາດ 1%)
        if (Math.random() < 0.01) {
            shootBullet(enemy);
        }
    });

    // 3. ອັບເດດລູກກະສຸນ
    for (let i = bullets.length-1; i>=0; i--) {
        let b = bullets[i];
        b.x += b.dx*2; // ຂະຍັບລູກກະສຸນ
        b.y += b.dy*2;

        // ກວດສອບວ່າກະສຸນຕຳຜູ້ຫຼິ້ນບໍ່? ແລະ ບໍ່ໄດ້ເປັນອະນາເມັດ
        if (isCollide(player, b) && Date.now() - startTime >= invincibilityDuration) {
            let heartDamaged = false;
            // ຫາຫົວໃຈທີ່ຍັງແດງຢູ່ ແລ້ວປ່ຽນເປັນສີຂາວ
            for (let h = 0; h < playerHearts.length; h++) {
                if (playerHearts[h] === true) {
                    playerHearts[h] = false; 
                    heartDamaged = true;

					hitSound.currentTime = 0;//ຮີເຊັບສຽງເພືອໄຫ້ຫລີ້ນໄດ້ຕໍ່ກັນ
					hitSound.play().catch(()=>{});
                    bullets.splice(i, 1); // ລົບກະສຸນຖິ້ມ
                    break;
                }
            }
            
            // ຖ້າຫົວໃຈໝົດທຸກດວງ -> ຈົບເກມ
            if (!heartDamaged || playerHearts.every(h => h === false)) {
                triggerGameOver(); 
            }
        }

        // ລົບກະສຸນທີ່ອອກນອກຈໍ
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(i,1);
        }
        
    }

    draw(); // ວາດຮູບໃໝ່
    requestAnimationFrame(update); // ວົນລູບຕໍ່ໄປ
}

// --- ຟັງຊັນວາດຮູບ (Draw) ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // ລ້າງໜ້າຈໍເກົ່າ

    // ວາດຫົວໃຈ
    for (let i = 0; i < playerHearts.length; i++) {
        ctx.font = "40px Arial";
        ctx.fillText(playerHearts[i] ? "❤️" : "🤍", 20 + i * 50, 50);
    }

    // ວາດຜູ້ຫຼິ້ນ
    ctx.font = player.size+"px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player.emoji, player.x, player.y);

    // ວາດສັດຕູທຸກໂຕໃນ Array
    enemies.forEach(enemy => {
        ctx.font = enemy.size+"px Arial";
        ctx.fillText(enemy.emoji, enemy.x, enemy.y);
    });

    // ວາດລູກກະສຸນ
    bullets.forEach(b => {
        ctx.font = b.size+"px Arial";
        ctx.fillText(b.emoji, b.x, b.y);
    });
}

// ເລີ່ມເກມ
update();
