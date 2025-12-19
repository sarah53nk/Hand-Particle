const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =====================
// GLOBAL STATE
// =====================
let particles = [];

let prevHandX = null;
let prevHandY = null;
let handSpeed = 0;
let colorHue = 200;

let smoothHandX = null;
let smoothHandY = null;
const EASING = 0.18;

let mode = "FLOW"; // FLOW | EXPLODE

const MAX_PARTICLES = 420;
const FINGER_TIPS = [4, 8, 12, 16, 20];

// =====================
// MEDIAPIPE HANDS
// =====================
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults((results) => {
  if (!results.multiHandLandmarks) return;

  const landmarks = results.multiHandLandmarks[0];

  // مرکز دست
  const center = landmarks[9];
  const handX = center.x * canvas.width;
  const handY = center.y * canvas.height;

  // Smooth/Easing دست
  if (smoothHandX === null) {
    smoothHandX = handX;
    smoothHandY = handY;
  } else {
    smoothHandX += (handX - smoothHandX) * EASING;
    smoothHandY += (handY - smoothHandY) * EASING;
  }

  // محاسبه سرعت از smooth
  if (prevHandX !== null && prevHandY !== null) {
    const dx = smoothHandX - prevHandX;
    const dy = smoothHandY - prevHandY;
    handSpeed = Math.sqrt(dx * dx + dy * dy);
  }
  prevHandX = smoothHandX;
  prevHandY = smoothHandY;

  // تغییر رنگ بر اساس سرعت
  colorHue += handSpeed * 0.05;
  colorHue %= 360;

  // Gesture Mode (دست باز / مشت)
  const palm = landmarks[0];
  let openness = 0;
  FINGER_TIPS.forEach(i => {
    const dx = landmarks[i].x - palm.x;
    const dy = landmarks[i].y - palm.y;
    openness += Math.sqrt(dx * dx + dy * dy);
  });
  mode = openness < 0.55 ? "EXPLODE" : "FLOW";

  // تولید ذره از نوک انگشت‌ها
  FINGER_TIPS.forEach((i) => {
    const tip = landmarks[i];
    const x = tip.x * canvas.width;
    const y = tip.y * canvas.height;

    const spawnCount = Math.min(3, Math.floor(handSpeed * 0.04) + 1);
    for (let j = 0; j < spawnCount; j++) {
      particles.push(new Particle(x, y));
    }
  });

  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }
});

// =====================
// CAMERA
// =====================
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480,
});
camera.start();

// =====================
// FLOW FIELD
// =====================
function flow(x, y) {
  const scale = 0.002;
  const angle = Math.sin(x * scale) + Math.cos(y * scale);
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

// =====================
// PARTICLE CLASS
// =====================
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.life = 90;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    const f = flow(this.x, this.y);
    const speedFactor = Math.min(handSpeed * 0.002, 1.2);

    this.vx += f.x * (0.1 + speedFactor);
    this.vy += f.y * (0.1 + speedFactor);

    // EXPLODE Mode
    if (mode === "EXPLODE") {
      this.vx += (this.x - smoothHandX) * 0.002;
      this.vy += (this.y - smoothHandY) * 0.002;
    }

    this.vx *= mode === "EXPLODE" ? 0.94 : 0.98;
    this.vy *= mode === "EXPLODE" ? 0.94 : 0.98;

    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx) {
    if (this.life > 60) {
      ctx.shadowColor = `hsla(${colorHue}, 100%, ${mode === "EXPLODE" ? "65%" : "60%"}, 0.6)`;
      ctx.shadowBlur = 6;
    } else {
      ctx.shadowBlur = 0;
    }

    const alpha = Math.min(0.35 + handSpeed * 0.003, 0.85);

    ctx.fillStyle = `hsla(${colorHue}, 100%, ${mode === "EXPLODE" ? "65%" : "60%"}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.size + handSpeed * 0.01,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;
  }
}

// =====================
// ANIMATION LOOP
// =====================
function animate() {
  requestAnimationFrame(animate);

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "lighter";

  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });
}

animate();
