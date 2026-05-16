// ===== storage.js =====

const Storage = {
  KEY_HABITS:   'hb_habits',
  KEY_SETTINGS: 'hb_settings',

  getHabits() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY_HABITS)) || this._defaultHabits();
    } catch { return this._defaultHabits(); }
  },

  saveHabits(habits) {
    localStorage.setItem(this.KEY_HABITS, JSON.stringify(habits));
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY_SETTINGS)) || this._defaultSettings();
    } catch { return this._defaultSettings(); }
  },

  saveSettings(settings) {
    localStorage.setItem(this.KEY_SETTINGS, JSON.stringify(settings));
  },

  _defaultHabits() {
    return [
      { id: 1, name: 'Exercise',   emoji: '🏃', color: '#7C6FE0', streak: 5, completions: {} },
      { id: 2, name: 'Study',      emoji: '📚', color: '#4ECDC4', streak: 2, completions: {} },
      { id: 3, name: 'Meditation', emoji: '🧘', color: '#FF6B6B', streak: 7, completions: {} },
    ];
  },

  _defaultSettings() {
    return { darkMode: false, notifications: true, reminderTime: '08:00' };
  },

  clearAll() {
    localStorage.removeItem(this.KEY_HABITS);
    localStorage.removeItem(this.KEY_SETTINGS);
  },
};