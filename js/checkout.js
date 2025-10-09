// js/checkout.js - Xử lý thanh toán (POST order đến API)

// ===== LƯU ĐỌN HÀNG VÀO LOCALSTORAGE =====
// Trong thực tế, bạn sẽ POST đến API: fetch('http://localhost:3000/orders', {...})
function saveOrder(orderData) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Tạo order với ID và timestamp
    const newOrder = {
        id: Date.now(),
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'pending' // pending, processing, completed, cancelled
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return newOrder;
}

// ===== LẤY TẤT CẢ ĐƠN HÀNG =====
function getAllOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

// ===== LẤY ĐƠN HÀNG CỦA USER HIỆN TẠI =====
function getUserOrders(userEmail) {
    const allOrders = getAllOrders();
    return allOrders.filter(order => order.email === userEmail);
}

// ===== LẤY ĐƠN HÀNG THEO ID =====
function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(order => order.id === parseInt(orderId));
}

// ===== CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG =====
function updateOrderStatus(orderId, newStatus) {
    const orders = getAllOrders();
    const order = orders.find(o => o.id === parseInt(orderId));
    
    if (order) {
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        return true;
    }
    return false;
}

// ===== XÓA ĐƠN HÀNG =====
function deleteOrder(orderId) {
    let orders = getAllOrders();
    orders = orders.filter(o => o.id !== parseInt(orderId));
    localStorage.setItem('orders', JSON.stringify(orders));
}

// ===== VALIDATE THÔNG TIN THANH TOÁN =====
function validateCheckoutForm(formData) {
    const errors = [];
    
    // Kiểm tra họ tên
    if (!formData.fullName || formData.fullName.trim().length < 3) {
        errors.push('Họ tên phải có ít nhất 3 ký tự');
    }
    
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Email không hợp lệ');
    }
    
    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/[- ]/g, ''))) {
        errors.push('Số điện thoại phải có 10-11 chữ số');
    }
    
    // Kiểm tra địa chỉ
    if (!formData.address || formData.address.trim().length < 5) {
        errors.push('Địa chỉ không hợp lệ');
    }
    
    // Kiểm tra thành phố
    if (!formData.city || formData.city.trim().length < 2) {
        errors.push('Vui lòng nhập thành phố/tỉnh');
    }
    
    return errors;
}

// ===== FORMAT TRẠNG THÁI ĐƠN HÀNG =====
function getOrderStatusLabel(status) {
    const statusLabels = {
        'pending': '⏳ Chờ xử lý',
        'processing': '📦 Đang xử lý',
        'shipping': '🚚 Đang giao hàng',
        'completed': '✅ Hoàn thành',
        'cancelled': '❌ Đã hủy'
    };
    return statusLabels[status] || status;
}

// ===== FORMAT PHƯƠNG THỨC THANH TOÁN =====
function getPaymentMethodLabel(method) {
    const methodLabels = {
        'cod': '💵 Thanh toán khi nhận hàng (COD)',
        'bank': '🏦 Chuyển khoản ngân hàng',
        'card': '💳 Thẻ tín dụng/Ghi nợ',
        'momo': '📱 Ví MoMo',
        'zalopay': '💙 ZaloPay'
    };
    return methodLabels[method] || method;
}
 // Thanh toán
    const cart = cartUtils.getCart();  // ← Lấy giỏ hàng
    // Xử lý thanh toán...

// ===== TÍNH TỔNG DOANH THU =====
function calculateTotalRevenue() {
    const orders = getAllOrders();
    return orders
        .filter(order => order.status === 'completed')
        .reduce((total, order) => total + order.total, 0);
}

// ===== EXPORT FUNCTIONS =====
window.checkoutUtils = {
    saveOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    validateCheckoutForm,
    getOrderStatusLabel,
    getPaymentMethodLabel,
    calculateTotalRevenue
};
document.addEventListener('DOMContentLoaded', function() {
    renderAllProducts();
    updateCartBadge();  // ✅ Hiển thị số giỏ hàng khi load
});
