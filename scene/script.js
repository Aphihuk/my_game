const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("gameOverScreen");
const btnRetry = document.getElementById("btnRetry");
const btnMenu = document.getElementById("btnMenu");
canvas.focus(); // ຮັບຄຳສັ່ງ keyboard
const moveSound = new Audio("../assets/sound/Race_Car.mp3");
const shootSound = new Audio("../assets/sound/Laser Gun Sound Effect.mp3");
const hitSound = new Audio("../assets/sound/roblox-death-sound_1.mp3");
const gameOverSound = new Audio(
  "../assets/sound/bruh-sound-effect_WstdzdM.mp3"
);

let player = { x: 100, y: 100, size: 60, emoji: "🚗", hp: 5 }; // ຄ່າເລີ່ມຕົ້ນ
let enemies = []; // events
let bullets = []; // ເກັບລຼກກະສຸນ
let keys = {}; // ເກັບຄ່າ keyboard
let playerHearts = []; // ເກັບຄ່າເລືອດ
let isGameOver = false;

let enemySpawnerInterval;
let startTime;
let invincibilityDuration = 5000;

let score = 0;
let survivalTime = 0;
let lastScoreUpdate = 0;

let isTimeStopped = false;
let canTeleport = false;
let skillCooldown = 3000;
let lastSkill = 0;
let mouseX = 0;
let mouseY = 0;

// ຄ່າ keyboard
const w = "🥺";
const a = "😎";
const s = "😁";
const d = "😂";

// ຄ່າ events
let p = { emoji: "❤️" };
const e = "👻";

// ຄ່າຕວາມໄວ ການຍຶງ
const speed1 = 0.5; // ຄວາມໄວເຄື່ອງທີ່
const speed2 = 0.5; // ຄວາມໄວຍຶງອອກ

function activateSkill() {
  const now = Date.now();
  if (now - lastSkill >= skillCooldown) {
    isTimeStopped = true;
    canTeleport = true;
    lastSkill = now;
    setTimeout(() => {
      isTimeStopped = false;
    }, 3000);
  }
}

// ຟັງຊັນສ້າງຄ່າເລືອດ
function initHearts() {
  playerHearts = [];
  for (let i = 0; i < player.hp; i++) {
    playerHearts.push(true);
  }
}

// events
function spawnEnemy() {
  let randomX = Math.random() * (canvas.width - 60);
  let randomY = Math.random() * (canvas.height - 60);

  // ສ້າງ Object events
  let newEnemy = {
    x: randomX,
    y: randomY,
    size: 60,
    emoji: e,
    speed: 1.5,
  };
  enemies.push(newEnemy);
}

//  start game
function initGame() {
  startTime = Date.now();
  initHearts();
  enemies = [];
  spawnEnemy();

  // ຕັ້ງໂມງຈັບເວລາໃຫ້ສ້າງສັດຕູເພີ່ມທຸກໆ 20 ວິນາທີ
  if (enemySpawnerInterval) clearInterval(enemySpawnerInterval);
  enemySpawnerInterval = setInterval(() => {
    if (!isGameOver) {
      spawnEnemy(); // events
    }
  }, 20000);
}
initGame();

// skill 1
canvas.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === "1") {
    activateSkill();
  }
});
canvas.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

// skill 1 if click
canvas.addEventListener("click", (e) => {
  if (canTeleport) {
    player.x = mouseX;
    player.y = mouseY;
    canTeleport = false;
    console.log("Teleported!");
  }
});

// Game Over
btnRetry.addEventListener("click", () => {
  location.reload(); // reload
});

btnMenu.addEventListener("click", () => {
  window.location.href = "../frontend/index.html";
});

function shootBullet(shooter) {
  if (isGameOver) return;

  // ຄຳນວນທິດທາງຈາກ  events ໄປຫາ player
  let dx = (player.x - shooter.x) / 100;
  let dy = (player.y - shooter.y) / 100;

  bullets.push({
    x: shooter.x,
    y: shooter.y,
    size: 30,
    p,
    dx: dx,
    dy: dy,
  });

  shootSound.currentTime = 0;
  shootSound.play().catch(() => {}); // ຫຼິ້ນສຽງຍິງ
}

// ຟັງຊັນກວດສອບການຕຳກັນ
function isCollide(a, b) {
  return (
    Math.abs(a.x - b.x) < a.size / 2 + b.size / 2 &&
    Math.abs(a.y - b.y) < a.size / 2 + b.size / 2
  );
}

// ຟັງຊັນຈົບເກມ (Game Over)
function triggerGameOver() {
  isGameOver = true;

  gameOverSound.play().catch(() => {});
  clearInterval(enemySpawnerInterval);
  // ສະແດງໜ້າຈໍ Game Over (ເອົາ class 'hidden' ອອກ)
  gameOverScreen.classList.remove("hidden");
}

