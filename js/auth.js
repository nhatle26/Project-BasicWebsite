function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}
function showLogin() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

// Thông báo nhanh
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success"
        ? "#4CAF50"
        : type === "error"
        ? "#f44336"
        : "#2196F3"
    };
    color: white;
    padding: 12px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

const style = document.createElement("style");
style.textContent = `
@keyframes fadeIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }
`;
document.head.appendChild(style);

// Hàm kiểm tra định dạng email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email); // Return true nếu hợp lệ, false nếu không
}

// Hàm toggle hiển thị/ẩn mật khẩu
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling; // Icon mắt nằm ngay sau input
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// === Đăng nhập ===
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showToast("Vui lòng nhập đầy đủ email và mật khẩu!", "error");
    return;
  }

  if (!validateEmail(email)) {
    showToast("Email không hợp lệ!", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    // Chỉ tìm user bằng email
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      showToast("Sai email hoặc mật khẩu!", "error");
      return;
    }

    // Lưu thông tin user
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      })
    );

    showToast("Đăng nhập thành công!", "success");

    setTimeout(() => {
      window.location.href =
        user.role === "admin" ? "admin.html" : "home.html";
    }, 1000);
  } catch (err) {
    console.error(err);
    showToast("Không thể kết nối đến server!", "error");
  }
}

// === Đăng ký ===
async function register() {
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // Kiểm tra đầy đủ
  if (!fullname || !email || !password || !confirmPassword) {
    showToast("Vui lòng nhập đầy đủ thông tin!", "error");
    return;
  }

  if (!validateEmail(email)) {
    showToast("Email không hợp lệ!", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Mật khẩu phải có ít nhất 6 ký tự!", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Mật khẩu xác nhận không khớp!", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    const lastId = users.length > 0 ? parseInt(users[users.length - 1].id) : 0;
    const newId = lastId + 1;

    // Kiểm tra trùng email
    if (users.find((u) => u.email === email)) {
      showToast("Email đã tồn tại!", "error");
      return;
    }

    const newUser = {
      id: newId.toString(), // Đảm bảo id là string như db.json
      fullname,
      email,
      password,
      role: "user",
    };

    const addRes = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (addRes.ok) {
      showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");
      setTimeout(() => showLogin(), 1500);
    } else {
      showToast("Không thể lưu tài khoản!", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Không thể kết nối JSON Server!", "error");
  }
}

// === ENTER để tự động submit ===
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && loginForm.style.display !== "none") {
      login();
    } else if (registerForm && registerForm.style.display !== "none") {
      register();
    }
  }
});

// === Nếu đã đăng nhập thì chuyển trang ===
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    window.location.href = "home.html";
  }
});