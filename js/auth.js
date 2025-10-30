// Lấy các phần tử form
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

// Ẩn hiện form
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// --- Kiểm tra định dạng email ---
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// --- Kiểm tra số điện thoại ---
function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
}

// --- Toggle hiển thị mật khẩu ---
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling;
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// === ĐĂNG NHẬP ===
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password)
    return alert("Vui lòng nhập đầy đủ email và mật khẩu!");
  if (!validateEmail(email)) return alert("Email không hợp lệ!");

  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return alert("Sai email hoặc mật khẩu!");
    if (user.isLocked)
      return alert(
        "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!"
      );

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

    alert("Đăng nhập thành công!");
    setTimeout(() => {
      window.location.href = user.role === "admin" ? "admin.html" : "home.html";
    }, 1000);
  } catch (err) {
    console.error(err);
    alert("Không thể kết nối đến server!");
  }
}

// === ĐĂNG KÝ ===
async function register() {
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  if (!fullname) return alert("Vui lòng nhập họ và tên!");
  if (!email) return alert("Vui lòng nhập email!");
  if (!validateEmail(email)) return alert("Email không hợp lệ!");
  if (!phone) return alert("Vui lòng nhập số điện thoại!");
  if (!validatePhone(phone))
    return alert("Số điện thoại phải có 10-11 chữ số!");
  if (!password) return alert("Vui lòng nhập mật khẩu!");
  if (password.length < 6) return alert("Mật khẩu phải có ít nhất 6 ký tự!");
  if (!confirmPassword) return alert("Vui lòng xác nhận mật khẩu!");
  if (password !== confirmPassword)
    return alert("Mật khẩu xác nhận không khớp!");

  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    if (users.find((u) => u.email === email)) return alert("Email đã tồn tại!");

    const lastId = users.length > 0 ? parseInt(users[users.length - 1].id) : 0;
    const newId = lastId + 1;

    const newUser = {
      id: newId.toString(),
      fullname,
      email,
      password,
      phone,
      role: "user",
      isLocked: false,
    };

    const addRes = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (addRes.ok) {
      try {
        await emailjs.send("service_6uulo8x", "template_2zz5xx9", {
          email: newUser.email,
          name: newUser.fullname,
          password: newUser.password,
          from_name: "Datunha",
        });
        alert("🎉 Đăng ký thành công và email đã được gửi!");
      } catch (error) {
        console.error("Email send error:", error);
        alert("Đăng ký thành công, nhưng không gửi được email!");
      }
    } else {
      alert("Không thể lưu tài khoản!");
    }
  } catch (err) {
    console.error(err);
    alert("Không thể kết nối JSON Server!");
  }
}

// --- Ngăn chuyển trang khi đang test ---
document.addEventListener("DOMContentLoaded", () => {
  // Tạm thời bỏ redirect tự động khi test
});
