// Lấy các phần tử
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

//xử lý ẩn hiện form
// Chuyển sang form Đăng ký
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

// Quay lại form Đăng nhập từ Đăng ký
showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

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
    alert("Vui lòng nhập đầy đủ email và mật khẩu!");
    return;
  }

  if (!validateEmail(email)) {
    alert("Email không hợp lệ!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Sai email hoặc mật khẩu!");
      return;
    }
    // Kiểm tra tài khoản có bị khóa không
    if (user.isLocked) {
      alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!");
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

    alert("Đăng nhập thành công!");

    setTimeout(() => {
      window.location.href = user.role === "admin" ? "admin.html" : "home.html";
    }, 1000);
  } catch (err) {
    console.error(err);
    showToast("Không thể kết nối đến server!", "error");
  }
}

// === ĐĂNG KÝ ===
async function register() {
  // Lấy giá trị từ form đăng ký (đúng id từ registerForm)
  const fullname = document
    .querySelector("#registerForm #fullname")
    .value.trim();
  const email = document.querySelector("#registerForm #email").value.trim();
  const phone = document.querySelector("#registerForm #phone").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  // ✅ Kiểm tra tất cả các trường BẮT BUỘC
  if (!fullname) {
    alert("Vui lòng nhập họ và tên!");
    return;
  }

  if (!email) {
    alert("Vui lòng nhập email!");
    return;
  }

  if (!validateEmail(email)) {
    alert(" Email không hợp lệ!", "error");
    return;
  }

  if (!phone) {
    alert("Vui lòng nhập số điện thoại!");
    return;
  }

  if (!validatePhone(phone)) {
    alert("Số điện thoại phải có 10-11 chữ số!");
    return;
  }

  if (!password) {
    alert("Vui lòng nhập mật khẩu!");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự!");
    return;
  }
  if (!confirmPassword) {
    alert("Vui lòng xác nhận mật khẩu!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    // Kiểm tra trùng email
    if (users.find((u) => u.email === email)) {
      alert("Email đã tồn tại!");
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
      isLocked: false, // Mặc định không bị khóa
    };

    const addRes = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (addRes.ok) {
      emailjs
        .send("service_6uulo8x", "template_2zz5xx9", {
          email: newUser.email,
          name: newUser.fullname,
          password: newUser.password,
        })
        .then((response) => {
          console.log("Email sent!", response.status, response.text);
        })
        .catch((error) => {
          console.error("Email send error:", error);
        });

      alert("Đăng ký thành công");
    } else {
      alert("Không thể lưu tài khoản!");
    }
  } catch (err) {
    console.error(err);
    alert("Không thể kết nối JSON Server!");
  }
}

// === Nếu đã đăng nhập thì chuyển trang ===
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    window.location.href = "home.html";
  }
});
