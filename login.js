function login() {
    const passwordInput = document.getElementById("password").value;
    const correctPassword = "seninşifren"; // ← Change this to your actual password
    const statusElement = document.getElementById("status");
    const loadingContainer = document.getElementById("loading-container");
    const loadingBar = document.getElementById("loading-bar");

    if (!passwordInput) {
        alert("Please enter a password!");
        return;
    }

    if (passwordInput === correctPassword) {
        statusElement.innerText = "Correct Password";
        statusElement.style.color = "#4CAF50";
        startLoadingAnimation();
    } else {
        statusElement.innerText = "Incorrect Password";
        statusElement.style.color = "#f44336";
    }
}

function startLoadingAnimation() {
    const loadingContainer = document.getElementById("loading-container");
    const loadingBar = document.getElementById("loading-bar");
    
    loadingContainer.style.display = "block";
    loadingBar.style.width = "0%";
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            window.location.href = "index.html";
        } else {
            width++;
            loadingBar.style.width = width + "%";
        }
    }, 20);
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to button
    const loginButton = document.querySelector('button[onclick="login()"]');
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }
    
    // Add Enter key support
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});
