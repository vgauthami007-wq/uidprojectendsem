// ===== app.js — Today page logic =====

requireAuth();

let habits       = [];
let selectedDate = todayStr();
let editingId    = null;
let selectedEmoji = EMOJIS[0];
let selectedColor = COLORS[0];
let editEmoji    = EMOJIS[0];
let editColor    = COLORS[0];

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  habits = Storage.getHabits();
  renderWeek();
  renderAll();
  renderHeaderDate();
  buildEmojiGrid('emojiGrid',     EMOJIS, v => { selectedEmoji = v; }, () => selectedEmoji);
  buildColorGrid('colorGrid',     COLORS, v => { selectedColor = v; }, () => selectedColor);
  buildEmojiGrid('editEmojiGrid', EMOJIS, v => { editEmoji = v; },     () => editEmoji);
  buildColorGrid('editColorGrid', COLORS, v => { editColor = v; },     () => editColor);

  // Close modals on backdrop click
  document.getElementById('addModal').addEventListener('click',  e => { if (e.target === e.currentTarget) closeAddModal(); });
  document.getElementById('editModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeEditModal(); });
});

// ── Week strip ────────────────────────────────────────────────────────────
function renderWeek() {
  const container = document.getElementById('weekScroll');
  container.innerHTML = '';
  getWeekDays().forEach(d => {
    const chip = document.createElement('div');
    chip.className = 'day-chip' + (d.date === selectedDate ? ' active' : '');
    chip.innerHTML = `<div class="day-name">${d.dayName}</div><div class="day-num">${d.dayNum}</div>`;
    chip.onclick = () => { selectedDate = d.date; renderWeek(); renderAll(); };
    container.appendChild(chip);
  });
}

