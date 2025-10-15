// home.js

const productListElement = document.getElementById('productList');
let allProducts = []; // Biến lưu trữ tất cả sản phẩm
const ITEMS_PER_PAGE = 8; // Số lượng sản phẩm trên mỗi trang
let currentPage = 1;

// Hàm tải dữ liệu sản phẩm từ db.json hoặc LocalStorage
async function loadProducts() {
    // 1. Kiểm tra LocalStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        allProducts = JSON.parse(storedProducts);
    } else {
        // 2. Nếu chưa có, tải từ db.json (giả sử db.json được phục vụ qua fetch)
        try {
            const response = await fetch('../data/db.json'); // Điều chỉnh đường dẫn nếu cần
            const data = await response.json();
            allProducts = data.products;
            // Lưu vào LocalStorage lần đầu
            localStorage.setItem('products', JSON.stringify(allProducts));
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
            // Có thể hiển thị thông báo lỗi trên giao diện
        }
    }

    // Hiển thị sản phẩm sau khi tải
    renderProducts(allProducts);
}

// Hàm hiển thị danh sách sản phẩm lên giao diện
function renderProducts(productsToRender) {
    productListElement.innerHTML = ''; // Xóa nội dung cũ

    // Tính toán phân trang (để đơn giản, ta chỉ hiển thị tất cả nếu số lượng ít)
    // Nếu bạn muốn triển khai đầy đủ phân trang, cần thêm logic ở đây.

    productsToRender.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${formatCurrency(product.price)}</p>
            <p>Kho: ${product.stock}</p>
            <button onclick="addToCart('${product.id}')">Thêm vào giỏ</button>
            <a href="product.html?id=${product.id}">Chi tiết</a>
        `;
        productListElement.appendChild(productCard);
    });

    updateCartCountDisplay(); // Cập nhật số lượng giỏ hàng khi trang tải
}

// Hàm định dạng tiền tệ (Ví dụ: 139999 -> 139.999₫)
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

// *************** BỔ SUNG TÍNH NĂNG GIỎ HÀNG VÀO ĐÂY ***************

// Tải sản phẩm khi trang được load
document.addEventListener('DOMContentLoaded', loadProducts);

// Các hàm lọc/sắp xếp (filterProducts, sortProducts) sẽ sử dụng biến allProducts và gọi lại renderProducts

// *******************************************************************

// home.js (Thêm vào phần sau của file)

// Hàm lấy giỏ hàng từ LocalStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Hàm lưu giỏ hàng vào LocalStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountDisplay();
}

// Hàm cập nhật số lượng sản phẩm trên icon giỏ hàng
function updateCartCountDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');

    if (cartCountElement) {
        cartCountElement.textContent = totalItems > 0 ? ` (${totalItems})` : '';
    }
}

// Hàm thêm sản phẩm vào giỏ hàng (Đã được gọi từ nút "Thêm vào giỏ" trong renderProducts)
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
            stock: product.stock, // Lưu trữ stock để kiểm tra khi tăng số lượng
            quantity: 1,
        });
        alert(`Đã thêm ${product.name} vào giỏ hàng.`);
    }

    saveCart(cart); // Lưu giỏ hàng vào LocalStorage
}

// Gọi hàm này khi trang home.html được tải xong
document.addEventListener('DOMContentLoaded', updateCartCountDisplay);


// home.js (Thêm hàm này vào cuối file)

// -------------------------------------------------------------------
// Hàm Tìm kiếm Sản phẩm (PBW-14)
function search() {
    // 1. Lấy từ khóa tìm kiếm
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    // 2. Kiểm tra nếu không có sản phẩm nào được tải
    if (allProducts.length === 0) {
        alert('Chưa có sản phẩm để tìm kiếm!');
        return;
    }

    // 3. Lọc sản phẩm
    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    // 4. Hiển thị kết quả
    renderProducts(filteredProducts);

    // 5. Cập nhật tiêu đề trang
    const mainTitle = document.querySelector('main h3');
    if (mainTitle) {
         if (searchTerm === "") {
             mainTitle.textContent = "Danh Sách Sản Phẩm"; // Trả về tiêu đề mặc định nếu không có từ khóa
         } else {
             mainTitle.textContent = `Kết Quả Tìm Kiếm cho: "${searchTerm}" (${filteredProducts.length} sản phẩm)`;
         }
    }
}


// Lưu ý: Các hàm filterProducts() và sortProducts() của bạn
// cũng nên gọi lại hàm renderProducts(kết quả lọc/sắp xếp) tương tự.