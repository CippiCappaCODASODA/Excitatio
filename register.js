// register.js - Fixed Version
document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("registerUsername");
  const passwordInput = document.getElementById("registerPassword");

  try {
    const existingUser = localStorage.getItem(usernameInput.value);

    if (existingUser) {
      alert("This username is already taken.");
    } else {
      const newUser = {
        username: usernameInput.value,
        password: passwordInput.value,
        rank: "New Member",
        signupDate: new Date().toISOString()
      };
      localStorage.setItem(newUser.username, JSON.stringify(newUser));
      alert("Registration successful! Please log in.");
      window.location.href = "login.html"; // go to login page
    }
  } catch (error) {
    console.error("An error occurred during registration:", error);
    alert("An unexpected error occurred.");
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

    // Debug function to check storage
    window.debugStorage = function() {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        console.log("Current users:", users);
        return users;
    };
});
