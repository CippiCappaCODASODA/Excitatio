document.addEventListener('DOMContentLoaded', function() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');
    const loginBtn = document.getElementById('loginButton');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validasyon
        if (!username || !password) {
            showError("Username and password are required!");
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Logging in <span class="loading"></span>';

        try {
            // Kullanıcı adı yerine email ile giriş yapılıyorsa:
            // await pb.collection('users').authWithPassword(email, password);
            const authData = await pb.collection('users').authWithPassword(username, password);
            
            // Token kontrolü (opsiyonel)
            if (!pb.authStore.isValid) {
                throw new Error("Authentication failed.");
            }

            console.log('Login successful:', authData);
            
            // Başarı mesajı + yönlendirme
            showError("Login successful! Redirecting...");
            errorElement.style.color = "#4dff4d";
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || "Invalid username or password.");
            passwordInput.value = ""; // Şifreyi temizle
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Login';
        }
    });

    function showError(message) {
        if (errorElement) {
            errorElement.style.display = "block";
            errorElement.style.color = "#ff4d4d";
            errorElement.textContent = message;
        }
    }
});
