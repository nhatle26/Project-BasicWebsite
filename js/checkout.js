
        // ===== CHECKOUT FUNCTIONS =====

        // Lấy giỏ hàng từ localStorage
        function getCart() {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        }

        // Lưu đơn hàng
        function saveOrder(order) {
            let orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
        }

        // Render chi tiết đơn hàng
        function renderOrderDetails() {
            const cart = getCart();
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
                    <div class="order-item">
                        <div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-qty">Số lượng: ${item.quantity}</div>
                        </div>
                        <div class="item-price">${itemTotal.toLocaleString('vi-VN')}đ</div>
                    </div>
                `;
            });

            orderItemsDiv.innerHTML = itemsHTML;
            document.getElementById('subtotal').textContent = total.toLocaleString('vi-VN') + 'đ';
            document.getElementById('total').textContent = total.toLocaleString('vi-VN') + 'đ';
        }

        // Validate form
        function validateForm(data) {
            if (!data.fullName.trim()) {
                return 'Vui lòng nhập họ tên';
            }
            if (!data.email.trim()) {
                return 'Vui lòng nhập email';
            }
            if (!data.phone.trim()) {
                return 'Vui lòng nhập số điện thoại';
            }
            if (!/^\d{10,11}$/.test(data.phone.replace(/[- ]/g, ''))) {
                return 'Số điện thoại không hợp lệ';
            }
            if (!data.address.trim()) {
                return 'Vui lòng nhập địa chỉ';
            }
            if (!data.city.trim()) {
                return 'Vui lòng nhập thành phố/tỉnh';
            }
            return null;
        }

        // Xử lý submit form
        document.getElementById('checkoutForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const errorMessage = document.getElementById('errorMessage');
            errorMessage.style.display = 'none';

            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                district: document.getElementById('district').value,
                city: document.getElementById('city').value,
                note: document.getElementById('note').value,
                paymentMethod: document.querySelector('input[name="payment"]:checked').value,
                items: getCart(),
                orderDate: new Date().toLocaleString('vi-VN'),
                status: 'pending',
                total: parseInt(document.getElementById('total').textContent)
            };

            // Validate
            const error = validateForm(formData);
            if (error) {
                errorMessage.textContent = '❌ ' + error;
                errorMessage.style.display = 'block';
                return;
            }

            // Lưu đơn hàng
            saveOrder(formData);

            // Xóa giỏ hàng
            localStorage.removeItem('cart');

            // Hiển thị thông báo thành công
            alert('✅ Đặt hàng thành công!\n\nĐơn hàng của bạn đang được xử lý.\nChúng tôi sẽ liên hệ với bạn sớm nhất.');

            // Redirect về trang chủ
            window.location.href = 'index.html';
        });

        // Quay lại giỏ hàng
        function goBack() {
            window.location.href = 'cart.html';
        }

        // Load trang
        document.addEventListener('DOMContentLoaded', renderOrderDetails);