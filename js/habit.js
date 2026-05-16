// ===== habits.js — shared constants & helpers =====

const EMOJIS  = ['🏃','📚','🧘','💧','🌙','🎯','💪','🍎','✍️','🎵','🌿','🔥','😴','🏋️','🚴','🤸','🥗','🧠','📖','🎨'];
const COLORS  = ['#7C6FE0','#4ECDC4','#FF6B6B','#45B7D1','#96CEB4','#F7DC6F','#BB8FCE','#98D8C8','#FD9644','#A29BFE'];

// Current date as YYYY-MM-DD
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// Date string for offset
function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

// Week days for header strip
function getWeekDays() {
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date:    d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum:  d.getDate(),
      isToday: i === 0,
    });
  }
  return days;
}

// Navigate to another page (relative from pages/)
function goPage(page) {
  window.location.href = page;
}

// Show toast notification
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.className = 'toast'; }, 2600);
}

// Guard: redirect to login if not authenticated
function requireAuth() {
  if (!localStorage.getItem('hb_user')) {
    window.location.href = '../index.html';
  }
}