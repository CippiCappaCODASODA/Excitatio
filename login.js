// login.js - Complete Fixed Version
document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");

  try {
    const storedUser = localStorage.getItem(usernameInput.value);

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.password === passwordInput.value) {
        // Rank upgrade after 7 days
        const signupDate = new Date(user.signupDate);
        const today = new Date();
        const differenceInDays = (today - signupDate) / (1000 * 60 * 60 * 24);

        if (differenceInDays >= 7 && user.rank === "New Member") {
          user.rank = "Member";
          localStorage.setItem(user.username, JSON.stringify(user));
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert(`Welcome ${user.username}! Rank: ${user.rank}`);
        window.location.href = "index.html"; // go to homepage
      } else {
        alert("Incorrect password.");
      }
    } else {
      alert("User not found.");
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
    alert("An unexpected error occurred.");
  }
});


    // Check if page exists
    async function pageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Show error message
    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = "#ff4d4d";
            errorElement.style.display = "block";
            errorElement.classList.add('active');
        }
    }
    
    // Show success message
    function showSuccess(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = "#4dff4d";
            errorElement.style.display = "block";
            errorElement.classList.add('active');
        }
    }

    // Enter key support
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});

// Debug utilities
window.authDebug = {
    listUsers: () => JSON.parse(localStorage.getItem('users') || '{}'),
    clearAll: () => localStorage.clear(),
    testLogin: (u, p) => {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        return users[u] === p;
    },
    simulateLogin: (u, p) => {
        document.getElementById('username').value = u;
        document.getElementById('password').value = p;
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
};
