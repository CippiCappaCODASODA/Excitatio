// login.js - Complete Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');
    const loginBtn = document.getElementById('loginButton');

    // Auto-fill username if exists
    if (localStorage.getItem('authUser')) {
        usernameInput.value = localStorage.getItem('authUser');
        passwordInput.focus();
    }

    // Form submission handler
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const storedUsers = JSON.parse(localStorage.getItem('users')) || {};

        // Validation
        if (!username || !password) {
            showError("Username and password are required!");
            return;
        }

        // UI Loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Logging in <span class="loading"></span>';

        try {
            // Authentication check
            if (storedUsers[username] === password) {
                // Successful login
                localStorage.setItem('authUser', username);
                showSuccess("Login successful! Redirecting...");
                
                // GitHub Pages compatible redirect
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Multiple redirect attempts for GitHub Pages compatibility
                const redirectPaths = [
                    'index.html',
                    '/index.html',
                    '/Excitatio/index.html',
                    window.location.pathname.replace('login.html', 'index.html')
                ];

                for (const path of redirectPaths) {
                    try {
                        const fullUrl = new URL(path, window.location.origin).href;
                        if (await pageExists(fullUrl)) {
                            window.location.href = fullUrl;
                            return;
                        }
                    } catch (e) {
                        console.warn(`Redirect failed for ${path}:`, e);
                    }
                }
                
                showError("Redirect failed - index.html not found");
            } else {
                showError("Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            showError("System error during login");
        } finally {
            // Reset UI
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Login';
        }
    });

    // Check if page exists
    async function pageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Show error message
    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = "#ff4d4d";
            errorElement.style.display = "block";
        }
    }
    
    // Show success message
    function showSuccess(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = "#4dff4d";
            errorElement.style.display = "block";
        }
    }

    // Enter key support
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});

// Debug utilities
window.authDebug = {
    listUsers: () => JSON.parse(localStorage.getItem('users') || {}),
    clearAll: () => localStorage.clear(),
    testLogin: (u, p) => {
        const users = JSON.parse(localStorage.getItem('users') || {});
        return users[u] === p;
    },
    simulateLogin: (u, p) => {
        document.getElementById('username').value = u;
        document.getElementById('password').value = p;
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
};
