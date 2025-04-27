
import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');
    const loginBtn = document.getElementById('loginButton');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError("Email and password are required!");
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Logging in...';

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "index.html";
        } catch (error) {
            console.error(error);
            showError(error.message);
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Login';
        }
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.color = "#ff4d4d";
        errorElement.style.display = "block";
    }
});
