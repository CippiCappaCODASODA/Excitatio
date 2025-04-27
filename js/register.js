
import { auth } from './js/firebase-init.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorElement = document.getElementById('registerError');
    const registerBtn = document.getElementById('registerBtn');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!email || !password || !confirmPassword) {
            showError("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            showError("Password must be at least 6 characters!");
            return;
        }

        registerBtn.disabled = true;
        registerBtn.innerHTML = 'Creating account...';

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.href = "login.html";
        } catch (error) {
            console.error(error);
            showError("Registration failed! Email might be already used.");
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerHTML = 'Create Account';
        }
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.color = "#ff4d4d";
        errorElement.style.display = "block";
    }
});
