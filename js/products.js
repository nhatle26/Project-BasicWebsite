// Lấy ID sản phẩm từ URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetail = document.getElementById("productDetail");
const relatedContainer = document.getElementById("relatedProducts");

// ---  Lấy chi tiết sản phẩm từ db.json ---
async function loadProductDetail() {
    try {
        // Fetch từ db.json thay vì localStorage
        const response = await fetch('/data/db.json');
        const data = await response.json();
        const products = data.products || [];
        
        const product = products.find(p => p.id === productId);

        if (!product) {
            throw new Error("Không tìm thấy sản phẩm");
        }

        renderProductDetail(product);
        loadRelatedProducts(product.category, product.id);
    } catch (err) {
        productDetail.innerHTML = `<p class="error"> ${err.message}</p>`;
    }
}

// --- Hiển thị chi tiết sản phẩm ---
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
                    <button onclick="addToCart('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''} 
                            style="${p.stock <= 0 ? 'background: #ccc; cursor: not-allowed;' : ''}">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng
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

// ---  Định dạng tiền tệ ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

// --- Thêm sản phẩm vào giỏ hàng ---
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
        alert("Đã thêm vào giỏ hàng!");
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Sản phẩm liên quan ---
async function loadRelatedProducts(category, currentId) {
  const relatedContainer = document.getElementById('relatedContainer');
  if (!relatedContainer) return;

  try {
// Gọi db.json thay vì JSON Server
    const res = await fetch('/data/db.json');
    const data = await res.json();
    const products = data.products || [];

    // Lọc sản phẩm cùng category, khác ID hiện tại
    const relatedProducts = products.filter(
      p => p.category === category && p.id !== currentId
    );

    // Nếu không có sản phẩm liên quan
    if (relatedProducts.length === 0) {
      relatedContainer.innerHTML = `
        <p style="text-align:center; color:#999;">Không có sản phẩm liên quan</p>`;
      return;
    }

    // Hiển thị tối đa 4 sản phẩm
    relatedContainer.innerHTML = relatedProducts
      .slice(0, 4)
      .map(p => `
        <div class="product-card">
          <img src="${p.image || 'https://via.placeholder.com/300?text=No+Image'}"
               alt="${p.name}"
               onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
          <h4>${p.name}</h4>
          <p>${formatCurrency(p.price)}</p>
          <a href="product.html?id=${p.id}" class="btn-view">Xem chi tiết</a>
        </div>
      `)
      .join('');
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm liên quan:', err);
    relatedContainer.innerHTML = `
      <p style="text-align:center; color:red;">Không thể tải sản phẩm liên quan.</p>`;
  }
}

// --- Gọi hàm chính ---
if (productId) {
    loadProductDetail();
} else {
    productDetail.innerHTML = `<p style="text-align: center; padding: 40px;">Không tìm thấy sản phẩm.</p>`;
}