document.addEventListener('DOMContentLoaded', function() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');
    const loginBtn = document.getElementById('loginButton');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const usernameOrEmail = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validasyon
        if (!usernameOrEmail || !password) {
            showError("Email and password are required!");
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Logging in <span class="loading"></span>';

        try {
            // PocketBase ile giriş
            const authData = await pb.collection('users').authWithPassword(
                usernameOrEmail.includes('@') ? usernameOrEmail : `username="${usernameOrEmail}"`,
                password
            );

            // Başarılı giriş
            showSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } catch (error) {
            console.error('Login error:', error.response || error);
            
            // Detaylı hata mesajı
            let errorMessage = "Login failed. Please try again.";
            if (error.status === 400) {
                errorMessage = "Invalid email or password";
            } else if (error.status === 0) {
                errorMessage = "Cannot connect to server";
            }
            
            showError(errorMessage);
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Login';
        }
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorElement.style.color = "#ff4d4d";
    }
    
    function showSuccess(message) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorElement.style.color = "#4dff4d";
    }
});
