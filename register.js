document.addEventListener('DOMContentLoaded', function() {
    // 1. Get DOM elements
    const registerForm = document.getElementById('registerForm');
    const errorElement = document.getElementById('registerError');
    const submitBtn = registerForm ? registerForm.querySelector('button[type="submit"]') : null;

    // 2. Check if elements exist
    if (!registerForm || !errorElement || !submitBtn) {
        console.error('Missing required elements!');
        return;
    }

    // 3. Form submission handler
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 4. Get input values
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 5. Reset error state
        errorElement.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        // 6. Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            showError('All fields are required!');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            return;
        }

        if (password.length < 8) {
            showError('Password must be at least 8 characters');
            return;
        }

        // 7. Registration logic
        try {
            await registerUser(username, email, password);
            window.location.href = 'login.html?registered=true';
        } catch (err) {
            showError(err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });

    // 8. Helper functions
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }

    async function registerUser(username, email, password) {
        // 9. Check if user exists (in localStorage)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(user => user.username === username || user.email === email);
        
        if (userExists) {
            throw new Error('Username or email already exists');
        }

        // 10. Hash password (basic example - use proper hashing in production)
        const hashedPassword = await hashPassword(password);

        // 11. Store new user
        users.push({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem('users', JSON.stringify(users));
    }

    async function hashPassword(password) {
        // Basic hashing - replace with proper implementation
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
});
