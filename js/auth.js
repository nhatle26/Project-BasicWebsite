// JavaScript nội tuyến

function toggleForm(formId) {
  const login = document.getElementById("loginForm");
  const register = document.getElementById("registerForm");

  // Xoá class active khỏi cả hai
  login.classList.remove("active");
  register.classList.remove("active");

  // Thêm class active cho form cần hiển thị
  document.getElementById(formId).classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const linkToRegister = document.getElementById("linkToRegister");
  const linkToLogin = document.getElementById("linkToLogin");

  linkToRegister.addEventListener("click", function (e) {
    e.preventDefault();
    toggleForm("registerForm");
  });

  linkToLogin.addEventListener("click", function (e) {
    e.preventDefault();
    toggleForm("loginForm");
  });
});
