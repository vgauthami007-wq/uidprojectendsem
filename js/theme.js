// ===== theme.js =====

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}

function initTheme() {
  const settings = Storage.getSettings();
  applyTheme(settings.darkMode);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const s = Storage.getSettings();
      s.darkMode = !s.darkMode;
      Storage.saveSettings(s);
      applyTheme(s.darkMode);
    });
  }
}

document.addEventListener('DOMContentLoaded', initTheme);