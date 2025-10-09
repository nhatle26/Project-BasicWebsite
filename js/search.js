
          // Dữ liệu sản phẩm
          const allProducts = [
               { id: 1, name: 'Hoa hồng đỏ tươi', category: 'hoa', price: 150000, emoji: '🌹', stock: 25, description: 'Bó hoa hồng đỏ tươi' },
               { id: 2, name: 'Hoa hướng dương', category: 'hoa', price: 120000, emoji: '🌻', stock: 30, description: 'Hoa hướng dương tươi sáng' },
               { id: 3, name: 'Hoa tulip', category: 'hoa', price: 180000, emoji: '🌷', stock: 15, description: 'Hoa tulip quý phái' },
               { id: 4, name: 'Chậu gốm trắng', category: 'chau', price: 95000, emoji: '🪴', stock: 50, description: 'Chậu gốm trắng sáng' },
               { id: 5, name: 'Chậu gốm xanh', category: 'chau', price: 110000, emoji: '🪴', stock: 40, description: 'Chậu gốm xanh bắt mắt' },
               { id: 6, name: 'Chậu nhựa đỏ', category: 'chau', price: 65000, emoji: '🪴', stock: 60, description: 'Chậu nhựa đỏ rực rỡ' },
               { id: 7, name: 'Kéo cắt cành', category: 'phu-kien', price: 75000, emoji: '✂️', stock: 35, description: 'Kéo cắt cành chất lượng' },
               { id: 8, name: 'Phân bón hữu cơ', category: 'phu-kien', price: 85000, emoji: '🧴', stock: 45, description: 'Phân bón hữu cơ an toàn' },
               { id: 9, name: 'Dây buộc cây', category: 'phu-kien', price: 25000, emoji: '🎀', stock: 100, description: 'Dây buộc cây mềm mại' },
          ];

          let currentSearchTerm = '';
          let currentCategory = 'all';
          let currentPriceFilter = 'all';
          let filteredProducts = [...allProducts];

          // Lấy tham số URL
          function getSearchParamFromURL() {
               const params = new URLSearchParams(window.location.search);
               const search = params.get('q');
               if (search) {
                    document.getElementById('searchInput').value = search;
                    performSearch();
               } else {
                    renderProducts();
               }
          }

          // Tìm kiếm
          function performSearch() {
               currentSearchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
               applyFilters();
          }

          // Lọc theo danh mục
          function filterByCategory(element) {
               document.querySelectorAll('[data-category]').forEach(btn => btn.classList.remove('active'));
               element.classList.add('active');
               currentCategory = element.dataset.category;
               applyFilters();
          }

          // Lọc theo giá
          function filterByPrice(element) {
               document.querySelectorAll('[data-price]').forEach(btn => btn.classList.remove('active'));
               element.classList.add('active');
               currentPriceFilter = element.dataset.price;
               applyFilters();
          }

          // Kiểm tra sản phẩm trong khoảng giá
          function matchesPrice(price, priceFilter) {
               if (priceFilter === 'all') return true;
               if (priceFilter === '0-100000') return price < 100000;
               if (priceFilter === '100000-500000') return price >= 100000 && price <= 500000;
               if (priceFilter === '500000+') return price > 500000;
               return true;
          }

          // Áp dụng tất cả bộ lọc
          function applyFilters() {
               filteredProducts = allProducts.filter(product => {
                    // Lọc theo tìm kiếm
                    const matchesSearch = !currentSearchTerm ||
                         product.name.toLowerCase().includes(currentSearchTerm) ||
                         product.category.toLowerCase().includes(currentSearchTerm);

                    // Lọc theo danh mục
                    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;

                    // Lọc theo giá
                    const matchesPrice = matchesPrice(product.price, currentPriceFilter);

                    return matchesSearch && matchesCategory && matchesPrice;
               });

               renderProducts();
          }

          // Render sản phẩm
          function renderProducts() {
               const container = document.getElementById('productsContainer');
               const resultCount = document.getElementById('resultCount');

               resultCount.textContent = filteredProducts.length;

               if (filteredProducts.length === 0) {
                    container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); color: #999;">
                        <div style="font-size: 80px; margin-bottom: 20px;">🔍</div>
                        <p style="font-size: 16px; margin-bottom: 20px;">Không tìm thấy sản phẩm nào</p>
                        <p style="font-size: 14px; color: #999; margin-bottom: 20px;">Hãy thử tìm kiếm với từ khóa khác</p>
                        <a href="index.html" class="btn btn-primary" style="display: inline-block; text-decoration: none;">← Quay lại trang chủ</a>
                    </div>
                `;
                    return;
               }

               container.innerHTML = filteredProducts.map(product => `
                <div class="product-card">
                    <div class="product-image" onclick="viewProduct(${product.id})" style="cursor: pointer;">
                        ${product.emoji}
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div style="color: #999; font-size: 12px; margin-bottom: 8px;">${getCategoryLabel(product.category)}</div>
                        <div class="product-price">${product.price.toLocaleString('vi-VN')}đ</div>
                        <div class="product-buttons">
                            <button class="btn btn-secondary" onclick="viewProduct(${product.id})" style="width: 100%;">Xem</button>
                            <button class="btn btn-primary" onclick="addProductToCart(${product.id})" style="width: 100%;">Thêm</button>
                        </div>
                    </div>
                </div>
            `).join('');
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

          // Xem chi tiết sản phẩm
          function viewProduct(productId) {
               window.location.href = `product.html?id=${productId}`;
          }

          // Thêm vào giỏ hàng
          function addProductToCart(productId) {
               const product = allProducts.find(p => p.id === productId);
               if (product) {
                    cartUtils.addToCart(product, 1);
                    alert('✅ Thêm vào giỏ hàng thành công!');
               }
          }

          // Xử lý Enter trong search
          document.getElementById('searchInput').addEventListener('keypress', function (e) {
               if (e.key === 'Enter') {
                    performSearch();
               }
          });

          // Load trang
          document.addEventListener('DOMContentLoaded', getSearchParamFromURL);

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