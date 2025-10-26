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

// ------------------- TỰ ĐỘNG ĐIỀN USER -------------------
function autofillUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        
        if (user.fullname) {
            const el = document.getElementById('fullname');
            el.value = user.fullname;
            el.readOnly = true;
            el.style.backgroundColor = '#f0f0f0';
        }

        if (user.email) {
            const el = document.getElementById('email');
            el.value = user.email;
            el.readOnly = true;
            el.style.backgroundColor = '#f0f0f0';
        }

        if (user.phone) {
            const el = document.getElementById('phone');
            el.value = user.phone;
            el.readOnly = true;
            el.style.backgroundColor = '#f0f0f0';
        }
    } else {
        alert('Vui lòng đăng nhập để tiếp tục đặt hàng!');
        window.location.href = 'login.html';
    }
}

// ------------------- HIỂN THỊ GIỎ HÀNG -------------------
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
                <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    class="order-item-img"
                    onerror="this.src='https://via.placeholder.com/60?text=No+Image'" 
                >
                <div class="order-item-info">
                    <p class="order-item-name">${item.name}</p>
                    <p class="order-item-quantity">x${item.quantity}</p>
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
    const address = document.getElementById('address').value.trim();
    const note = document.getElementById('note').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // 1. Kiểm tra địa chỉ
    if (!address) {
        alert('Vui lòng nhập địa chỉ giao hàng!');
        document.getElementById('address').focus();
        return;
    }

    // 2. Lấy thông tin thanh toán
    let paymentInfo = {};

    if (paymentMethod === 'banking') {
        paymentInfo = {
            bankName: document.getElementById('customerBankName').value.trim(),
            accountNumber: document.getElementById('customerBankAccount').value.trim(),
            accountName: document.getElementById('customerBankAccountName').value.trim()
        };
    } else if (paymentMethod === 'momo') {
        paymentInfo = {
            momoPhone: document.getElementById('customerMomoPhone').value.trim(),
            momoName: document.getElementById('customerMomoName').value.trim()
        };
    }

    // 3. Lấy giỏ hàng và tính tiền
    const cart = getCart();
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalValue = subtotal + SHIPPING_FEE;

    // 4. Tạo đối tượng đơn hàng
    const newOrder = {
        id: Date.now().toString(),
        customer: { fullname, email, phone, address, note },
        items: cart,
        subtotal,
        shippingFee: SHIPPING_FEE,
        total: totalValue,
        paymentMethod: paymentMethod,
        paymentInfo: paymentInfo,
        date: new Date().toLocaleString('vi-VN'),
        status: 'Đang chờ xác nhận'
    };

    // 5. Lưu vào db.json qua JSON Server
    saveOrder(newOrder);
}

// ------------------- LƯU ĐƠN HÀNG -------------------
function saveOrder(order) {
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    })
    .then(res => {
        if (!res.ok) throw new Error('Lưu đơn hàng thất bại');
        return res.json();
    })
    .then(data => {
        console.log('Đơn hàng đã lưu:', data);
        localStorage.removeItem('cart'); // Xóa giỏ hàng

        alert(`Đặt hàng thành công!\n\nTổng cộng: ${formatCurrency(order.total)}\nĐơn hàng của bạn đang chờ xác nhận.`);
        window.location.href = 'home.html';
    })
    .catch(err => {
        console.error('Lỗi khi lưu đơn hàng:', err);
        alert('Không thể lưu đơn hàng. Vui lòng thử lại!');
    });
}

// ------------------- KHI TRANG LOAD -------------------
document.addEventListener('DOMContentLoaded', () => {
    autofillUserInfo();
    renderOrderSummary();
});
