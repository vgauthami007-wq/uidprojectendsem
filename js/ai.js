// ===== ai.js =====

async function getAITip() {
  const btn  = document.getElementById('aiBtn');
  const body = document.getElementById('aiBody');
  if (!btn || !body) return;

  btn.disabled    = true;
  btn.textContent = '⏳ Thinking...';
  body.innerHTML  = '<p class="ai-placeholder">Analyzing your habits...</p>';

  const habits    = Storage.getHabits();
  const habitList = habits.map(h => `${h.name} (streak: ${h.streak} days)`).join(', ');

  const prompt = habitList
    ? `I'm tracking these habits: ${habitList}. Give me exactly 3 specific, motivating, actionable tips to improve my consistency. Be concise. Format as a numbered list.`
    : `Give me 3 great habit-building tips for a beginner. Be concise and motivating. Format as a numbered list.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || 'No tips available right now.';
    body.innerHTML = `<p class="ai-text">${text.replace(/\n/g, '<br>')}</p>`;
  } catch (err) {
    body.innerHTML = '<p class="ai-placeholder">Could not load tips. Check your connection and try again.</p>';
  }

  btn.disabled    = false;
  btn.textContent = 'Refresh Tips';
}