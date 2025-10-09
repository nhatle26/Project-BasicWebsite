// js/main.js - Điều hướng, navbar, hiển thị thông tin người dùng

// ===== LẤY THÔNG TIN USER HIỆN TẠI =====
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// ===== CẬP NHẬT NAVBAR =====
function updateNavbar() {
    const currentUser = getCurrentUser();
    const loginLink = document.getElementById('loginLink');
    const adminLink = document.getElementById('adminLink');

    if (!loginLink) return;

    if (currentUser) {
        // Người dùng đã đăng nhập
        loginLink.textContent = `👤 ${currentUser.name || currentUser.email}`;
        loginLink.href = '#';
        loginLink.onclick = function(e) {
            e.preventDefault();
            showUserMenu();
        };

        // Hiển thị link Admin nếu user là admin
        if (adminLink && currentUser.isAdmin) {
            adminLink.style.display = 'inline-block';
        }
    } else {
        // Chưa đăng nhập
        loginLink.textContent = 'Đăng nhập';
        loginLink.href = 'login.html';
        loginLink.onclick = null;

        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }

    // Cập nhật cart badge
    updateCartBadge();
}

// ===== HIỂN THỊ MENU USER =====
function showUserMenu() {
    const choice = confirm('Bạn có muốn đăng xuất không?');
    if (choice) {
        logoutUser();
    }
}

// ===== CẬP NHẬT BADGE GIỎ HÀNG =====
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge || !window.cartUtils) return;

    const count = window.cartUtils.getCartCount();
    
    if (count > 0) {
        cartBadge.textContent = count;
        cartBadge.style.display = 'inline-block';
    } else {
        cartBadge.style.display = 'none';
    }
}

// ===== ĐĂNG XUẤT =====
function logoutUser() {
    sessionStorage.removeItem('currentUser');
    alert('Đăng xuất thành công!');
    window.location.href = 'index.html';
}

// ===== KIỂM TRA QUYỀN ADMIN =====
function checkAdminAccess() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        alert('⚠️ Bạn cần đăng nhập để truy cập trang này!');
        window.location.href = 'login.html';
        return false;
    }

    if (!currentUser.isAdmin) {
        alert('⚠️ Bạn không có quyền truy cập trang này!');
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

// ===== AUTO UPDATE KHI CART THAY ĐỔI =====
window.addEventListener('cartUpdated', updateCartBadge);

// ===== LOAD NAVBAR KHI TRANG TẢI =====
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    updateCartBadge();
});

// ===== EXPORT FUNCTIONS =====
window.mainUtils = {
    getCurrentUser,
    updateNavbar,
    updateCartBadge,
    logoutUser,
    checkAdminAccess
};