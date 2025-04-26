function login() {
    const passwordInput = document.getElementById("password").value;
    const correctPassword = "seninşifren"; // CHANGE THIS TO YOUR ACTUAL PASSWORD
    const statusElement = document.getElementById("status");
    const loadingContainer = document.getElementById("loading-container");
    const loadingBar = document.getElementById("loading-bar");

    // Clear previous status
    statusElement.innerText = "";
    statusElement.style.color = "";

    if (!passwordInput) {
        showStatus("Please enter a password!", "error");
        return;
    }

    if (passwordInput === correctPassword) {
        showStatus("Access granted! Loading...", "success");
        startLoadingAnimation();
    } else {
        showStatus("Incorrect password", "error");
    }
}

function showStatus(message, type) {
    const statusElement = document.getElementById("status");
    statusElement.innerText = message;
    statusElement.style.color = type === "success" ? "#4CAF50" : "#f44336";
}

function startLoadingAnimation() {
    const loadingContainer = document.getElementById("loading-container");
    const loadingBar = document.getElementById("loading-bar");
    
    loadingContainer.style.display = "block";
    loadingBar.style.width = "0%";
    
    let width = 0;
    const interval = setInterval(() => {
        width += 1;
        loadingBar.style.width = width + "%";
        
        if (width >= 100) {
            clearInterval(interval);
            redirectToIndex();
        }
    }, 20);
}

function redirectToIndex() {
    // Double-check the correct filename (case-sensitive!)
    const redirectUrl = "index.html"; 
    
    // Verify the file exists (for debugging)
    fetch(redirectUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                window.location.href = redirectUrl;
            } else {
                showStatus("Error: index.html not found!", "error");
                console.error("Redirect target not found:", redirectUrl);
            }
        })
        .catch(error => {
            showStatus("Connection error", "error");
            console.error("Redirect failed:", error);
        });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Setup button click
    document.getElementById("loginButton")?.addEventListener('click', login);
    
    // Setup Enter key in password field
    document.getElementById("password")?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
});