// 60 ວຶ
function update() {
  if (isGameOver) return;

  // ອັບເດດເວລາແລະຄະແນນ
  survivalTime = Math.floor((Date.now() - startTime) / 1000);
  if (Date.now() - lastScoreUpdate >= 1000) {
    score += 1;
    lastScoreUpdate = Date.now();
  }

  // ອັບເດດຈໍສະເເດງເວລາແລະຄະແນນຫ
  document.getElementById("timeDisplay").textContent =
    "Time: " + survivalTime + "s";
  document.getElementById("scoreDisplay").textContent =
    "Score: " + Math.floor(score);

  if (keys["w"]) {
    player.y -= 5;
    player.emoji = w;
    moveSound.play().catch(() => {});
  }
  if (keys["s"]) {
    player.y += 5;
    player.emoji = s;
    moveSound.play().catch(() => {});
  }
  if (keys["a"]) {
    player.x -= 5;
    player.emoji = a;
    moveSound.play().catch(() => {});
  }
  if (keys["d"]) {
    player.x += 5;
    player.emoji = d;
    moveSound.play().catch(() => {});
  }

  player.x = Math.max(
    player.size / 2,
    Math.min(canvas.width - player.size / 2, player.x)
  );
  player.y = Math.max(
    player.size / 2,
    Math.min(canvas.height - player.size / 2, player.y)
  );

  enemies.forEach((enemy) => {
    if (isTimeStopped) return;

    // ຄຳນວນໄລຍະຫ່າງລະຫວ່າງ ຜີ ກັບ ຄົນ
    let dirX = player.x - enemy.x;
    let dirY = player.y - enemy.y;
    let dist = Math.sqrt(dirX * dirX + dirY * dirY);

    // ສັ່ງໃຫ້ຜີຍ່າງເຂົ້າຫາຜູ້ຫຼິ້ນ
    if (dist > 1) {
      enemy.x += (dirX / dist) * enemy.speed;
      enemy.y += (dirY / dist) * enemy.speed;
    }

    // ສຸ່ມໃຫ້ຜີຍິງລູກກະສຸນ
    if (Math.random() < 0.01) {
      shootBullet(enemy);
    }
  });

  // 3. ອັບເດດລູກກະສຸນ
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    if (!isTimeStopped) {
      b.x += b.dx * speed1;
      b.y += b.dy * speed2;
    }

    if (
      isCollide(player, b) &&
      Date.now() - startTime >= invincibilityDuration
    ) {
      // ຫາຫົວໃຈທີ່ຍັງແດງຢູ່ ແລ້ວປ່ຽນເປັນສີຂາວ
      let heartDamaged = false;
      for (let h = 0; h < playerHearts.length; h++) {
        if (playerHearts[h] === true) {
          playerHearts[h] = false;
          heartDamaged = true;
          hitSound.currentTime = 0;
          hitSound.play().catch(() => {});
          bullets.splice(i, 1);
          break;
        }
      }

      // ຖ້າຫົວໃຈໝົດທຸກດວງ overgame
      if (!heartDamaged || playerHearts.every((h) => h === false)) {
        triggerGameOver();
      }
    }

    // ລົບກະສຸນທີ່ອອກນອກຈໍ
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1);
    }
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // ລ້າງໜ້າຈໍເກົ່າ

  // ວາດຫົວໃຈ
  for (let i = 0; i < playerHearts.length; i++) {
    ctx.font = "40px Arial";
    ctx.fillText(playerHearts[i] ? "❤️" : "🤍", 20 + i * 50, 50);
  }

  // ວາດສະຖານະ skill  ຂອງທັກສະ 1
  const remainingCooldown = skillCooldown - (Date.now() - lastSkill);
  if (remainingCooldown > 0) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(10, 10, 200, 30);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(
      "Skill 1 Cooldown: " + Math.ceil(remainingCooldown / 1000) + "s",
      15,
      30
    );
  }

  // ວາດຜູ້ຫຼິ້ນ
  ctx.font = player.size + "px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(player.emoji, player.x, player.y);

  if (
    Date.now() - startTime < invincibilityDuration &&
    Math.floor(Date.now() / 500) % 2 === 0
  ) {
    ctx.font = "30px Arial";
    ctx.fillText("👼", player.x, player.y - player.size / 2 - 10);
  }

  // ວາດສັດຕູທຸກໂຕໃນ Array
  enemies.forEach((enemy) => {
    ctx.font = enemy.size + "px Arial";
    ctx.fillText(enemy.emoji, enemy.x, enemy.y);
  });

  // ວາດລູກກະສຸນ
  bullets.forEach((b) => {
    ctx.font = b.size + "px Arial";
    ctx.fillText(b.p.emoji, b.x, b.y);
  });
}

// ເລີ່ມເກມ
update();
