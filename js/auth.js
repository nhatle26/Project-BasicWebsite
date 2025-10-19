function initDemoUsers() {
  const defaultUsers = [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      fullname: "Quản Trị Viên",
      email: "admin@flowershop.com",
      role: "admin"
    },
    {
      id: "2",
      username: "user01",
      password: "user123",
      fullname: "Người Dùng Demo",
      email: "user01@gmail.com",
      role: "user"
    },
    {
      id: "4236",
      username: "Nhật",
      password: "ben123ben",
      fullname: "Lê Minh Nhật",
      email: "nhat@gmail.com",
      role: "user"
    }
  ];

  const users = JSON.parse(localStorage.getItem("users")) || [];

  defaultUsers.forEach(def => {
    const exists = users.some(u => u.username === def.username);
    if (!exists) {
      users.push(def);
    }
  });

  localStorage.setItem("users", JSON.stringify(users));
}

initDemoUsers();

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

function register() {
  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("newUsername").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!fullname || !username || !email || !password || !confirmPassword) {
    alert("Vui lòng nhập đầy đủ các trường!");
    return;
  }
  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.username === username)) {
    alert("Tên đăng nhập đã tồn tại!");
    return;
  }
  if (users.some(u => u.email === email)) {
    alert("Email đã được dùng!");
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    fullname: fullname,
    username: username,
    email: email,
    password: password,
    role: "user"
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công! Mời bạn đăng nhập.");
  showLogin();
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Vui lòng nhập tên đăng nhập và mật khẩu!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Chào mừng ${user.fullname}!`);
    if (user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }
  } else {
    alert("Tên đăng nhập hoặc mật khẩu không đúng!");
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  alert("Bạn đã đăng xuất!");
  window.location.href = "login.html";
}

function requireLogin() {
  const cu = localStorage.getItem("currentUser");
  if (!cu) {
    window.location.href = "login.html";
  }
}

window.showRegister = showRegister;
window.showLogin = showLogin;
window.register = register;
window.login = login;
window.logout = logout;
window.requireLogin = requireLogin;
