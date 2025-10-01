// Chuyển đổi form
function toggleForm(formId) {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById(formId).classList.add("active");
}

// Xử lý Đăng ký
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("regName").value;
  let email = document.getElementById("regEmail").value;
  let password = document.getElementById("regPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Kiểm tra email trùng
  if (users.some(u => u.email === email)) {
    alert("Email đã tồn tại!");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công! Mời bạn đăng nhập.");
  toggleForm("loginForm");
});

// Xử lý Đăng nhập
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "home.html";
  } else {
    alert("Sai email hoặc mật khẩu!");
  }
});
