// register.js - Fixed Version for GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');

    // Debug: Check existing localStorage
    console.log("Current localStorage:", localStorage);
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission reload
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Input validation
        if (!username || !password) {
            showError("Username and password are required!");
            return;
        }
        
        if (password.length < 6) {
            showError("Password must be at least 6 characters");
            return;
        }

        try {
            // Get existing users or create new object
            const users = JSON.parse(localStorage.getItem('users')) || {};
            
            // Check if username exists
            if (users[username]) {
                showError("Username already exists!");
                return;
            }
            
            // Add new user
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Debug output
            console.log("Registration successful! Updated users:", users);
            
            // Show success and redirect
            showSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
            
        } catch (error) {
            console.error("LocalStorage error:", error);
            showError("Registration failed. Please check console for details.");
        }
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.color = "#ff4d4d";
        errorElement.style.display = "block";
    }
    
    function showSuccess(message) {
        errorElement.textContent = message;
        errorElement.style.color = "#4dff4d";
        errorElement.style.display = "block";
    }

    // Debug function to check storage
    window.debugStorage = function() {
        console.log("Current users:", JSON.parse(localStorage.getItem('users')));
    };
});
