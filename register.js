document.addEventListener('DOMContentLoaded', function() {
    const pb = new PocketBase('http://127.0.0.1:8090'); // PocketBase bağlantısı
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validation
        if (!username || !password) {
            showError("Username and password are required!");
            return;
        }
        
        if (password.length < 6) {
            showError("Password must be at least 6 characters");
            return;
        }

        try {
            // PocketBase'e kayıt yap
            await pb.collection('users').create({
                username: username,
                email: `${username}@excitatio.fake`,  // Fake email (PocketBase requires email)
                password: password,
                passwordConfirm: password
            });

            // Başarılı kayıt
            showSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
            
        } catch (error) {
            console.error("PocketBase error:", error);
            showError(error.message || "Registration failed.");
        }
    });

    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = "#ff4d4d";
            errorElement.style.display = "block";
        }
    }
    
    function showSuccess(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = "#4dff4d";
            errorElement.style.display = "block";
        }
    }
});
