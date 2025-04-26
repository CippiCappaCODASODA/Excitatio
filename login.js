function login() {
    var passwordInput = document.getElementById("password").value;
    var correctPassword = "seninşifren"; // ← Burayı kendi şifrene göre değiştir.

    if (passwordInput === correctPassword) {
        document.getElementById("status").innerText = "Correct Password";
        startLoadingAnimation();
    } else {
        document.getElementById("status").innerText = "Incorrect Password";
    }
}

function startLoadingAnimation() {
    const loadingContainer = document.getElementById("loading-container");
    const loadingBar = document.getElementById("loading-bar");
    loadingContainer.style.display = "block"; // Loading bar konteynerini göster

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            window.location.href = "index.html"; // Bar dolunca index.html'e geç
        } else {
            width++;
            loadingBar.style.width = width + "%";
        }
    }, 20); // Hızı buradan ayarlanıyor (20ms'de bir %1 artıyor)
}
