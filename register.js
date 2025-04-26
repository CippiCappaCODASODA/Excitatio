document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // 1. ELEMENT SELECTORS
    // ======================
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('registerBtn');
    const errorElement = document.getElementById('registerError') || createFallbackErrorElement();
    const strengthMeter = document.getElementById('strengthMeter');

    // ======================
    // 2. ELEMENT VALIDATION
    // ======================
    const requiredElements = {
        registerForm,
        usernameInput,
        emailInput,
        passwordInput,
        confirmInput,
        submitBtn
    };

    for (const [name, element] of Object.entries(requiredElements)) {
        if (!element) {
            console.error(`CRITICAL: ${name} element missing`);
            showFatalError('System error. Please refresh the page.');
            return;
        }
    }

    // ======================
    // 3. PASSWORD STRENGTH
    // ======================
    passwordInput.addEventListener('input', updatePasswordStrength);

    // ======================
    // 4. FORM SUBMISSION
    // ======================
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 4.1 Input validation
        if (!validateForm()) return;

        // 4.2 UI feedback
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Creating Account <span class="loading"></span>';

        try {
            // 4.3 Registration logic
            await registerUser(
                usernameInput.value.trim(),
                emailInput.value.trim(),
                passwordInput.value
            );
            
            // 4.4 Success handling
            window.location.href = 'login.html?registered=true';
        } catch (error) {
            showError(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });

    // ======================
    // 5. CORE FUNCTIONS
    // ======================
    function updatePasswordStrength() {
        if (!strengthMeter) return;
        
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        
        strengthMeter.style.width = `${strength}%`;
        strengthMeter.style.backgroundColor = getStrengthColor(strength);
    }

    function validateForm() {
        // 5.1 Username validation
        if (usernameInput.value.length < 3 || usernameInput.value.length > 20) {
            showError('Username must be 3-20 characters');
            return false;
        }
        
        // 5.2 Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError('Please enter a valid email');
            return false;
        }
        
        // 5.3 Password match
        if (passwordInput.value !== confirmInput.value) {
            showError('Passwords do not match');
            return false;
        }
        
        return true;
    }

    async function registerUser(username, email, password) {
        // 5.4 Check existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            throw new Error('Email already registered');
        }
        
        // 5.5 Password hashing (basic example)
        const hashedPassword = await hashPassword(password);
        
        users.push({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('users', JSON.stringify(users));
    }

    // ======================
    // 6. UTILITY FUNCTIONS
    // ======================
    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 30;
        if (password.length >= 12) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;
        return Math.min(strength, 100);
    }

    function getStrengthColor(strength) {
        return strength > 75 ? '#4dff4d' : 
               strength > 50 ? '#ffcc00' : '#ff4d4d';
    }

    async function hashPassword(password) {
        // Note: In production, use crypto.subtle or a proper library
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => errorElement.style.display = 'none', 5000);
    }

    function showFatalError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px;
            background: #d60022;
            color: white;
            text-align: center;
            z-index: 9999;
        `;
        errorDiv.textContent = message;
        document.body.prepend(errorDiv);
    }

    function createFallbackErrorElement() {
        const el = document.createElement('div');
        el.id = 'registerError';
        el.className = 'error-message';
        el.style.display = 'none';
        registerForm.appendChild(el);
        return el;
    }
});
