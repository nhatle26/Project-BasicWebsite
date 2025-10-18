// home.js - Trang chủ với đầy đủ tính năng

const productListElement = document.getElementById('productList');
let allProducts = []; // Biến lưu trữ tất cả sản phẩm
let filteredProducts = []; // Sản phẩm sau khi lọc

// Tải sản phẩm từ LocalStorage
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
        allProducts = JSON.parse(storedProducts);
        filteredProducts = [...allProducts];
    } else {
        allProducts = [];
        filteredProducts = [];
    }
    
    renderProducts(filteredProducts);
}

// Hiển thị danh sách sản phẩm lên giao diện
function renderProducts(productsToRender) {
    if (!productListElement) return;
    
    productListElement.innerHTML = ''; // Xóa nội dung cũ

    if (productsToRender.length === 0) {
        productListElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px; color: #999;">Không tìm thấy sản phẩm nào</p>';
        return;
    }

    productsToRender.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            <h3>${product.name}</h3>
            <p class="price">${formatCurrency(product.price)}</p>
            <p style="color: ${product.stock > 0 ? '#4CAF50' : '#f44336'};">
                ${product.stock > 0 ? `Kho: ${product.stock}` : 'Hết hàng'}
            </p>
            <button onclick="addToCart('${product.id}')" ${product.stock <= 0 ? 'disabled' : ''} 
                    style="${product.stock <= 0 ? 'background: #ccc; cursor: not-allowed;' : ''}">
                <i class="fas fa-cart-plus"></i> Thêm vào giỏ
            </button>
            <a href="product.html?id=${product.id}" style="display: inline-block; margin-top: 10px; color: #2196F3; text-decoration: none;">
                <i class="fas fa-info-circle"></i> Chi tiết
            </a>
        `;
        productListElement.appendChild(productCard);
    });

    updateCartCountDisplay();
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

// ============= CHỨC NĂNG GIỎ HÀNG =============

// Lấy giỏ hàng từ LocalStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Lưu giỏ hàng vào LocalStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountDisplay();
}

// Cập nhật số lượng sản phẩm trên icon giỏ hàng
function updateCartCountDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');

    if (cartCountElement) {
        cartCountElement.textContent = totalItems > 0 ? ` (${totalItems})` : '';
    }
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    const product = allProducts.find((p) => p.id === productId);
    let cart = getCart();

    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        return;
    }

    if (product.stock <= 0) {
        alert('Sản phẩm đã hết hàng!');
        return;
    }

    // Tìm xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        // Nếu có, tăng số lượng lên 1, nhưng không vượt quá số lượng trong kho
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
            alert(`Đã thêm 1 x ${product.name} vào giỏ hàng.`);
        } else {
            alert(`Không thể thêm nữa, số lượng tối đa là ${product.stock} sản phẩm.`);
        }
    } else {
        // Nếu chưa có, thêm mới với số lượng là 1
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            quantity: 1,
        });
        alert(`Đã thêm ${product.name} vào giỏ hàng.`);
    }

    saveCart(cart);
}

// ============= CHỨC NĂNG TÌM KIẾM =============

function search() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    if (allProducts.length === 0) {
        alert('Chưa có sản phẩm để tìm kiếm!');
        return;
    }

    // Reset bộ lọc
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('sortFilter').value = '';

    // Lọc sản phẩm
    filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    renderProducts(filteredProducts);

    // Cập nhật tiêu đề
    const mainTitle = document.querySelector('main h3');
    if (mainTitle) {
        if (searchTerm === "") {
            mainTitle.textContent = "Danh Sách Sản Phẩm";
        } else {
            mainTitle.textContent = `Kết Quả Tìm Kiếm cho: "${searchTerm}" (${filteredProducts.length} sản phẩm)`;
        }
    }
}

// ============= CHỨC NĂNG LỌC SẢN PHẨM =============

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    // Bắt đầu từ tất cả sản phẩm
    filteredProducts = [...allProducts];
    
    // Lọc theo danh mục
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    // Lọc theo giá
    if (priceFilter) {
        const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }
    
    // Áp dụng lại sắp xếp nếu có
    const sortFilter = document.getElementById('sortFilter').value;
    if (sortFilter) {
        applySorting(sortFilter);
    } else {
        renderProducts(filteredProducts);
    }
    
    // Cập nhật tiêu đề
    updateProductTitle();
}

// ============= CHỨC NĂNG SẮP XẾP SẢN PHẨM =============

function sortProducts() {
    const sortFilter = document.getElementById('sortFilter').value;
    applySorting(sortFilter);
}

function applySorting(sortType) {
    switch(sortType) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // Không sắp xếp, giữ nguyên thứ tự
            break;
    }
    
    renderProducts(filteredProducts);
    updateProductTitle();
}

function updateProductTitle() {
    const mainTitle = document.querySelector('main h3');
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    if (mainTitle) {
        let title = "Danh Sách Sản Phẩm";
        
        if (categoryFilter || priceFilter || sortFilter) {
            title = `Sản phẩm đã lọc (${filteredProducts.length} sản phẩm)`;
        }
        
        mainTitle.textContent = title;
    }
}

// ============= KHỞI TẠO =============

// Tải sản phẩm khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCountDisplay();
    
    // Thêm sự kiện Enter cho ô tìm kiếm
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                search();
            }
        });
    }
});