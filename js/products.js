let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 8;

// Load Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Không thể tải sản phẩm!', 'error');
    }
}

// Display Products
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Không tìm thấy sản phẩm nào!</p>';
        return;
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <div class="product-actions">
                    <a href="product.html?id=${product.id}" class="btn btn-primary">
                        <i class="fas fa-eye"></i> Xem chi tiết
                    </a>
                    <button class="btn btn-success" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    displayPagination();
}

// Display Pagination
function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change Page
function changePage(page) {
    currentPage = page;
    displayProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter Products
function filterProducts() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const priceRange = document.getElementById('priceFilter')?.value || '';
    
    filteredProducts = allProducts.filter(product => {
        let match = true;
        
        // Filter by category
        if (category && product.category !== category) {
            match = false;
        }
        
        // Filter by price
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            if (product.price < min || product.price > max) {
                match = false;
            }
        }
        
        return match;
    });
    
    currentPage = 1;
    displayProducts();
}

// Sort Products
function sortProducts() {
    const sortValue = document.getElementById('sortFilter')?.value || 'default';
    
    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
            break;
        default:
            filteredProducts = [...allProducts];
    }
    
    currentPage = 1;
    displayProducts();
}

// Search Products
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput?.value.toLowerCase().trim() || '';
    
    if (!searchTerm) {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayProducts();
}

// Load Product Detail
async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'home.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();
        displayProductDetail(product);
        loadRelatedProducts(product.category, product.id);
    } catch (error) {
        console.error('Error:', error);
        showToast('Không thể tải sản phẩm!', 'error');
    }
}

// Display Product Detail
function displayProductDetail(product) {
    const container = document.getElementById('productDetail');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-detail-left">
            <img src="${product.image}" alt="${product.name}" class="product-detail-image"
                 onerror="this.src='https://via.placeholder.com/500?text=No+Image'">
        </div>
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p class="product-detail-price">${formatCurrency(product.price)}</p>
            <p class="product-detail-description">${product.description}</p>
            <p class="product-stock">
                <i class="fas fa-check-circle"></i> 
                Còn hàng: ${product.stock} sản phẩm
            </p>
            
            <div class="quantity-selector">
                <label>Số lượng:</label>
                <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="${product.stock}">
                <button class="quantity-btn" onclick="increaseQuantity()">+</button>
            </div>
            
            <button class="btn btn-success" onclick="addToCartFromDetail(${product.id})">
                <i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng
            </button>
        </div>
    `;
}

// Quantity Functions
function increaseQuantity() {
    const input = document.getElementById('quantity');
    const max = parseInt(input.max);
    if (parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to Cart from Detail Page
function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    addToCart(productId, quantity);
}

// Load Related Products
async function loadRelatedProducts(category, excludeId) {
    try {
        const response = await fetch(`${API_URL}/products?category=${category}`);
        const products = await response.json();
        const relatedProducts = products.filter(p => p.id !== excludeId).slice(0, 4);
        
        const container = document.getElementById('relatedProducts');
        if (!container) return;
        
        container.innerHTML = relatedProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formatCurrency(product.price)}</p>
                    <div class="product-actions">
                        <a href="product.html?id=${product.id}" class="btn btn-primary">
                            <i class="fas fa-eye"></i> Xem
                        </a>
                        <button class="btn btn-success" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Thêm
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize
if (document.getElementById('productsContainer')) {
    loadProducts();
}

if (document.getElementById('productDetail')) {
    loadProductDetail();
}

// Search on Enter key
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});