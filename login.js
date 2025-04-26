document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const validUser = users.find(user => user.username === username && user.password === password);

  if (validUser) {
    localStorage.setItem("currentUser", username); // aktif kullanıcıyı kaydet
    alert("Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz.");
    window.location.href = "index.html"; // girişten sonra ana sayfaya
  } else {
    alert("Kullanıcı adı veya şifre yanlış!");
  }
});
