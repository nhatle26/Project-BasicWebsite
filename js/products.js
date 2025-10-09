
          // Dữ liệu sản phẩm
          const allProducts = [
               { id: 1, name: 'Hoa hồng đỏ tươi', category: 'hoa', price: 150000, emoji: '🌹', stock: 25, description: 'Bó hoa hồng đỏ tươi, tuyệt đẹp và lãng mạn. Phù hợp tặng người thân, bạn bè hoặc người yêu. Bảo quản trong nước mát và thay nước hàng ngày để hoa tươi lâu.' },
               { id: 2, name: 'Hoa hướng dương', category: 'hoa', price: 120000, emoji: '🌻', stock: 30, description: 'Hoa hướng dương tươi sáng, mang lại niềm vui và tích cực. Dễ chăm sóc, có thể sống 10-14 ngày. Đặt nơi có ánh sáng để hoa luôn hướng lên mặt trời.' },
               { id: 3, name: 'Hoa tulip', category: 'hoa', price: 180000, emoji: '🌷', stock: 15, description: 'Hoa tulip quý phái với nhiều màu sắc. Biểu tượng của tình yêu và sự hoàn hảo. Thích hợp cho các dịp đặc biệt.' },
               { id: 4, name: 'Chậu gốm trắng', category: 'chau', price: 95000, emoji: '🪴', stock: 50, description: 'Chậu gốm trắng sáng tinh tế, thích hợp cho tất cả các loại cây. Kích thước vừa phải, dễ di chuyển.' },
               { id: 5, name: 'Chậu gốm xanh', category: 'chau', price: 110000, emoji: '🪴', stock: 40, description: 'Chậu gốm xanh bắt mắt, phong cách hiện đại. Chất lượng tốt, bền bỉ theo thời gian.' },
               { id: 6, name: 'Chậu nhựa đỏ', category: 'chau', price: 65000, emoji: '🪴', stock: 60, description: 'Chậu nhựa đỏ rực rỡ, giá rẻ và bền. Nhẹ và dễ vận chuyển.' },
               { id: 7, name: 'Kéo cắt cành', category: 'phu-kien', price: 75000, emoji: '✂️', stock: 35, description: 'Kéo cắt cành chất lượng cao, lưỡi sắc bén. Tay cầm ergonomic, nhẹ nhàng.' },
               { id: 8, name: 'Phân bón hữu cơ', category: 'phu-kien', price: 85000, emoji: '🧴', stock: 45, description: 'Phân bón hữu cơ an toàn, giúp cây phát triển nhanh và khỏe mạnh.' },
               { id: 9, name: 'Dây buộc cây', category: 'phu-kien', price: 25000, emoji: '🎀', stock: 100, description: 'Dây buộc cây mềm mại, không làm tổn thương cây. Bền vững.' },
          ];

          let currentProduct = null;

          // Lấy ID từ URL
          function getProductId() {
               const params = new URLSearchParams(window.location.search);
               return parseInt(params.get('id')) || 1;
          }

          // Load sản phẩm
          function loadProduct() {
               const productId = getProductId();
               currentProduct = allProducts.find(p => p.id === productId);

               if (!currentProduct) {
                    document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h2>Sản phẩm không tồn tại</h2><a href="index.html">← Quay lại trang chủ</a></div>';
                    return;
               }

               // Cập nhật thông tin
               document.getElementById('productName').textContent = currentProduct.name;
               document.getElementById('productPrice').textContent = currentProduct.price.toLocaleString('vi-VN') + 'đ';
               document.getElementById('productImage').textContent = currentProduct.emoji;
               document.getElementById('productCategory').textContent = getCategoryLabel(currentProduct.category);
               document.getElementById('productDescription').textContent = currentProduct.description;
               document.getElementById('productAvailable').textContent = currentProduct.stock + ' sản phẩm';
               document.getElementById('breadcrumbName').textContent = currentProduct.name;

               updateStockStatus();
          }

          // Lấy tên danh mục
          function getCategoryLabel(category) {
               const labels = {
                    'hoa': '🌹 Hoa',
                    'chau': '🪴 Chậu cây',
                    'phu-kien': '✂️ Phụ kiện'
               };
               return labels[category] || category;
          }

          // Cập nhật trạng thái kho
          function updateStockStatus() {
               const stockDiv = document.getElementById('productStock');
               if (currentProduct.stock > 10) {
                    stockDiv.innerHTML = '<span class="stock-status in-stock">✅ Còn hàng</span>';
               } else if (currentProduct.stock > 0) {
                    stockDiv.innerHTML = '<span class="stock-status" style="background: #fff3cd; color: #856404;">⚠️ Sắp hết hàng</span>';
               } else {
                    stockDiv.innerHTML = '<span class="stock-status" style="background: #f8d7da; color: #721c24;">❌ Hết hàng</span>';
               }
          }

          // Giảm số lượng
          function decreaseQuantity() {
               const input = document.getElementById('quantity');
               if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
               }
          }

          // Tăng số lượng
          function increaseQuantity() {
               const input = document.getElementById('quantity');
               if (parseInt(input.value) < currentProduct.stock) {
                    input.value = parseInt(input.value) + 1;
               }
          }

          // Thêm vào giỏ hàng
          function addToCart() {
               if (currentProduct.stock === 0) {
                    alert('❌ Sản phẩm này hiện hết hàng');
                    return;
               }

               const quantity = parseInt(document.getElementById('quantity').value);
               cartUtils.addToCart(currentProduct, quantity);

               // Hiển thị thông báo
               const message = document.getElementById('successMessage');
               message.classList.add('show');
               setTimeout(() => {
                    message.classList.remove('show');
               }, 3000);

               document.getElementById('quantity').value = 1;
          }

          // Mua ngay
          function buyNow() {
               addToCart();
               setTimeout(() => {
                    window.location.href = 'cart.html';
               }, 1000);
          }

          // Tìm kiếm
          function searchProducts() {
               const query = document.getElementById('searchInput').value;
               if (query.trim()) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
               }
          }

          // Load trang
          document.addEventListener('DOMContentLoaded', loadProduct);

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