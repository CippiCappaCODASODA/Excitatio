// Ensure this runs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // 1. First verify we're on the correct domain
    if (!window.location.href.includes('github.io')) {
        console.warn('Testing outside GitHub Pages - behavior may differ');
    }

    // 2. Storage availability check (GitHub Pages specific)
    function isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error('Storage blocked:', e);
            document.getElementById('error').textContent = 
                'Please disable privacy extensions and allow storage for this site';
            return false;
        }
    }

    if (!isStorageAvailable()) return;

    // 3. Get form elements with null checks
    const registerForm = document.querySelector('form[id="registerForm"]');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');

    if (!registerForm || !usernameInput || !passwordInput) {
        console.error('Form elements missing! Check your HTML IDs');
        return;
    }

    // 4. Form submission handler
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Input validation
        if (!username || username.length < 3) {
            showError('Username must be at least 3 characters');
            return;
        }
        
        if (!password || password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        // Storage operations
        try {
            const users = JSON.parse(localStorage.getItem('users') || {};
            
            // Check for existing user
            if (users.hasOwnProperty(username)) {
                showError('Username already exists');
                return;
            }
            
            // Store new user (in production, NEVER store plain passwords!)
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Debug output
            console.log('Registration successful. Current users:', users);
            
            // Visual feedback
            showSuccess('Account created successfully! Redirecting...');
            
            // GitHub Pages sometimes needs extra time for storage
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Case-sensitive redirect for GitHub Pages
            const loginPage = window.location.href.includes('excitatio') 
                ? 'login.html' 
                : 'Login.html';
            window.location.href = loginPage;
            
        } catch (error) {
            console.error('Registration failed:', error);
            showError('Registration error. Please check console for details.');
        }
    });

    // Helper functions
    function showError(message) {
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.className = 'error-message active';
    }
    
    function showSuccess(message) {
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.className = 'error-message success';
    }

    // Debug utilities
    window.debugAuth = {
        clearAll: () => localStorage.clear(),
        listUsers: () => JSON.parse(localStorage.getItem('users') || {}),
        testLogin: (u, p) => {
            const users = JSON.parse(localStorage.getItem('users') || {});
            return users[u] === p;
        },
        simulateRegister: (u, p) => {
            const users = JSON.parse(localStorage.getItem('users') || {});
            users[u] = p;
            localStorage.setItem('users', JSON.stringify(users));
        }
    };
});
