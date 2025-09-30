function toggleForm(formId) {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById(formId).classList.add("active");
}