function renderHeaderDate() {
  const el = document.getElementById('headerDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
}

// ── Status card ───────────────────────────────────────────────────────────
function renderStatus() {
  const done  = habits.filter(h => h.completions[selectedDate]).length;
  const total = habits.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  const card      = document.getElementById('statusCard');
  const titleEl   = document.getElementById('statusTitle');
  const subEl     = document.getElementById('statusSub');
  const pctEl     = document.getElementById('statusPct');
  const bar       = document.getElementById('overallProgress');
  const countEl   = document.getElementById('habitCount');

  card.classList.toggle('all-done', pct === 100 && total > 0);
  titleEl.textContent = pct === 100 && total > 0 ? '🎉 All habits done!' : 'Today Status';
  subEl.textContent   = `${done} of ${total} habits completed`;
  pctEl.textContent   = `${pct}%`;
  bar.style.width     = `${pct}%`;
  if (countEl) countEl.textContent = total;
}

// ── Habit list ────────────────────────────────────────────────────────────
function renderHabits() {
  const list     = document.getElementById('habitList');
  const empty    = document.getElementById('emptyState');
  list.innerHTML = '';

  if (habits.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  habits.forEach((h, i) => {
    const done    = !!h.completions[selectedDate];
    const pct     = Math.min(100, h.streak * 10);
    const card    = document.createElement('div');
    card.className = 'habit-card' + (done ? ' done' : '');
    card.style.animationDelay = `${i * 0.06}s`;
    card.innerHTML = `
      <div class="habit-row">
        <div class="habit-emoji-wrap" style="background:${h.color}22">${h.emoji}</div>
        <div class="habit-info">
          <div class="habit-name">${h.name}</div>
          <div class="habit-meta">🔥 ${h.streak} day streak</div>
        </div>
        <div class="habit-actions">
          <span class="edit-btn" onclick="openEditModal(${h.id})">✏️</span>
          <button class="check-btn ${done ? 'checked' : ''}"
            style="${done ? `background:${h.color};border-color:${h.color}` : ''}"
            onclick="toggleHabit(${h.id})">
            <span class="check-mark">✓</span>
          </button>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%;background:${h.color}"></div>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderAll() {
  renderStatus();
  renderHabits();
}

// ── Toggle habit ──────────────────────────────────────────────────────────
function toggleHabit(id) {
  habits = habits.map(h => {
    if (h.id !== id) return h;
    const wasDone = !!h.completions[selectedDate];
    const completions = { ...h.completions, [selectedDate]: !wasDone };
    const streak = !wasDone ? h.streak + 1 : Math.max(0, h.streak - 1);
    if (!wasDone) showToast(`✅ ${h.name} completed! 🔥`);
    return { ...h, completions, streak };
  });
  Storage.saveHabits(habits);
  renderAll();

  // Confetti if all done
  const done  = habits.filter(h => h.completions[selectedDate]).length;
  if (done === habits.length && habits.length > 0) {
    launchConfetti && launchConfetti();
  }
}

// ── Add modal ─────────────────────────────────────────────────────────────
function openAddModal() {
  selectedEmoji = EMOJIS[0]; selectedColor = COLORS[0];
  document.getElementById('newHabitName').value = '';
  refreshGrid('emojiGrid', EMOJIS, v => { selectedEmoji = v; }, () => selectedEmoji);
  refreshGrid('colorGrid', COLORS, v => { selectedColor = v; }, () => selectedColor, true);
  document.getElementById('addModal').classList.add('open');
  document.getElementById('newHabitName').focus();
}
function closeAddModal() { document.getElementById('addModal').classList.remove('open'); }

function addHabit() {
  const name = document.getElementById('newHabitName').value.trim();
  if (!name) { showToast('Enter a habit name!', 'error'); return; }
  const h = { id: Date.now(), name, emoji: selectedEmoji, color: selectedColor, streak: 0, completions: {} };
  habits.push(h);
  Storage.saveHabits(habits);
  closeAddModal();
  renderAll();
  showToast(`🎉 "${name}" added!`);
}

// ── Edit modal ────────────────────────────────────────────────────────────
function openEditModal(id) {
  editingId = id;
  const h = habits.find(h => h.id === id);
  if (!h) return;
  editEmoji = h.emoji; editColor = h.color;
  document.getElementById('editHabitName').value = h.name;
  refreshGrid('editEmojiGrid', EMOJIS, v => { editEmoji = v; }, () => editEmoji);
  refreshGrid('editColorGrid', COLORS, v => { editColor = v; }, () => editColor, true);
  document.getElementById('editModal').classList.add('open');
}
function closeEditModal() { document.getElementById('editModal').classList.remove('open'); editingId = null; }

function saveEdit() {
  const name = document.getElementById('editHabitName').value.trim();
  if (!name) { showToast('Enter a habit name!', 'error'); return; }
  habits = habits.map(h => h.id === editingId ? { ...h, name, emoji: editEmoji, color: editColor } : h);
  Storage.saveHabits(habits);
  closeEditModal();
  renderAll();
  showToast('Habit updated!');
}

function deleteHabit() {
  habits = habits.filter(h => h.id !== editingId);
  Storage.saveHabits(habits);
  closeEditModal();
  renderAll();
  showToast('Habit deleted', 'error');
}

// ── Grid builders ─────────────────────────────────────────────────────────
function buildEmojiGrid(containerId, items, setter, getter) {
  const container = document.getElementById(containerId);
  if (!container) return;
  items.forEach(e => {
    const el = document.createElement('div');
    el.className = 'emoji-item' + (e === getter() ? ' selected' : '');
    el.textContent = e;
    el.onclick = () => { setter(e); refreshGrid(containerId, items, setter, getter); };
    container.appendChild(el);
  });
}
function buildColorGrid(containerId, items, setter, getter) {
  const container = document.getElementById(containerId);
  if (!container) return;
  items.forEach(c => {
    const el = document.createElement('div');
    el.className = 'color-dot' + (c === getter() ? ' selected' : '');
    el.style.background = c;
    el.onclick = () => { setter(c); refreshGrid(containerId, items, setter, getter, true); };
    container.appendChild(el);
  });
}
function refreshGrid(containerId, items, setter, getter, isColor = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (isColor) buildColorGrid(containerId, items, setter, getter);
  else         buildEmojiGrid(containerId, items, setter, getter);
}