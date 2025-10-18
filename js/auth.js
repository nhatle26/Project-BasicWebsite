// auth.js - Xử lý đăng nhập và đăng ký

// Hiển thị form đăng ký
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Hiển thị form đăng nhập
function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Hàm hiển thị thông báo toast
function showToast(message, type = 'info') {
    // Tạo element toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Thêm CSS animation cho toast
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Xử lý đăng nhập
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Kiểm tra input
    if (!username || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }
    
    // Lấy danh sách users từ LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tìm user khớp với username và password
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Lưu thông tin user đang đăng nhập (không lưu password)
        const userSession = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        };
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        showToast('Đăng nhập thành công!', 'success');
        
        // Chuyển hướng dựa trên role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'home.html';
            }
        }, 1000);
    } else {
        showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
}

// Xử lý đăng ký
function register() {
    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validate
    if (!fullname || !username || !email || !password || !confirmPassword) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (username.length < 4) {
        showToast('Tên đăng nhập phải có ít nhất 4 ký tự!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }
    
    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Email không hợp lệ!', 'error');
        return;
    }
    
    // Lấy danh sách users hiện tại
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kiểm tra username đã tồn tại chưa
    if (users.find(u => u.username === username)) {
        showToast('Tên đăng nhập đã tồn tại!', 'error');
        return;
    }
    
    // Kiểm tra email đã tồn tại chưa
    if (users.find(u => u.email === email)) {
        showToast('Email đã được sử dụng!', 'error');
        return;
    }
    
    // Tạo user mới
    const newUser = {
        id: Date.now().toString(), // ID duy nhất dựa trên timestamp
        username: username,
        password: password,
        fullname: fullname,
        email: email,
        role: 'user' // Mặc định là user thường
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    
    // Reset form và chuyển về form đăng nhập
    setTimeout(() => {
        document.getElementById('fullname').value = '';
        document.getElementById('newUsername').value = '';
        document.getElementById('email').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        showLogin();
    }, 1500);
}

// Khởi tạo dữ liệu demo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra nếu đã đăng nhập rồi thì chuyển về trang chủ
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'home.html';
        return;
    }
    
    // Tạo tài khoản demo nếu chưa có
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.length === 0) {
        const demoUsers = [
            {
                id: '1',
                username: 'admin',
                password: 'admin123',
                fullname: 'Administrator',
                email: 'admin@flowershop.com',
                role: 'admin'
            },
            {
                id: '2',
                username: 'user01',
                password: 'user123',
                fullname: 'Nguyễn Văn A',
                email: 'user01@example.com',
                role: 'user'
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(demoUsers));
        console.log('Đã tạo tài khoản demo');
    }
});

// Xử lý Enter key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && loginForm.style.display !== 'none') {
            login();
        } else if (registerForm && registerForm.style.display !== 'none') {
            register();
        }
    }
});