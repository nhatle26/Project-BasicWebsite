// API Base URL
const API_URL = 'http://localhost:3000';

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast-notification ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Get Cart from localStorage
function getCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
}

// Save Cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// Update Cart Badge
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
    }
}

// Add to Cart
function addToCart(productId, quantity = 1) {
    fetch(`${API_URL}/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            const cart = getCart();
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            saveCart(cart);
            showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Có lỗi xảy ra!', 'error');
        });
}

// Check Authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authLink = document.getElementById('authLink');
    
    if (authLink) {
        if (user) {
            authLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Đăng xuất`;
            authLink.href = '#';
            authLink.onclick = logout;
            
            // Show admin link if user is admin
            if (user.role === 'admin') {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.className = 'nav-link';
                adminLink.innerHTML = '<i class="fas fa-cog"></i> Quản lý';
                authLink.parentNode.insertBefore(adminLink, authLink);
            }
        } else {
            authLink.innerHTML = `<i class="fas fa-user"></i> Đăng nhập`;
            authLink.href = 'login.html';
            authLink.onclick = null;
        }
    }
}

// ==================== 🚪 ĐĂNG XUẤT (DÙNG CHUNG CHO TẤT CẢ TRANG) ====================
function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    // Xóa TẤT CẢ thông tin đăng nhập
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    alert("✅ Đã đăng xuất thành công!");
    
    // Chuyển về trang đăng nhập (đường dẫn ĐÚNG)
    window.location.href = "login.html";
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    checkAuth();
})