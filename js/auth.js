// auth.js - Xử lý đăng nhập, đăng ký và session management

// ===== UTILITY FUNCTIONS =====

// Hiển thị thông báo lỗi cho input
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(inputId + 'Error');
    
    if (input && errorSpan) {
        input.classList.add('error');
        errorSpan.textContent = message;
        errorSpan.classList.add('show');
    }
}

// Xóa thông báo lỗi
function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(inputId + 'Error');
    
    if (input && errorSpan) {
        input.classList.remove('error');
        errorSpan.textContent = '';
        errorSpan.classList.remove('show');
    }
}

// Xóa tất cả lỗi trong form
function clearAllErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            clearError(input.id);
        });
    }
}

// Hiển thị thông báo thành công
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
        
        setTimeout(() => {
            successDiv.classList.remove('show');
        }, 3000);
    }
}

// Hiển thị thông báo alert
function showAlert(message) {
    const alertDiv = document.getElementById('alertMessage');
    if (alertDiv) {
        alertDiv.textContent = message;
        alertDiv.classList.add('show');
        
        setTimeout(() => {
            alertDiv.classList.remove('show');
        }, 5000);
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password (tối thiểu 6 ký tự)
function validatePassword(password) {
    return password.length >= 6;
}

// ===== SESSION MANAGEMENT =====

// Lưu thông tin user đang đăng nhập
function saveCurrentUser(user) {
    // Không lưu password vào localStorage
    const userSession = {
        id: user.id,
        email: user.email,
        name: user.name
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Kiểm tra đã đăng nhập chưa
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Yêu cầu đăng nhập (redirect nếu chưa đăng nhập)
function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ===== LOGIN HANDLER =====

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Clear previous errors
    clearAllErrors('loginForm');
    
    // Validate
    let hasError = false;
    
    if (!email) {
        showError('loginEmail', 'Vui lòng nhập email');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('loginEmail', 'Email không hợp lệ');
        hasError = true;
    }
    
    if (!password) {
        showError('loginPassword', 'Vui lòng nhập mật khẩu');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Disable button và hiển thị loading
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="loading"></span> Đang đăng nhập...';
    
    try {
        // Gọi API đăng nhập
        const user = await UsersAPI.login(email, password);
        
        // Lưu session
        saveCurrentUser(user);
        
        // Thông báo thành công
        showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        
        // Chuyển về trang chủ sau 1 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert(error.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Đăng nhập';
    }
}

// ===== REGISTER HANDLER =====

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const registerBtn = document.getElementById('registerBtn');
    
    // Clear previous errors
    clearAllErrors('registerForm');
    
    // Validate
    let hasError = false;
    
    if (!name) {
        showError('registerName', 'Vui lòng nhập họ tên');
        hasError = true;
    }
    
    if (!email) {
        showError('registerEmail', 'Vui lòng nhập email');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('registerEmail', 'Email không hợp lệ');
        hasError = true;
    }
    
    if (!password) {
        showError('registerPassword', 'Vui lòng nhập mật khẩu');
        hasError = true;
    } else if (!validatePassword(password)) {
        showError('registerPassword', 'Mật khẩu phải có ít nhất 6 ký tự');
        hasError = true;
    }
    
    if (!confirmPassword) {
        showError('registerConfirmPassword', 'Vui lòng xác nhận mật khẩu');
        hasError = true;
    } else if (password !== confirmPassword) {
        showError('registerConfirmPassword', 'Mật khẩu không khớp');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Disable button và hiển thị loading
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<span class="loading"></span> Đang đăng ký...';
    
    try {
        // Kiểm tra email đã tồn tại chưa
        const emailExists = await UsersAPI.checkEmailExists(email);
        if (emailExists) {
            showError('registerEmail', 'Email đã được đăng ký');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Đăng ký';
            return;
        }
        
        // Tạo user mới
        const newUser = {
            name: name,
            email: email,
            password: password, // ⚠️ Trong thực tế cần hash password
            createdAt: new Date().toISOString()
        };
        
        // Gọi API đăng ký
        await UsersAPI.register(newUser);
        
        // Thông báo thành công
        showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        
        // Chuyển sang tab đăng nhập sau 2 giây
        setTimeout(() => {
            switchTab('login');
            // Pre-fill email
            document.getElementById('loginEmail').value = email;
        }, 2000);
        
    } catch (error) {
        console.error('Register error:', error);
        showAlert('Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
        registerBtn.disabled = false;
        registerBtn.textContent = 'Đăng ký';
    }
}

// ===== TAB SWITCHING =====

function switchTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        clearAllErrors('registerForm');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        clearAllErrors('loginForm');
    }
}

// ===== TOGGLE PASSWORD VISIBILITY =====

function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (isLoggedIn()) {
        console.log('User already logged in:', getCurrentUser());
    }
    
    // Setup event listeners
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Password toggle
    setupPasswordToggle();
});

// Export functions để sử dụng ở các trang khác
window.auth = {
    getCurrentUser,
    isLoggedIn,
    requireLogin,
    logout,
    saveCurrentUser
};