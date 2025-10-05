
        // ===== INIT PAGE =====
        document.addEventListener('DOMContentLoaded', async function() {
            updateUserInterface();
            await loadProducts();
        });

        // ===== UPDATE UI DỰA TRÊN TRẠNG THÁI ĐĂNG NHẬP =====
        function updateUserInterface() {
            const currentUser = window.auth.getCurrentUser();
            const guestSection = document.getElementById('guestSection');
            const userSection = document.getElementById('userSection');
            const actionNotice = document.getElementById('actionNotice');

            if (currentUser) {
                // Đã đăng nhập
                guestSection.style.display = 'none';
                userSection.style.display = 'flex';
                actionNotice.style.display = 'none';

                // Hiển thị thông tin user
                document.getElementById('userName').textContent = currentUser.name;
                document.getElementById('userEmail').textContent = currentUser.email;
                document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
            } else {
                // Chưa đăng nhập
                guestSection.style.display = 'block';
                userSection.style.display = 'none';
                actionNotice.style.display = 'block';
            }
        }

        // ===== LOAD PRODUCTS =====
        async function loadProducts() {
            const productsGrid = document.getElementById('productsGrid');
            
            try {
                const products = await ProductsAPI.getAll();
                
                productsGrid.innerHTML = products.map(product => `
                    <div class="product-card">
                        <div class="product-image">
                            ${getProductEmoji(product.category)}
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">${formatPrice(product.price)}</div>
                            <div class="product-actions">
                                <button class="btn-add-cart" onclick="handleAddToCart(${product.id})">
                                    🛒 Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Load products error:', error);
                productsGrid.innerHTML = '<p style="text-align: center; color: #666;">Không thể tải sản phẩm. Vui lòng kiểm tra API Server.</p>';
            }
        }

        // ===== HELPER FUNCTIONS =====
        function formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
        }

        function getProductEmoji(category) {
            const emojis = {
                'Laptop': '💻',
                'Điện thoại': '📱',
                'Âm thanh': '🎧',
                'Máy tính bảng': '📱'
            };
            return emojis[category] || '🛍️';
        }

        // ===== PROTECTED ACTIONS =====
        async function handleAddToCart(productId) {
            if (!window.auth.isLoggedIn()) {
                alert('⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
                window.location.href = 'login.html';
                return;
            }

            try {
                const currentUser = window.auth.getCurrentUser();
                const product = await ProductsAPI.getById(productId);

                // Kiểm tra sản phẩm đã có trong giỏ chưa
                const cartItems = await CartAPI.getAll();
                const existingItem = cartItems.find(item => 
                    item.productId === productId && item.userId === currentUser.id
                );

                if (existingItem) {
                    // Tăng số lượng
                    await CartAPI.updateQuantity(existingItem.id, existingItem.quantity + 1);
                    alert(`✅ Đã tăng số lượng "${product.name}" trong giỏ hàng!`);
                } else {
                    // Thêm mới
                    await CartAPI.add({
                        userId: currentUser.id,
                        productId: productId,
                        productName: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.image
                    });
                    alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
                }
            } catch (error) {
                console.error('Add to cart error:', error);
                alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
            }
        }

        function handleCreateShop() {
            if (!window.auth.isLoggedIn()) {
                alert('⚠️ Vui lòng đăng nhập để tạo shop!');
                window.location.href = 'login.html';
                return;
            }

            alert('✅ Chức năng tạo shop! (Chuyển sang admin.html)');
            // window.location.href = 'admin.html';
        }

        function handleViewOrders() {
            if (!window.auth.isLoggedIn()) {
                alert('⚠️ Vui lòng đăng nhập để xem đơn hàng!');
                window.location.href = 'login.html';
                return;
            }

            alert('✅ Chức năng xem đơn hàng!');
            // window.location.href = 'orders.html';
        }

        function handleViewCart() {
            if (!window.auth.isLoggedIn()) {
                alert('⚠️ Vui lòng đăng nhập để xem giỏ hàng!');
                window.location.href = 'login.html';
                return;
            }

            alert('✅ Chức năng xem giỏ hàng!');
            // window.location.href = 'cart.html';
        }

        function handleLogout() {
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                window.auth.logout();
            }
        }