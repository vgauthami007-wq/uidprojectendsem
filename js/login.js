// ===== login.js =====

let quoteIndex = 0;
let quoteInterval = null;

function initQuotes() {
  const dots = document.getElementById('quoteDots');
  QUOTES.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'quote-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goToQuote(i);
    dots.appendChild(d);
  });
  renderQuote(0);
  quoteInterval = setInterval(nextQuote, 4200);
}

function renderQuote(idx) {
  const textEl   = document.getElementById('quoteText');
  const authorEl = document.getElementById('quoteAuthor');
  const dots     = document.querySelectorAll('.quote-dot');

  textEl.classList.add('fade-out');
  setTimeout(() => {
    textEl.textContent = `"${QUOTES[idx].text}"`;
    authorEl.textContent = `— ${QUOTES[idx].author}`;
    textEl.classList.remove('fade-out');
    textEl.classList.add('fade-in');
    setTimeout(() => textEl.classList.remove('fade-in'), 500);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, 300);
}

function nextQuote() {
  quoteIndex = (quoteIndex + 1) % QUOTES.length;
  renderQuote(quoteIndex);
}

function goToQuote(idx) {
  clearInterval(quoteInterval);
  quoteIndex = idx;
  renderQuote(quoteIndex);
  quoteInterval = setInterval(nextQuote, 4200);
}

// Toggle password visibility
document.getElementById('togglePass').addEventListener('click', () => {
  const inp = document.getElementById('passwordInput');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

// Enter key support
document.getElementById('emailInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('passwordInput').focus();
});
document.getElementById('passwordInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
  const email    = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value;
  const errorEl  = document.getElementById('errorMsg');

  if (!email || !password) { errorEl.textContent = 'Please fill in all fields.'; return; }
  if (!email.includes('@')) { errorEl.textContent = 'Enter a valid email address.'; return; }
  if (password.length < 4) { errorEl.textContent = 'Password must be at least 4 characters.'; return; }

  errorEl.textContent = '';

  // Animate card out
  const card = document.getElementById('loginCard');
  card.style.transition = 'transform 0.4s, opacity 0.4s';
  card.style.transform  = 'scale(0.95) translateY(-10px)';
  card.style.opacity    = '0';

  // Store user & redirect
  localStorage.setItem('hb_user', email);
  setTimeout(() => { window.location.href = 'pages/today.html'; }, 420);
}

function showForgot() {
  document.getElementById('loginForm').style.display  = 'none';
  document.getElementById('forgotForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('loginForm').style.display  = 'block';
}

function sendReset() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email || !email.includes('@')) { alert('Enter a valid email.'); return; }
  alert(`Reset link sent to ${email} (demo mode)`);
  showLogin();
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (localStorage.getItem('hb_user')) {
    window.location.href = 'pages/today.html';
    return;
  }
  initQuotes();
});