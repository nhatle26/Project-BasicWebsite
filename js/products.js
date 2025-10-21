// Lấy ID sản phẩm từ URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetail = document.getElementById("productDetail");
const relatedContainer = document.getElementById("relatedProducts");

// --- 1️⃣ Lấy chi tiết sản phẩm từ LocalStorage ---
function loadProductDetail() {
    try {
        // Đọc từ localStorage thay vì fetch API
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);

        if (!product) {
            throw new Error("Không tìm thấy sản phẩm");
        }

        renderProductDetail(product);
        loadRelatedProducts(product.category, product.id);
    } catch (err) {
        productDetail.innerHTML = `<p class="error">❌ ${err.message}</p>`;
    }
}

// --- 2️⃣ Hiển thị chi tiết sản phẩm ---
function renderProductDetail(p) {
    productDetail.innerHTML = `
        <div class="detail-container">
            <div class="left-box">
                <img src="${p.image}" alt="${p.name}" class="main-image" 
                     onerror="this.src='https://via.placeholder.com/400?text=No+Image'"/>
            </div>
            <div class="right-box">
                <h2>${p.name}</h2>
                <p class="price">${formatCurrency(p.price)}</p>
                <p class="desc">${p.description}</p>
                <p style="color: ${p.stock > 0 ? '#4CAF50' : '#f44336'}; font-weight: bold;">
                    ${p.stock > 0 ? `Còn ${p.stock} sản phẩm` : 'Hết hàng'}
                </p>

                <div class="action-buttons">
                    <button class="add-cart-btn" ${p.stock <= 0 ? 'disabled' : ''}>
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    `;

    const addCartBtn = productDetail.querySelector(".add-cart-btn");
    if (addCartBtn && p.stock > 0) {
        addCartBtn.addEventListener("click", () => addToCart(p));
    }
}

// --- 3️⃣ Định dạng tiền tệ ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

// --- 4️⃣ Thêm sản phẩm vào giỏ hàng ---
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        if (existing.quantity < product.stock) {
            existing.quantity++;
            alert(`Đã thêm 1 x ${product.name} vào giỏ hàng!`);
        } else {
            alert(`Không thể thêm nữa, số lượng tối đa là ${product.stock}`);
            return;
        }
    } else {
        cart.push({ 
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            quantity: 1 
        });
        alert("🛒 Đã thêm vào giỏ hàng!");
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
}

// --- 5️⃣ Sản phẩm liên quan ---
function loadRelatedProducts(category, currentId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const relatedProducts = products.filter(p => p.category === category && p.id !== currentId);

    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p style="text-align: center; color: #999;">Không có sản phẩm liên quan</p>';
        return;
    }

    relatedContainer.innerHTML = relatedProducts
        .slice(0, 4) // Chỉ lấy 4 sản phẩm
        .map(p => `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}" 
                     onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                <h4>${p.name}</h4>
                <p>${formatCurrency(p.price)}</p>
                <a href="product.html?id=${p.id}" class="btn-view">Xem chi tiết</a>
            </div>
        `)
        .join("");
}

// --- Gọi hàm chính ---
if (productId) {
    loadProductDetail();
} else {
    productDetail.innerHTML = `<p style="text-align: center; padding: 40px;">⚠️ Không tìm thấy sản phẩm.</p>`;
}