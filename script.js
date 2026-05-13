const consoleScreen = document.getElementById('console');
const revealScreen = document.getElementById('reveal');
const typewriterEl = document.getElementById('typewriter');
const statusEl = document.getElementById('status');
const decryptArea = document.getElementById('decrypt-area');
const decryptBtn = document.getElementById('decrypt-btn');
const backBtn = document.getElementById('back-btn');

let consoleFinished = false;
const heartText = "Я тя лю ^^";

// Typewriter
const typeText = "Initializing heart.PROTOCOL_v2.0...";
let i = 0;

function typeWriter() {
  if (i < typeText.length) {
    typewriterEl.textContent += typeText.charAt(i);
    i++;
    setTimeout(typeWriter, 35);
  } else {
    consoleFinished = true;
    statusEl.textContent = "READY";
    statusEl.style.color = "#22ff88";
    decryptArea.classList.remove('hidden');
  }
}

// ====================== HEART ANIMATION ======================
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
let points = [];
let time = 0;
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initHeart();
}

function initHeart() {
  points = [];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const baseScale = Math.min(canvas.width, canvas.height) * 0.9 / 38;

  // Основное сердце (много точек)
  for (let t = 0; t < Math.PI * 2; t += 0.025) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    
    points.push({
      baseX: cx + x * baseScale,
      baseY: cy + y * baseScale * 0.95,
      scale: 1,
      alpha: 0,
      targetAlpha: 0.85 + Math.random() * 0.15,
      delay: Math.random() * 1200,
      offset: Math.random() * Math.PI * 2,
      size: 15 + Math.random() * 6
    });
  }

  // Внутренние слои для объёма
  for (let layer = 0.65; layer < 1; layer += 0.12) {
    for (let t = 0; t < Math.PI * 2; t += 0.045) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      
      points.push({
        baseX: cx + x * baseScale * layer,
        baseY: cy + y * baseScale * layer * 0.95,
        scale: layer,
        alpha: 0,
        targetAlpha: 0.35 + Math.random() * 0.35,
        delay: 800 + Math.random() * 1800,
        offset: Math.random() * Math.PI * 2,
        size: 11 + Math.random() * 5
      });
    }
  }
}

function drawHeart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.018;

  points.forEach(p => {
    if (time * 1000 > p.delay) {
      p.alpha += (p.targetAlpha - p.alpha) * 0.025;
    }

    const pulse = Math.sin(time * 2.8 + p.offset) * 0.03 + 1;
    
    ctx.save();
    ctx.globalAlpha = p.alpha * (0.7 + Math.sin(time * 3 + p.offset) * 0.3);
    ctx.fillStyle = '#ff4d6d';
    ctx.font = `bold ${p.size * pulse}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Лёгкое плавание
    const floatY = Math.sin(time * 1.8 + p.offset) * 2.5;
    
    ctx.fillText(heartText, p.baseX, p.baseY + floatY);
    
    // Дополнительное свечение (glow)
    if (p.alpha > 0.6) {
      ctx.shadowColor = '#ff8fb1';
      ctx.shadowBlur = 18;
      ctx.fillText(heartText, p.baseX, p.baseY + floatY);
    }
    
    ctx.restore();
  });

  animationFrame = requestAnimationFrame(drawHeart);
}

// ====================== NAVIGATION ======================
function showReveal() {
  consoleScreen.classList.remove('active');
  revealScreen.classList.add('active');
  resizeCanvas();
  drawHeart();
}

function showConsole() {
  cancelAnimationFrame(animationFrame);
  revealScreen.classList.remove('active');
  consoleScreen.classList.add('active');
}

// Events
decryptBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showReveal();
});

backBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showConsole();
});

consoleScreen.addEventListener('click', () => {
  if (consoleFinished) showReveal();
});

window.addEventListener('resize', resizeCanvas);

// Init
typeWriter();
consoleScreen.classList.add('active');