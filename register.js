document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const registerForm = document.getElementById('registerForm');
    const errorElement = document.getElementById('registerError');
    const submitBtn = document.querySelector('button[type="submit"]');
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('strengthMeter');

    // Security Config
    const MAX_ATTEMPTS = 5;
    let attempts = 0;
    const PASSWORD_MIN_ENTROPY = 60; // bits

    // Password Strength Real-time Check
    passwordInput.addEventListener('input', function() {
        const entropy = calculatePasswordEntropy(passwordInput.value);
        updateStrengthMeter(entropy);
    });

    // Form Submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Rate Limiting
        if (attempts >= MAX_ATTEMPTS) {
            showError('Too many attempts. Wait 15 minutes.');
            return;
        }
        attempts++;

        // CSRF Protection
        if (document.getElementById('csrfToken').value !== 
            localStorage.getItem('lastCSRFToken')) {
            showError('Security token expired. Refresh page.');
            return;
        }

        // Get Values
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!validateInputs(username, email, password, confirmPassword)) return;

        // Registration
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Creating Account <span class="loading"></span>';

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

    // Helper Functions
    function validateInputs(username, email, password, confirmPassword) {
        let isValid = true;

        // Username
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            showError('Username: 3-20 chars (letters, numbers, _)');
            isValid = false;
        }

        // Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showError('Invalid email format');
            isValid = false;
        }

        // Password
        const entropy = calculatePasswordEntropy(password);
        if (entropy < PASSWORD_MIN_ENTROPY) {
            showError('Password too weak (add more variety)');
            isValid = false;
        }

        // Confirm Password
        if (password !== confirmPassword) {
            showError('Passwords must match exactly');
            document.getElementById('confirmPassword').value = '';
            isValid = false;
        }

        return isValid;
    }

    async function registerUser(username, email, password) {
        // Check existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.username === username || u.email === email)) {
            throw new Error('Username/email already exists');
        }

        // Secure password storage
        const { salt, hash } = await hashPassword(password);
        
        users.push({
            username,
            email,
            password: `${salt}:${hash}`, // Store salt separately
            createdAt: new Date().toISOString()
        });

        localStorage.setItem('users', JSON.stringify(users));
    }

    async function hashPassword(password) {
        // Generate salt
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        
        // Hash with salt using PBKDF2 (better than SHA-256 for passwords)
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );
        
        const hashBuffer = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: encoder.encode(Array.from(salt).join('')),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        return {
            salt: Array.from(salt).join(','),
            hash: Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0')).join('')
        };
    }

    function calculatePasswordEntropy(password) {
        // Character pool size estimation
        let poolSize = 0;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;

        // Entropy calculation
        return Math.log2(Math.pow(poolSize, password.length));
    }

    function updateStrengthMeter(entropy) {
        let width = 0;
        let color = '#ff4d4d';

        if (entropy >= 80) {
            width = 100; color = '#4dff4d'; // Strong
        } else if (entropy >= 60) {
            width = 75; color = '#ffcc00'; // Medium
        } else if (entropy >= 40) {
            width = 50; color = '#ff9933'; // Weak
        } else {
            width = 25; // Very weak
        }

        strengthMeter.style.width = `${width}%`;
        strengthMeter.style.background = color;
    }

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
});