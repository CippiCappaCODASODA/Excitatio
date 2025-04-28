document.addEventListener('DOMContentLoaded', function() {
    const pb = new PocketBase('http://127.0.0.1:8090'); // PocketBase sunucu URL'si
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const registerBtn = document.getElementById('registerBtn');
    const errorElement = document.getElementById('registerError');
    const successElement = document.getElementById('registerSuccess');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmInput.value.trim();

        // Validasyon
        if (!username || !email || !password || !confirmPassword) {
            showError("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match!");
            return;
        }

        registerBtn.disabled = true;
        registerBtn.innerHTML = 'Creating account <span class="loading"></span>';

        try {
            // PocketBase'e kullanıcı kaydı
            const userData = {
                username: username,
                email: email,
                password: password,
                passwordConfirm: password,
                emailVisibility: true // E-posta görünürlüğü (isteğe bağlı)
            };

            await pb.collection('users').create(userData);

            // Başarılı kayıt
            showSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            console.error("Registration error:", error);
            
            // PocketBase hata mesajını kullanıcıya göster
            let errorMessage = "Registration failed. Please try again.";
            if (error.data && error.data.data) {
                const fieldErrors = error.data.data;
                if (fieldErrors.username) errorMessage = fieldErrors.username.message;
                else if (fieldErrors.email) errorMessage = fieldErrors.email.message;
                else if (fieldErrors.password) errorMessage = fieldErrors.password.message;
            }
            
            showError(errorMessage);
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerHTML = 'Create Account';
        }
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'var(--error)';
        successElement.style.display = 'none';
    }

    function showSuccess(message) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        successElement.style.color = 'var(--success)';
        errorElement.style.display = 'none';
    }
});
