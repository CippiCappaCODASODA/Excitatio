document.addEventListener('DOMContentLoaded', function() {
    // PocketBase bağlantısı
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    // DOM elementleri
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('loginInput');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('error');
    const successElement = document.getElementById('success');
    const loginBtn = document.getElementById('loginButton');
    const forgotLink = document.getElementById('forgotLink');
    const canvas = document.getElementById('chainCanvas');
    const ctx = canvas.getContext('2d');

    // Canvas boyutunu ayarla
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Arkaplan animasyonu
    const elements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'];
    const chains = [];
    
    for (let i = 0; i < 200; i++) {
        chains.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() * 0.6 - 0.3),
            speedY: (Math.random() * 0.6 - 0.3),
            size: Math.random() * 12 + 8,
            element: elements[Math.floor(Math.random() * elements.length)],
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        chains.forEach(c => {
            ctx.fillStyle = `rgba(214, 0, 34, ${c.opacity})`;
            ctx.font = `${c.size}px monospace`;
            ctx.fillText(c.element, c.x, c.y);

            c.x += c.speedX;
            c.y += c.speedY;

            if (c.x > canvas.width + 50) c.x = -50;
            if (c.y > canvas.height + 50) c.y = -50;
            if (c.x < -50) c.x = canvas.width + 50;
            if (c.y < -50) c.y = canvas.height + 50;
        });

        requestAnimationFrame(draw);
    }

    draw();

    // Daha önce giriş yapılmışsa email/username'i doldur
    const authData = JSON.parse(localStorage.getItem('pocketbase_auth') || 'null');
    if (authData && authData.model) {
        loginInput.value = authData.model.username || authData.model.email;
        passwordInput.focus();
    }

    // Giriş formu gönderimi
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const identity = loginInput.value.trim();
        const password = passwordInput.value.trim();

        // Önceki mesajları temizle
        errorElement.style.display = 'none';
        successElement.style.display = 'none';

        // Validasyon
        if (!identity || !password) {
            showError("Email/username and password are required!");
            return;
        }

        // Yükleme durumu
        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Logging in <span class="loading"></span>';

        try {
            // PocketBase ile kimlik doğrulama
            let authData;
            if (identity.includes('@')) {
                // Email ile giriş
                authData = await pb.collection('users').authWithPassword(identity, password);
            } else {
                // Username ile giriş
                const users = await pb.collection('users').getFullList({
                    filter: `username = "${identity}"`,
                    $autoCancel: false
                });
                
                if (users.length === 0) {
                    throw new Error("User not found");
                }
                
                authData = await pb.collection('users').authWithPassword(users[0].email, password);
            }
            
            // Oturum bilgilerini sakla
            document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
            localStorage.setItem('pocketbase_auth', JSON.stringify({
                token: pb.authStore.token,
                model: pb.authStore.model
            }));

            // Başarı mesajı göster ve yönlendir
            showSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = "Login failed. Please try again.";
            if (error.status === 400) {
                errorMessage = "Invalid credentials";
            } else if (error.message.includes("not found")) {
                errorMessage = "User not found";
            } else if (error.status === 0) {
                errorMessage = "Cannot connect to server";
            }
            
            showError(errorMessage);
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Login';
        }
    });

    // Şifre sıfırlama
    forgotLink.addEventListener('click', async function(e) {
        e.preventDefault();
        const email = prompt("Enter your email to reset password:");
        
        if (email) {
            try {
                await pb.collection('users').requestPasswordReset(email);
                alert("Password reset link sent to your email");
            } catch (error) {
                alert("Error sending reset link: " + error.message);
            }
        }
    });

    // Pencere boyutu değiştiğinde canvas'ı yeniden boyutlandır
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Hata mesajı göster
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#ff4d4d';
    }
    
    // Başarı mesajı göster
    function showSuccess(message) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        successElement.style.color = '#4dff4d';
    }
});
