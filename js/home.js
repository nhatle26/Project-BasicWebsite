// home.js - Trang chủ với fetch data từ db.json (không cần JSON Server)

const productListElement = document.getElementById('productList');
let allProducts = []; // Biến lưu trữ tất cả sản phẩm
let filteredProducts = []; // Sản phẩm sau khi lọc

// Kiểm tra user đã đăng nhập chưa
function isLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
}

// Yêu cầu đăng nhập (chuyển hướng đến trang login)
function requireLogin() {
    alert('Vui lòng đăng nhập để thực hiện chức năng này!');
    // Lưu URL hiện tại để quay lại sau khi đăng nhập
    localStorage.setItem('returnUrl', window.location.href);
    window.location.href = 'home.html';
}

// Tải sản phẩm từ file db.json
async function loadProducts() {
    try {
        // Fetch trực tiếp file db.json
        const response = await fetch('../db.json');
        
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu sản phẩm');
        }
        
        const data = await response.json();
        allProducts = data.products || [];
        filteredProducts = [...allProducts];
        renderProducts(filteredProducts);
        
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        
        // Nếu không load được file, dùng dữ liệu hardcode
        console.warn('Không thể tải db.json, sử dụng dữ liệu mặc định...');
        loadDefaultProducts();
    }
}

// Dữ liệu sản phẩm mặc định (backup)
function loadDefaultProducts() {
    allProducts = [
        {
            id: "1",
            name: "Hoa Hồng Đỏ",
            price: 139999,
            category: "Hoa Hồng",
            description: "Bó hoa hồng đỏ tươi tắn, tượng trưng cho tình yêu nồng nàn",
            image: "assets/images/rose-red.jpg",
            stock: 50
        },
        {
            id: "2",
            name: "Hoa Hồng Trắng",
            price: 140000,
            category: "Hoa Hồng",
            description: "Bó hoa hồng trắng tinh khôi, thanh lịch và sang trọng",
            image: "assets/images/rose-white.jpg",
            stock: 45
        },
        {
            id: "3",
            name: "Hoa Tulip Vàng",
            price: 200000,
            category: "Hoa Tulip",
            description: "Bó tulip vàng rực rỡ, mang đến niềm vui và sự ấm áp",
            image: "assets/images/tulip-yellow.jpg",
            stock: 30
        },
        {
            id: "4",
            name: "Hoa Ly Trắng",
            price: 180000,
            category: "Hoa Ly",
            description: "Hoa ly trắng thanh khiết, thích hợp cho mọi dịp lễ",
            image: "assets/images/lily-white.jpg",
            stock: 35
        },
        {
            id: "5",
            name: "Hoa Cẩm Chướng",
            price: 120000,
            category: "Hoa Cẩm Chướng",
            description: "Bó cẩm chướng đa sắc, tươi vui và đầy màu sắc",
            image: "assets/images/carnation.jpg",
            stock: 60
        },
        {
            id: "6",
            name: "Hoa Lan Hồ Điệp",
            price: 350000,
            category: "Hoa Lan",
            description: "Chậu lan hồ điệp cao cấp, sang trọng và lâu tàn",
            image: "assets/images/orchid.jpg",
            stock: 20
        },
        {
            id: "7",
            name: "Hoa Hướng Dương",
            price: 160000,
            category: "Hoa Hướng Dương",
            description: "Bó hướng dương tươi sáng, mang đến năng lượng tích cực",
            image: "assets/images/sunflower.jpg",
            stock: 40
        },
        {
            id: "8",
            name: "Hoa Baby Mix",
            price: 90000,
            category: "Hoa Hồng",
            description: "Bó hoa baby nhỏ xinh, đáng yêu",
            image: "assets/images/baby.jpg",
            stock: 70
        }
    ];
    
    filteredProducts = [...allProducts];
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
            <a href="#" onclick="viewProductDetail('${product.id}'); return false;" style="display: inline-block; margin-top: 10px; color: #2196F3; text-decoration: none;">
                <i class="fas fa-info-circle"></i> Chi tiết
            </a>
        `;
        productListElement.appendChild(productCard);
    });

    updateCartCountDisplay();
}

// Xem chi tiết sản phẩm (yêu cầu đăng nhập)
function viewProductDetail(productId) {
    if (!isLoggedIn()) {
        requireLogin();
        return;
    }
    window.location.href = `product.html?id=${productId}`;
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

// Thêm sản phẩm vào giỏ hàng (yêu cầu đăng nhập)
function addToCart(productId) {
    // Kiểm tra đăng nhập
    if (!isLoggedIn()) {
        requireLogin();
        return;
    }

    const product = allProducts.find((p) => p.id == productId); // Dùng == vì có thể là string hoặc number
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
    const existingItem = cart.find((item) => item.id == productId);

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

// Xem giỏ hàng (yêu cầu đăng nhập)
function viewCart() {
    if (!isLoggedIn()) {
        requireLogin();
        return;
    }
    window.location.href = 'cart.html';
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
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
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

// Tạo navigation động dựa trên trạng thái đăng nhập
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navElement = document.getElementById('mainNav');
    
    if (currentUser) {
        // Đã đăng nhập - hiển thị đầy đủ menu
        let navHTML = `
            <a href="home.html"><i class="fas fa-home"></i> Trang chủ</a>
            <a href="#" onclick="viewCart(); return false;"><i class="fas fa-shopping-cart"></i> Giỏ hàng<span id="cartCount"></span></a>
            <a href="#" id="userDisplayName">
                <i class="fas fa-user"></i> ${currentUser.fullname || currentUser.username}
            </a>
            <a href="#" onclick="logout(); return false;" style="color: #f44336;">
                <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </a>
        `;
        
        // Thêm link Admin nếu user có role admin
        // if (currentUser.role === 'admin') {
        //             navHTML += `
        //     <a href="admin.html" id="userDisplayName">
        //         <i class="fas fa-user"></i> ${currentUser.fullname || currentUser.username}
        //     </a>
        //     <a href="#" onclick="logout(); return false;" style="color: #f44336;">
        //         <i class="fas fa-sign-out-alt"></i> Đăng xuất
        //     </a>
        // `;
        // }
        
        navElement.innerHTML = navHTML;
    } else {
        // Chưa đăng nhập - chỉ hiển thị nút đăng nhập/đăng ký
        navElement.innerHTML = `
            <a href="home.html"><i class="fas fa-home"></i> Trang chủ</a>
            <a href="login.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
            <a href="login.html" onclick="showRegisterFirst(); return false;"><i class="fas fa-user-plus"></i> Đăng ký</a>
        `;
    }
});

// Hàm đăng xuất
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.reload(); // Tải lại trang để cập nhật nav
    }
}
 // Chuyển đến trang đăng ký
function showRegisterFirst() {
    localStorage.setItem('showRegister', 'true');
    window.location.href = 'login.html';
}