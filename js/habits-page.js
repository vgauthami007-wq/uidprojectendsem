// ===== habits-page.js =====

requireAuth();

let habits      = [];
let currentSort = 'name';

document.addEventListener('DOMContentLoaded', () => {
  habits = Storage.getHabits();
  render();
});

function render() {
  const query   = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const list    = document.getElementById('allHabitsList');
  const empty   = document.getElementById('emptyState');
  list.innerHTML = '';

  let filtered = habits.filter(h => h.name.toLowerCase().includes(query));

  // Sort
  if (currentSort === 'streak') {
    filtered.sort((a, b) => b.streak - a.streak);
  } else if (currentSort === 'completion') {
    filtered.sort((a, b) => {
      const doneA = Object.values(a.completions).filter(Boolean).length;
      const doneB = Object.values(b.completions).filter(Boolean).length;
      return doneB - doneA;
    });
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (filtered.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  filtered.forEach((h, i) => {
    const totalDone = Object.values(h.completions).filter(Boolean).length;
    const card = document.createElement('div');
    card.className = 'all-habit-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div style="width:46px;height:46px;border-radius:14px;background:${h.color}22;
           display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">${h.emoji}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:800;font-size:15px;color:var(--text)">${h.name}</div>
        <div style="display:flex;gap:14px;margin-top:4px">
          <span style="font-size:12px;color:var(--muted)">🔥 ${h.streak} streak</span>
          <span style="font-size:12px;color:var(--muted)">✅ ${totalDone} total</span>
        </div>
        <div class="progress-bar" style="margin-top:8px">
          <div class="progress-fill" style="width:${Math.min(100,h.streak*10)}%;background:${h.color}"></div>
        </div>
      </div>
      <div class="all-habit-dot" style="background:${h.color}"></div>
    `;
    list.appendChild(card);
  });
}

function filterHabits() { render(); }

function sortHabits(type, el) {
  currentSort = type;
  document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  render();
}