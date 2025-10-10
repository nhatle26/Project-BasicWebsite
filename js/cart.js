
          // Render chi tiết đơn hàng
          function renderOrderDetails() {
               const cart = cartUtils.getCart();
               const orderItemsDiv = document.getElementById('orderItems');

               if (cart.length === 0) {
                    window.location.href = 'cart.html';
                    return;
               }

               let total = 0;
               let itemsHTML = '';

               cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    itemsHTML += `
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                        <div>
                            <div style="font-weight: 500; color: #333;">${item.name}</div>
                            <div style="color: #666; font-size: 12px;">Số lượng: ${item.quantity}</div>
                        </div>
                        <div style="color: #d4284c; font-weight: bold;">${itemTotal.toLocaleString('vi-VN')}đ</div>
                    </div>
                `;
               });

               orderItemsDiv.innerHTML = itemsHTML;
               document.getElementById('subtotal').textContent = total.toLocaleString('vi-VN') + 'đ';
               document.getElementById('total').textContent = total.toLocaleString('vi-VN') + 'đ';
          }

          // Validate form
          function validateForm() {
               const fullName = document.getElementById('fullName').value.trim();
               const email = document.getElementById('email').value.trim();
               const phone = document.getElementById('phone').value.trim();
               const address = document.getElementById('address').value.trim();
               const city = document.getElementById('city').value.trim();
               const errorMessage = document.getElementById('errorMessage');

               if (!fullName) {
                    errorMessage.textContent = '❌ Vui lòng nhập họ tên';
                    errorMessage.style.display = 'block';
                    return false;
               }

               if (!email || !email.includes('@')) {
                    errorMessage.textContent = '❌ Vui lòng nhập email hợp lệ';
                    errorMessage.style.display = 'block';
                    return false;
               }

               if (!phone || phone.length < 10) {
                    errorMessage.textContent = '❌ Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)';
                    errorMessage.style.display = 'block';
                    return false;
               }

               if (!address) {
                    errorMessage.textContent = '❌ Vui lòng nhập địa chỉ';
                    errorMessage.style.display = 'block';
                    return false;
               }

               if (!city) {
                    errorMessage.textContent = '❌ Vui lòng nhập thành phố/tỉnh';
                    errorMessage.style.display = 'block';
                    return false;
               }

               return true;
          }

          // Xử lý submit form
          function handleSubmit(event) {
               event.preventDefault();
               document.getElementById('errorMessage').style.display = 'none';

               if (!validateForm()) return;

               const order = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    district: document.getElementById('district').value,
                    city: document.getElementById('city').value,
                    note: document.getElementById('note').value,
                    paymentMethod: document.querySelector('input[name="payment"]:checked').value,
                    items: cartUtils.getCart(),
                    orderDate: new Date().toLocaleString('vi-VN'),
                    status: 'pending',
                    total: cartUtils.getCartTotal()
               };

               // Lưu đơn hàng
               let orders = JSON.parse(localStorage.getItem('orders') || '[]');
               orders.push(order);
               localStorage.setItem('orders', JSON.stringify(orders));

               // Xóa giỏ hàng
               cartUtils.clearCart();

               // Thông báo thành công
               alert('✅ Đặt hàng thành công!\n\nĐơn hàng của bạn đang được xử lý.\nChúng tôi sẽ liên hệ với bạn sớm nhất.');

               // Redirect về trang chủ
               window.location.href = 'index.html';
          }

          // Quay lại giỏ hàng
          function goBack() {
               window.location.href = 'cart.html';
          }

          // Load trang
document.addEventListener('DOMContentLoaded', function() {
    renderAllProducts();
    updateCartBadge();  // ✅ Hiển thị số giỏ hàng khi load
});


          // Cập nhật badge
          window.addEventListener('cartUpdated', function () {
               const badge = document.getElementById('cartBadge');
               const count = cartUtils.getCartCount();
               if (count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'inline-block';
               } else {
                    badge.style.display = 'none';
               }
          });
            // Render giỏ hàng
    function renderCart() {
        const cart = cartUtils.getCart();  // ← Lấy từ localStorage
        // Hiển thị sản phẩm...
}
    
window.cartUtils = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
    },
    addToCart(product, quantity = 1) {
        let cart = this.getCart();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        this.saveCart(cart);
    },
    getCartCount() {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    },
    clearCart() {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
    },
    getCartTotal() {
        return this.getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
};

// Cập nhật số hiển thị giỏ hàng
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;

    const count = window.cartUtils.getCartCount();
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function renderCart() {
    const cart = window.cartUtils.getCart();
    const container = document.getElementById('cartContent');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #666;">
                <div style="font-size: 70px;">🛒</div>
                <p>Giỏ hàng của bạn đang trống</p>
                <a href="home.html" class="btn btn-primary" style="text-decoration: none;">🛍 Tiếp tục mua sắm</a>
            </div>
        `;
        return;
    }

    let total = 0;

    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="padding: 10px;">Sản phẩm</th>
                    <th style="padding: 10px;">Giá</th>
                    <th style="padding: 10px;">Số lượng</th>
                    <th style="padding: 10px;">Thành tiền</th>
                    <th style="padding: 10px;">Xóa</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    return `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px;">${item.emoji} ${item.name}</td>
                            <td style="padding: 10px;">${item.price.toLocaleString('vi-VN')}đ</td>
                            <td style="padding: 10px;">
                                <button onclick="updateQuantity(${index}, -1)">-</button>
                                <span style="margin: 0 10px;">${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)">+</button>
                            </td>
                            <td style="padding: 10px;">${itemTotal.toLocaleString('vi-VN')}đ</td>
                            <td style="padding: 10px;">
                                <button onclick="removeItem(${index})">❌</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
            <h3>Tổng cộng: ${total.toLocaleString('vi-VN')}đ</h3>
            <a href="checkout.html" class="btn btn-primary" style="text-decoration: none;">💳 Thanh toán</a>
        </div>
    `;
}
function updateQuantity(index, change) {
    const cart = window.cartUtils.getCart();
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    window.cartUtils.saveCart(cart);
    renderCart();
    updateCartBadge();
}

function removeItem(index) {
    const cart = window.cartUtils.getCart();
    cart.splice(index, 1);
    window.cartUtils.saveCart(cart);
    renderCart();
    updateCartBadge();
}

// Lắng nghe sự kiện cập nhật giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    updateCartBadge();
});