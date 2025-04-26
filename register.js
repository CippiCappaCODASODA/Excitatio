document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!username || !password) {
    alert("Lütfen tüm alanları doldurun!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    alert("Bu kullanıcı adı zaten kullanılıyor!");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  
  alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
  window.location.href = "login.html"; // login sayfasına yönlendir
});
