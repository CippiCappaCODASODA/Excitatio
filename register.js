// register.js - Fixed Version
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill all fields!");
    return;
  }

  if (localStorage.getItem(username)) {
    alert("Username already exists!");
    return;
  }

  const user = {
    username: username,
    password: password,
    rank: "New Member",  // 🔥 BURASI: Yeni üyeye "New Member" rankı veriyoruz
    registeredAt: new Date().toISOString() // 🔥 kayıt tarihini de tutalım
  };

  localStorage.setItem(username, JSON.stringify(user));
  alert("Registration successful!");
  window.location.href = "login.html";
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

    // Debug function to check storage
    window.debugStorage = function() {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        console.log("Current users:", users);
        return users;
    };
});
