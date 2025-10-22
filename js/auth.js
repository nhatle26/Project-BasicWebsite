// auth.js - Xử lý đăng nhập và đăng ký (không cần JSON Server)

// Hiển thị form đăng ký
function showRegister() {
    document.getElementById('loginForm').style.display    = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Hiển thị form đăng nhập
function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display    = 'block';
}

// Hàm hiển thị thông báo toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className   = `toast toast-${type}`;
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
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Thêm CSS animation cho toast
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id       = 'toast-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to   { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Lấy danh sách users từ localStorage hoặc db.json
async function getUsers() {
    let users = localStorage.getItem('users');
    if (users) {
        return JSON.parse(users);
    }
    try {
        const response = await fetch('../db.json');
        if (response.ok) {
            const data = await response.json();
            users = data.users || [];
            localStorage.setItem('users', JSON.stringify(users));
            return users;
        }
    } catch (error) {
        console.error('Không thể load db.json:', error);
    }
    return [
        {
            id: "1",
            username: "admin",
            password: "admin123",
            email: "admin@flowershop.com",
            role: "admin",
            fullname: "Quản Trị Viên"
        },
        {
            id: "2",
            username: "user01",
            password: "user123",
            email: "user01@gmail.com",
            role: "user",
            fullname: "Nguyễn Văn A"
        }
    ];
}

// Lưu danh sách users vào localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Xử lý đăng nhập
async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }
    
    try {
        const users = await getUsers();
        const user  = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            const userSession = {
                id       : user.id,
                username : user.username,
                fullname : user.fullname,
                email    : user.email,
                role     : user.role
            };
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            
            showToast('Đăng nhập thành công!', 'success');
            
            setTimeout(() => {
                const returnUrl = localStorage.getItem('returnUrl');
                if (returnUrl) {
                    localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'home.html';
                }
            }, 1000);
        } else {
            showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        showToast('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
    }
}

// Xử lý đăng ký (chỉnh sửa)
async function register() {
    const fullname        = document.getElementById('fullname').value.trim();
    const email           = document.getElementById('email').value.trim();
    const password        = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validate
    if (!fullname || !email || !password || !confirmPassword) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Email không hợp lệ!', 'error');
        return;
    }
    
    try {
        const users = await getUsers();
        if (users.find(u => u.email === email)) {
            showToast('Email đã được sử dụng!', 'error');
            return;
        }
        
        const newUser = {
            id      : Date.now().toString(),
            username: email,            // sử dụng email làm username nếu bạn không nhập username riêng
            password: password,
            fullname: fullname,
            email   : email,
            role    : 'user'
        };
        
        users.push(newUser);
        saveUsers(users);
        
        // Gửi email xác nhận qua EmailJS
        const templateParams = {
            user_name : fullname,
            user_email: email
        };
        
        emailjs.send('service_yd4bsba', 'template_1vhr4u8', templateParams)
            .then(function(response) {
                console.log('✅ Email gửi thành công:', response.status, response.text);
            })
            .catch(function(error) {
                console.error('❌ Lỗi gửi email:', error);
            });
        
        showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        
        setTimeout(() => {
            document.getElementById('fullname').value       = '';
            document.getElementById('email').value          = '';
            document.getElementById('newPassword').value    = '';
            document.getElementById('confirmPassword').value= '';
            showLogin();
        }, 1500);
        
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        showToast('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
    }
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'home.html';
        return;
    }
    
    const showRegisterFlag = localStorage.getItem('showRegister');
    if (showRegisterFlag === 'true') {
        showRegister();
        localStorage.removeItem('showRegister');
    }
    
    await getUsers();
});

// Xử lý Enter key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const loginForm    = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && loginForm.style.display !== 'none') {
            login();
        } else if (registerForm && registerForm.style.display !== 'none') {
            register();
        }
    }
});
