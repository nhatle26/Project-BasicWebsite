// ------------------- CẤU HÌNH -------------------
const API_URL = "http://localhost:3000/orders";
const SHIPPING_FEE = 30000;

// ------------------- HÀM TIỆN ÍCH -------------------
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

<<<<<<< HEAD
// ------------------- HIỂN THỊ TÓM TẮT ĐƠN HÀNG -------------------
=======
// Hàm tự động điền thông tin người dùng đã đăng nhập
function autofillUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        
        // Tự động điền và KHÓA các trường: Họ tên, Email, SĐT
        if (user.fullname) {
            document.getElementById('fullname').value = user.fullname;
            document.getElementById('fullname').readOnly = true;
            document.getElementById('fullname').style.backgroundColor = '#f0f0f0';
        }
        
        if (user.email) {
            document.getElementById('email').value = user.email;
            document.getElementById('email').readOnly = true;
            document.getElementById('email').style.backgroundColor = '#f0f0f0';
        }
        
        if (user.phone) {
            document.getElementById('phone').value = user.phone;
            document.getElementById('phone').readOnly = true;
            document.getElementById('phone').style.backgroundColor = '#f0f0f0';
        }
    } else {
        // Nếu chưa đăng nhập → chuyển về trang login
        alert('Vui lòng đăng nhập để tiếp tục đặt hàng!');
        window.location.href = 'login.html';
    }
}

// Hàm toggle hiển thị form thanh toán
function togglePaymentDetails() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Ẩn tất cả các form chi tiết
    document.getElementById('bankingDetails').style.display = 'none';
    document.getElementById('momoDetails').style.display = 'none';
    
    // Hiển thị form tương ứng
    if (paymentMethod === 'banking') {
        document.getElementById('bankingDetails').style.display = 'block';
    } else if (paymentMethod === 'momo') {
        document.getElementById('momoDetails').style.display = 'block';
    }
}

// Hàm hiển thị tóm tắt đơn hàng
>>>>>>> 4f72ba81f308211b8066526f1993678f2254afdc
function renderOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    const cart = getCart();

    if (cart.length === 0) {
        alert('Giỏ hàng trống! Quay lại trang giỏ hàng.');
        window.location.href = 'cart.html';
        return;
    }

    let subtotal = 0;
    orderItemsContainer.innerHTML = cart.map(item => {
        const totalItem = item.price * item.quantity;
        subtotal += totalItem;
        return `
            <div class="order-item">
<<<<<<< HEAD
                <img src="${item.image}" alt="${item.name}" width="60">
                <div>
                    <p>${item.name}</p>
                    <p>x${item.quantity}</p>
=======
                <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    class="order-item-img"
                    onerror="this.src='https://via.placeholder.com/60?text=No+Image'" 
                >
                <div class="order-item-info">
                    <p class="order-item-name">${item.name}</p>
                    <p class="order-item-quantity">x${item.quantity}</p>
>>>>>>> 4f72ba81f308211b8066526f1993678f2254afdc
                </div>
                <p>${formatCurrency(totalItem)}</p>
            </div>
        `;
    }).join('');

    subtotalElement.textContent = formatCurrency(subtotal);
    totalElement.textContent = formatCurrency(subtotal + SHIPPING_FEE);
}

// ------------------- CHUYỂN ĐỔI PHƯƠNG THỨC THANH TOÁN -------------------
function togglePaymentDetails() {
    const method = document.querySelector('input[name="payment"]:checked').value;

    document.getElementById('bankingDetails').style.display = 'none';
    document.getElementById('momoDetails').style.display = 'none';

    if (method === 'banking') {
        document.getElementById('bankingDetails').style.display = 'block';
    } else if (method === 'momo') {
        document.getElementById('momoDetails').style.display = 'block';
    }
}

// ------------------- XỬ LÝ ĐẶT HÀNG -------------------
function placeOrder() {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const note = document.getElementById('note').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // 2. Kiểm tra chỉ ĐỊA CHỈ là bắt buộc (họ tên, email, SĐT đã tự động điền)
    if (!address) {
        alert('Vui lòng nhập địa chỉ giao hàng!');
        document.getElementById('address').focus();
        return;
    }

    // Lấy thông tin thanh toán tùy phương thức
    let paymentInfo = {};

    if (paymentMethod === 'banking') {
        paymentInfo.bankName = document.getElementById('customerBankName').value.trim();
        paymentInfo.accountNumber = document.getElementById('customerBankAccount').value.trim();
        paymentInfo.accountName = document.getElementById('customerBankAccountName').value.trim();
    } else if (paymentMethod === 'momo') {
        paymentInfo.momoPhone = document.getElementById('customerMomoPhone').value.trim();
        paymentInfo.momoName = document.getElementById('customerMomoName').value.trim();
    }

    const cart = getCart();
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + SHIPPING_FEE;

    // Tạo đối tượng đơn hàng
    const newOrder = {
        id: Date.now().toString(),
        customer: { fullname, phone, email, address, note },
        items: cart,
        subtotal,
        shippingFee: SHIPPING_FEE,
        total: totalValue,
        payment: paymentMethod,
        paymentInfo: paymentInfo,
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'Đang chờ xác nhận'
    };

    // 5. Lưu đơn hàng
    saveOrder(newOrder);

    // 6. Xóa giỏ hàng và thông báo thành công
    localStorage.removeItem('cart');

    let successMessage = `Đặt hàng thành công!\n\nTổng cộng: ${formatCurrency(totalValue)}`;
    
    if (paymentMethod === 'banking') {
        successMessage += '\n\nVui lòng chuyển khoản theo thông tin đã cung cấp với nội dung:\nHOADON ' + newOrder.id;
    } else if (paymentMethod === 'momo') {
        successMessage += '\n\nVui lòng thanh toán qua MoMo theo thông tin đã cung cấp với nội dung:\nHOADON ' + newOrder.id;
    } else {
        successMessage += '\n\nBạn sẽ thanh toán khi nhận hàng (COD).';
    }
    
    successMessage += '\n\nĐơn hàng của bạn đang chờ xác nhận.';
    
    alert(successMessage);
    
    // Chuyển hướng về trang chủ
    window.location.href = 'home.html'; 
}

// Tải thông tin khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    autofillUserInfo();      // ← Tự động điền thông tin user
    renderOrderSummary();    // ← Hiển thị giỏ hàng
});
