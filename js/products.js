const apiURL = "http://localhost:3000/products";

// Lấy ID sản phẩm từ URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetail = document.getElementById("productDetail");
const relatedContainer = document.getElementById("relatedProducts");

// --- 1️⃣ Lấy chi tiết sản phẩm ---
async function loadProductDetail() {
    try {
        const res = await fetch(`${apiURL}/${productId}`);
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        const product = await res.json();

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
                <img src="${p.image}" alt="${p.name}" class="main-image"/>
            </div>
            <div class="right-box">
                <h2>${p.name}</h2>
                <p class="price">${p.price.toLocaleString()}₫</p>
                <p class="desc">${p.description}</p>

                <div class="action-buttons">
                    <button class="add-cart-btn">
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    `;

    const addCartBtn = productDetail.querySelector(".add-cart-btn");
    addCartBtn.addEventListener("click", () => addToCart(p));
}

// --- 3️⃣ Thêm sản phẩm vào giỏ hàng ---
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("🛒 Đã thêm vào giỏ hàng!");
}

// --- 4️⃣ Sản phẩm liên quan ---
async function loadRelatedProducts(category, currentId) {
    const res = await fetch(`${apiURL}?category=${encodeURIComponent(category)}`);
    const products = await res.json();

    relatedContainer.innerHTML = products
        .filter(p => p.id != currentId)
        .map(p => `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>${p.price.toLocaleString()}₫</p>
                <a href="product.html?id=${p.id}" class="btn-view">Xem chi tiết</a>
            </div>
        `)
        .join("");
}

// --- Gọi hàm chính ---
if (productId) loadProductDetail();
else productDetail.innerHTML = `<p>⚠️ Không tìm thấy sản phẩm.</p>`;
