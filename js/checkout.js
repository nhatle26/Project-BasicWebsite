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

// ------------------- HIỂN THỊ TÓM TẮT ĐƠN HÀNG -------------------
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
                <img src="${item.image}" alt="${item.name}" width="60">
                <div>
                    <p>${item.name}</p>
                    <p>x${item.quantity}</p>
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

    if (!fullname || !phone || !address) {
        alert('Vui lòng nhập đầy đủ Họ tên, SĐT và Địa chỉ.');
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
        customer: { fullname, email, phone, address, note },
        items: cart,
        subtotal,
        shippingFee: SHIPPING_FEE,
        total,
        paymentMethod,
        paymentInfo,
        date: new Date().toLocaleString('vi-VN'),
        status: 'Đang chờ xác nhận'
    };

    // Gửi đơn hàng vào db.json
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
    })
    .then(res => {
        if (!res.ok) throw new Error('Không thể gửi đơn hàng');
        return res.json();
    })
    .then(data => {
        console.log('Đơn hàng đã lưu:', data);
        localStorage.removeItem('cart');
        alert(`✅ Đặt hàng thành công!\nTổng cộng: ${formatCurrency(total)}\nMã đơn: ${data.id}`);
        window.location.href = 'home.html';
    })
    .catch(err => {
        console.error(err);
        alert('❌ Có lỗi khi gửi đơn hàng. Hãy thử lại sau.');
    });
}

// ------------------- TẢI KHI TRANG ĐƯỢC MỞ -------------------
document.addEventListener('DOMContentLoaded', renderOrderSummary);
