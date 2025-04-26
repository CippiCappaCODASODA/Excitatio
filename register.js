document.addEventListener('DOMContentLoaded', function() {
    // 1. First verify localStorage works
    try {
        localStorage.setItem('storage_test', '1');
        if(localStorage.getItem('storage_test') !== '1') {
            showError("Browser storage access blocked. Try:", [
                "- Using Chrome/Firefox",
                "- Disabling privacy extensions",
                "- Checking site permissions"
            ].join('\n'));
            return;
        }
        localStorage.removeItem('storage_test');
    } catch (e) {
        showError("Cannot access browser storage: " + e.message);
        return;
    }

    // 2. Get elements with null checks
    const registerForm = document.forms.registerForm || 
                       document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');

    if (!registerForm || !usernameInput || !passwordInput || !errorElement) {
        console.error("Missing required elements!");
        return;
    }

    // 3. Enhanced form handler
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validation
        if (!username) {
            showError("Username required");
            usernameInput.focus();
            return;
        }
        
        if (!password || password.length < 6) {
            showError("Password must be 6+ characters");
            passwordInput.focus();
            return;
        }

        // Storage operations
        try {
            const users = JSON.parse(localStorage.getItem('users') || {};
            
            if (users[username]) {
                showError(`Username "${username}" already exists`);
                return;
            }
            
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            
            console.debug("New user added:", {username, password});
            showSuccess("Account created! Redirecting...");
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
            
        } catch (e) {
            console.error("Registration failed:", e);
            showError("System error. Check console and try again.");
        }
    });

    function showError(message) {
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff4d4d;
            display: block;
            padding: 10px;
            border: 1px solid #ff4d4d;
            background: rgba(255,0,0,0.1);
        `;
    }
    
    function showSuccess(message) {
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #4dff4d;
            display: block;
            padding: 10px;
            border: 1px solid #4dff4d;
            background: rgba(0,255,0,0.1);
        `;
    }
});

// Debug helpers
window.debugAuth = {
    clear: () => localStorage.removeItem('users'),
    list: () => JSON.parse(localStorage.getItem('users') || '{}'),
    test: (u,p) => { 
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        return users[u] === p;
    }
};
