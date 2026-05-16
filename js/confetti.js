// ===== confetti.js =====

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx     = canvas.getContext('2d');

  const COLORS = ['#7C6FE0','#4ECDC4','#FF6B6B','#F7DC6F','#45B7D1','#BB8FCE','#FD9644'];
  const pieces  = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height - canvas.height,
      w:     Math.random() * 12 + 6,
      h:     Math.random() * 6 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.15,
      vx:    (Math.random() - 0.5) * 2.5,
      vy:    Math.random() * 3 + 2,
      alpha: 1,
    });
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      p.vy  += 0.06; // gravity

      if (frame > 80) p.alpha -= 0.012;
    });

    frame++;
    if (frame < 160) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw();
}