// Show Register Form
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Show Login Form
function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Handle Login
async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!username || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
        const users = await response.json();
        
        if (users.length > 0) {
            const user = users[0];
            // Save user to localStorage (remove password)
            const userInfo = {
                id: user.id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                role: user.role
            };
            localStorage.setItem('user', JSON.stringify(userInfo));
            
            showToast('Đăng nhập thành công!', 'success');
            
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
    } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra!', 'error');
    }
}

// Handle Register
async function handleRegister() {
    const fullname = document.getElementById('registerFullname').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    
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
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Email không hợp lệ!', 'error');
        return;
    }
    
    try {
        // Check if username exists
        const checkUsername = await fetch(`${API_URL}/users?username=${username}`);
        const existingUsers = await checkUsername.json();
        
        if (existingUsers.length > 0) {
            showToast('Tên đăng nhập đã tồn tại!', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            username: username,
            password: password,
            email: email,
            fullname: fullname,
            role: 'user'
        };
        
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        
        if (response.ok) {
            showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            setTimeout(() => {
                showLoginForm();
            }, 1500);
        } else {
            throw new Error('Failed to register');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra khi đăng ký!', 'error');
    }
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'home.html';
    }
});