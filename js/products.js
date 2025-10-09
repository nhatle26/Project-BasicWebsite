// js/products.js - Lấy dữ liệu sản phẩm và hiển thị

// ===== DỮ LIỆU SẢN PHẨM =====
// Trong thực tế, bạn sẽ lấy từ API: fetch('http://localhost:3000/products')

const allProducts = [
    { 
        id: 1, 
        name: 'Hoa hồng đỏ tươi', 
        category: 'hoa', 
        price: 150000, 
        emoji: '🌹', 
        stock: 25, 
        description: 'Bó hoa hồng đỏ tươi, tuyệt đẹp và lãng mạn. Phù hợp tặng người thân, bạn bè hoặc người yêu.' 
    },
    { 
        id: 2, 
        name: 'Hoa hướng dương', 
        category: 'hoa', 
        price: 120000, 
        emoji: '🌻', 
        stock: 30, 
        description: 'Hoa hướng dương tươi sáng, mang lại niềm vui và tích cực.' 
    },
    { 
        id: 3, 
        name: 'Hoa tulip', 
        category: 'hoa', 
        price: 180000, 
        emoji: '🌷', 
        stock: 15, 
        description: 'Hoa tulip quý phái với nhiều màu sắc. Biểu tượng của tình yêu.' 
    },
    { 
        id: 4, 
        name: 'Chậu gốm trắng', 
        category: 'chau', 
        price: 95000, 
        emoji: '🪴', 
        stock: 50, 
        description: 'Chậu gốm trắng sáng tinh tế, thích hợp cho tất cả các loại cây.' 
    },
    { 
        id: 5, 
        name: 'Chậu gốm xanh', 
        category: 'chau', 
        price: 110000, 
        emoji: '🪴', 
        stock: 40, 
        description: 'Chậu gốm xanh bắt mắt, phong cách hiện đại.' 
    },
    { 
        id: 6, 
        name: 'Chậu nhựa đỏ', 
        category: 'chau', 
        price: 65000, 
        emoji: '🪴', 
        stock: 60, 
        description: 'Chậu nhựa đỏ rực rỡ, giá rẻ và bền. Nhẹ và dễ vận chuyển.' 
    },
    { 
        id: 7, 
        name: 'Kéo cắt cành', 
        category: 'phu-kien', 
        price: 75000, 
        emoji: '✂️', 
        stock: 35, 
        description: 'Kéo cắt cành chất lượng cao, lưỡi sắc bén.' 
    },
    { 
        id: 8, 
        name: 'Phân bón hữu cơ', 
        category: 'phu-kien', 
        price: 85000, 
        emoji: '🧴', 
        stock: 45, 
        description: 'Phân bón hữu cơ an toàn, giúp cây phát triển nhanh.' 
    },
    { 
        id: 9, 
        name: 'Dây buộc cây', 
        category: 'phu-kien', 
        price: 25000, 
        emoji: '🎀', 
        stock: 100, 
        description: 'Dây buộc cây mềm mại, không làm tổn thương cây.' 
    },
];

// ===== LẤY TẤT CẢ SẢN PHẨM =====
function getAllProducts() {
    return allProducts;
}

// ===== LẤY SẢN PHẨM THEO ID =====
function getProductById(id) {
    return allProducts.find(p => p.id === parseInt(id));
}

// ===== LƯU SẢN PHẨM VÀO LOCALSTORAGE =====
// Dùng để admin quản lý sản phẩm
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(allProducts));
}

// ===== TẢI SẢN PHẨM TỪ LOCALSTORAGE =====
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        allProducts.length = 0; // Xóa mảng cũ
        allProducts.push(...JSON.parse(storedProducts)); // Thêm dữ liệu mới
    }
}

// ===== RENDER TẤT CẢ SẢN PHẨM LÊN TRANG CHỦ =====
function renderAllProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    loadProductsFromStorage(); // Load từ localStorage nếu có

    if (allProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #999;">
                <div style="font-size: 80px; margin-bottom: 20px;">📦</div>
                <p>Chưa có sản phẩm nào</p>
            </div>
        `;
        return;
    }

    container.innerHTML = allProducts.map(product => `
        <div class="product-card">
            <div class="product-image" onclick="viewProduct(${product.id})">
                ${product.emoji}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toLocaleString('vi-VN')}đ</div>
                <div class="product-buttons">
                    <button class="btn btn-secondary" onclick="viewProduct(${product.id})">Xem</button>
                    <button class="btn btn-primary" onclick="quickAddToCart(${product.id})">Thêm</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== XEM CHI TIẾT SẢN PHẨM =====
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// ===== THÊM NHANH VÀO GIỎ HÀNG =====
function quickAddToCart(productId) {
    const product = getProductById(productId);
    if (product && window.cartUtils) {
        window.cartUtils.addToCart(product, 1);
        alert('✅ Đã thêm vào giỏ hàng!');
    }
}

// ===== EXPORT ĐỂ DÙNG Ở CÁC FILE KHÁC =====
window.productsUtils = {
    getAllProducts,
    getProductById,
    saveProductsToStorage,
    loadProductsFromStorage,
    renderAllProducts
};