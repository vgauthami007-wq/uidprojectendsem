// ===== particles.js =====
(function () {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 6 + 3;
    const left  = Math.random() * 100;
    const dur   = Math.random() * 12 + 8;
    const delay = Math.random() * -14;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:${Math.random() * 0.5 + 0.2};
    `;
    container.appendChild(p);
  }
})();