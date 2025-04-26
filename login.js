// DOM Elements
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginButton');
const errorElement = document.getElementById('error');
const forgotLink = document.getElementById('forgotLink');
const loadingContainer = document.getElementById('loading-container');
const loadingBar = document.getElementById('loading-bar');

// Configuration
const MAX_ATTEMPTS = 5;
let failedAttempts = 0;

// Check for existing session
if (localStorage.getItem('authUser')) {
  usernameInput.value = localStorage.getItem('authUser');
  passwordInput.focus();
}

function login() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const storedUsers = JSON.parse(localStorage.getItem('users')) || {};

  // Validate inputs
  if (!username || !password) {
    showError("Username and password are required.");
    return;
  }

  // Simulate loading
  startLoadingBar();

  // Simulate network delay
  setTimeout(() => {
    // Check credentials
    if (storedUsers[username] === password) {
      // Success
      failedAttempts = 0;
      localStorage.setItem('authUser', username);
      showSuccess("Login successful! Redirecting...");
      
      // Redirect after delay
      setTimeout(() => {
        window.location.href = "Excitatio.html";
      }, 1500);
    } else {
      // Failed attempt
      failedAttempts++;
      passwordInput.value = '';
      
      if (failedAttempts >= MAX_ATTEMPTS) {
        showError(`Account locked. Too many attempts.`);
        loginBtn.disabled = true;
        setTimeout(() => {
          loginBtn.disabled = false;
          failedAttempts = 0;
        }, 300000); // 5-minute lockout
      } else {
        showError(`Incorrect credentials. ${MAX_ATTEMPTS - failedAttempts} attempts left.`);
      }
    }
    stopLoadingBar();
  }, 800);
}

// Loading bar animation
function startLoadingBar() {
  loadingContainer.style.display = 'block';
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
    } else {
      width += 10;
      loadingBar.style.width = `${width}%`;
    }
  }, 50);
}

function stopLoadingBar() {
  loadingContainer.style.display = 'none';
  loadingBar.style.width = '0%';
}

// Error/Success messages
function showError(message) {
  errorElement.style.color = "var(--error)";
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function showSuccess(message) {
  errorElement.style.color = "var(--success)";
  errorElement.textContent = message;
  errorElement.style.display = "block";
  setTimeout(() => {
    errorElement.style.display = "none";
  }, 3000);
}

// Event listeners
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});

forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  alert("Contact support to reset your password.");
});

// Background animation (optional)
const canvas = document.getElementById('chainCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const elements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'];
const chains = [];

for (let i = 0; i < 200; i++) {
  chains.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speedX: (Math.random() * 0.6 - 0.3),
    speedY: (Math.random() * 0.6 - 0.3),
    size: Math.random() * 12 + 8,
    element: elements[Math.floor(Math.random() * elements.length)],
    opacity: Math.random() * 0.5 + 0.3
  });
}

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  chains.forEach(c => {
    ctx.fillStyle = `rgba(214, 0, 34, ${c.opacity})`;
    ctx.font = `${c.size}px monospace`;
    ctx.fillText(c.element, c.x, c.y);

    c.x += c.speedX;
    c.y += c.speedY;

    if (c.x > canvas.width + 50) c.x = -50;
    if (c.y > canvas.height + 50) c.y = -50;
    if (c.x < -50) c.x = canvas.width + 50;
    if (c.y < -50) c.y = canvas.height + 50;
  });

  requestAnimationFrame(draw);
}

draw();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
