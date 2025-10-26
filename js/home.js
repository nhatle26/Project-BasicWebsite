// Trang chủ với fetch data từ db.json
const productListElement = document.getElementById('productList');
let allProducts = []; // Biến lưu trữ tất cả sản phẩm
let filteredProducts = []; // Sản phẩm sau khi lọc

// Kiểm tra user đã đăng nhập chưa
function isLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
}

// Yêu cầu đăng nhập
function requireLogin() {
    alert('Vui lòng đăng nhập để thực hiện chức năng này!');
    localStorage.setItem('returnUrl', window.location.href);
    window.location.href = 'login.html';
}

// Tải sản phẩm từ file db.json
async function loadProducts() {
    try {
        const response = await fetch('../data/db.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Không thể tải db.json`);
        }
        const data = await response.json();
        allProducts = data.products || [];
        filteredProducts = [...allProducts];
        console.log('✅ Load thành công:', allProducts.length, 'sản phẩm');
        
        // Log để kiểm tra event trong từng sản phẩm
        console.log('📊 Thống kê event:');
        const eventCount = {};
        allProducts.forEach(p => {
            if (p.event && Array.isArray(p.event)) {
                p.event.forEach(e => {
                    eventCount[e] = (eventCount[e] || 0) + 1;
                });
            }
        });
        console.table(eventCount);
        
    } catch (error) {
        console.error('❌ Lỗi load db.json:', error);
        filteredProducts = [...allProducts];
    }
    renderProducts(filteredProducts, 'all');
}

// Hiển thị danh sách sản phẩm
function renderProducts(productsToRender, theme) {
    const productListId = theme === 'all' ? 'productList' : `productList-${theme}`;
    const productListElement = document.getElementById(productListId);

    if (!productListElement) {
        console.error('❌ Không tìm thấy element:', productListId);
        return;
    }
    
    productListElement.innerHTML = '';

    if (productsToRender.length === 0) {
        productListElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px; color: #999;">Không tìm thấy sản phẩm nào</p>';
        return;
    }

    console.log(`🎨 Render ${productsToRender.length} sản phẩm cho theme: ${theme}`);

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
            <a href="#" onclick="viewProductDetail('${product.id}'); return false;" style="display: inline-block; margin-top: 10px; color: #2196F3; text-decoration: none;">
                <i class="fas fa-info-circle"></i> Chi tiết
            </a>
        `;
        productListElement.appendChild(productCard);
    });

    updateCartCountDisplay();
}

// Xem chi tiết sản phẩm
function viewProductDetail(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    if (!isLoggedIn()) {
        requireLogin();
        return;
    }
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        alert('Sản phẩm không tồn tại!');
        return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// Xem giỏ hàng
function viewCart() {
    if (!isLoggedIn()) {
        requireLogin();
        return;
    }
    window.location.href = 'cart.html';
}

// 🎯 HÀM CHỌN CHỦ ĐỀ - ĐÃ CẬP NHẬT
function selectTheme() {
    const themeTabs = document.querySelectorAll('.theme-tab');
    const themeSections = document.getElementsByClassName('theme-section');

    themeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Xóa active class khỏi tất cả tabs
            themeTabs.forEach(t => {
                t.classList.remove('active');
            });
            
            // Thêm active class vào tab được chọn
            tab.classList.add('active');

            // Ẩn tất cả sections
            for (let section of themeSections) {
                section.style.display = 'none';
            }

            // Hiển thị section tương ứng
            const theme = tab.getAttribute('data-theme');
            const selectedSection = document.getElementById(`theme-${theme}`);
            if (selectedSection) {
                selectedSection.style.display = 'block';
                filterProductsByTheme(theme);
            }
            
            console.log(`🎨 Đã chọn theme: ${theme}`);
        });
    });

    // Mặc định chọn tab "Tất cả"
    document.querySelector('.theme-tab[data-theme="all"]')?.click();
}

// 🔥 HÀM LỌC SẢN PHẨM THEO CHỦ ĐỀ
function filterProductsByTheme(theme) {
    // Reset filteredProducts từ allProducts
    filteredProducts = [...allProducts];
    
    if (theme !== 'all') {
        // Lọc sản phẩm có event khớp với theme
        filteredProducts = filteredProducts.filter(product => 
            product.event && Array.isArray(product.event) && product.event.includes(theme)
        );
        console.log(`🔍 Lọc theme "${theme}": ${filteredProducts.length} sản phẩm`);
    }
    
    renderProducts(filteredProducts, theme);
}

// Lọc sản phẩm theo danh mục và giá
function filterProducts(theme = 'all') {
    let categoryFilter = document.getElementById(`categoryFilter-${theme}`)?.value;
    let priceFilter = document.getElementById(`priceFilter-${theme}`)?.value;
    
    // Bắt đầu từ filteredProducts hiện tại (đã được lọc theo theme)
    let filtered = [...filteredProducts];

    if (categoryFilter) {
        filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    renderProducts(filtered, theme);
}

// Sắp xếp sản phẩm
function sortProducts(theme = 'all') {
    const sortFilter = document.getElementById(`sortFilter-${theme}`)?.value;
    
    let sorted = [...filteredProducts];
    
    switch(sortFilter) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }
    
    renderProducts(sorted, theme);
}

// Tìm kiếm sản phẩm
function search() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    if (!searchInput) return;

    const theme = document.querySelector('.theme-tab.active')?.getAttribute('data-theme') || 'all';
    let filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchInput) ||
        product.category.toLowerCase().includes(searchInput)
    );

    filteredProducts = filtered;
    renderProducts(filteredProducts, theme);
    console.log('🔍 Tìm kiếm:', searchInput, '→', filtered.length, 'kết quả');
}

// Tải sản phẩm khi trang được load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    updateCartCountDisplay();
    selectTheme();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                search();
            }
        });
    }
});

// Tạo navigation động
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navElement = document.getElementById('mainNav');
    
    if (currentUser) {
        let navHTML = `
            <a href="home.html"><i class="fas fa-home"></i> Trang chủ</a>
            <a href="#" onclick="viewCart(); return false;"><i class="fas fa-shopping-cart"></i> Giỏ hàng<span id="cartCount"></span></a>
        `;
        
        if (currentUser.role === 'admin') {
            navHTML += `
                <a href="admin.html" id="userDisplayName">
                    <i class="fas fa-user-shield"></i> Quản trị
                </a>
            `;
        } else {
            navHTML += `
                <a href="#" id="userDisplayName">
                    <i class="fas fa-user"></i> ${currentUser.fullname || currentUser.email}
                </a>
            `;
        }
        
        navHTML += `
            <a href="#" onclick="logout(); return false;" style="color: #f44336;">
                <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </a>
        `;
        
        navElement.innerHTML = navHTML;
    } else {
        navElement.innerHTML = `
            <a href="home.html"><i class="fas fa-home"></i> Trang chủ</a>
            <a href="login.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
            <a href="login.html" onclick="showRegisterFirst(); return false;"><i class="fas fa-user-plus"></i> Đăng ký</a>
        `;
    }
});

// Hỗ trợ functions
function showRegisterFirst() {
    localStorage.setItem('showRegister', 'true');
    window.location.href = 'login.html';
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountDisplay();
}

function updateCartCountDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems > 0 ? totalItems : '';
    }
}