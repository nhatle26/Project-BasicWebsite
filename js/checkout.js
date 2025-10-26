const orderItemsContainer = document.getElementById('orderItems');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

const SHIPPING_FEE = 30000;

// Hàm lấy giỏ hàng từ LocalStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

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
function renderOrderSummary() {
    const cart = getCart();

    if (cart.length === 0) {
        // Chuyển hướng nếu giỏ hàng trống
        alert('Giỏ hàng trống! Bạn sẽ được chuyển về trang giỏ hàng.');
        window.location.href = 'cart.html';
        return;
    }

    // 1. Hiển thị danh sách sản phẩm
    let subtotal = 0;

    orderItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

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
                <p class="order-item-price">
                    ${formatCurrency(itemTotal)}
                </p>
            </div>
        `;
    }).join('');

    // 2. Tính toán và hiển thị tổng tiền
    const finalTotal = subtotal + SHIPPING_FEE;

    subtotalElement.textContent = formatCurrency(subtotal);
    totalElement.textContent = formatCurrency(finalTotal);
}

// Hàm lưu đơn hàng vào LocalStorage
function saveOrder(order) {
    // Lấy danh sách đơn hàng đã có
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Thêm đơn hàng mới vào đầu danh sách
    existingOrders.unshift(order); 
    
    // Lưu lại vào LocalStorage
    localStorage.setItem('orders', JSON.stringify(existingOrders));
}

// Hàm xử lý đặt hàng (gọi từ nút "Đặt hàng")
function placeOrder() {
    // 1. Lấy thông tin khách hàng
    const fullname = document.getElementById('fullname').value.trim();
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

    // 3. Kiểm tra thông tin thanh toán theo từng phương thức
    let paymentInfo = {};
    
    if (paymentMethod === 'momo') {
        const customerMomoPhone = document.getElementById('customerMomoPhone').value.trim();
        const customerMomoName = document.getElementById('customerMomoName').value.trim();
        
        if (!customerMomoPhone || !customerMomoName) {
            alert('Vui lòng nhập đầy đủ thông tin MoMo (Số điện thoại và Tên tài khoản)!');
            return;
        }
        
        paymentInfo.customerMomoPhone = customerMomoPhone;
        paymentInfo.customerMomoName = customerMomoName;
        
        const momoProof = document.getElementById('momoProof').files[0];
        if (momoProof) {
            paymentInfo.momoProofName = momoProof.name;
        }
    } else if (paymentMethod === 'banking') {
        const customerBankName = document.getElementById('customerBankName').value.trim();
        const customerBankAccount = document.getElementById('customerBankAccount').value.trim();
        const customerBankAccountName = document.getElementById('customerBankAccountName').value.trim();
        
        if (!customerBankName || !customerBankAccount || !customerBankAccountName) {
            alert('Vui lòng nhập đầy đủ thông tin ngân hàng (Tên ngân hàng, Số tài khoản, Tên chủ tài khoản)!');
            return;
        }
        
        paymentInfo.customerBankName = customerBankName;
        paymentInfo.customerBankAccount = customerBankAccount;
        paymentInfo.customerBankAccountName = customerBankAccountName;
        
        const bankingProof = document.getElementById('bankingProof').files[0];
        if (bankingProof) {
            paymentInfo.bankingProofName = bankingProof.name;
        }
    }

    const cart = getCart();
    const subtotalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalValue = subtotalValue + SHIPPING_FEE;
    
    // 4. Tạo đối tượng đơn hàng
    const newOrder = {
        id: Date.now().toString(),
        customer: { fullname, phone, email, address, note },
        items: cart,
        subtotal: subtotalValue,
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