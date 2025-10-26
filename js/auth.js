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
  return emailRegex.test(email);
}

// Hàm kiểm tra số điện thoại (10-11 số)
function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
}

// Hàm toggle hiển thị/ẩn mật khẩu
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling;
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

// === ĐĂNG NHẬP ===
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

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      showToast("Sai email hoặc mật khẩu!", "error");
      return;
    }

    // Kiểm tra tài khoản có bị khóa không
    if (user.isLocked) {
      showToast("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!", "error");
      return;
    }

    // Lưu thông tin user
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        phone: user.phone,
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

// === ĐĂNG KÝ ===
async function register() {
  // Lấy giá trị từ form đăng ký (đúng id từ registerForm)
  const fullname = document.querySelector('#registerForm #fullname').value.trim();
  const email = document.querySelector('#registerForm #email').value.trim();
  const phone = document.querySelector('#registerForm #phone').value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // ✅ Kiểm tra tất cả các trường BẮT BUỘC
  if (!fullname) {
    showToast("Vui lòng nhập họ và tên!", "error");
    return;
  }

  if (!email) {
    showToast("Vui lòng nhập email!", "error");
    return;
  }

  if (!validateEmail(email)) {
    showToast(" Email không hợp lệ!", "error");
    return;
  }

  if (!phone) {
    showToast("Vui lòng nhập số điện thoại!", "error");
    return;
  }

  if (!validatePhone(phone)) {
    showToast("Số điện thoại phải có 10-11 chữ số!", "error");
    return;
  }

  if (!password) {
    showToast("Vui lòng nhập mật khẩu!", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Mật khẩu phải có ít nhất 6 ký tự!", "error");
    return;
  }

  if (!confirmPassword) {
    showToast("Vui lòng xác nhận mật khẩu!", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Mật khẩu xác nhận không khớp!", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    // Kiểm tra trùng email
    if (users.find((u) => u.email === email)) {
      showToast("Email đã tồn tại!", "error");
      return;
    }

    // Tính ID mới
    const lastId = users.length > 0 ? parseInt(users[users.length - 1].id) : 0;
    const newId = lastId + 1;

    const newUser = {
      id: newId.toString(),
      fullname,
      email,
      password,
      phone,
      role: "user",
      isLocked: false // Mặc định không bị khóa
    };

    const addRes = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (addRes.ok) {
      showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");
      
      // Reset form
      document.querySelector('#registerForm form').reset();
      
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