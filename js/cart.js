
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

          // Tìm kiếm
          function searchProducts() {
               const query = document.getElementById('searchInput').value;
               if (query.trim()) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
               }
          }

          // Load trang
          document.addEventListener('DOMContentLoaded', renderOrderDetails);

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