const cartItemsElement = document.getElementById('cartItems');
const emptyCartElement = document.getElementById('emptyCart');
const cartSummaryElement = document.getElementById('cartSummary');
const totalItemsElement = document.getElementById('totalItems');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

const SHIPPING_FEE = 50000; // Phí vận chuyển cố định 50,000đ

// Hàm lấy giỏ hàng từ LocalStorage
function getCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return [];
    
    const cartKey = `cart_${currentUser.id}`;
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
}

// Hàm lưu giỏ hàng vào LocalStorage
function saveCart(cart) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const cartKey = `cart_${currentUser.id}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

// Hàm hiển thị giỏ hàng
function renderCart() {
    const cart = getCart();
    
    cartItemsElement.innerHTML = '';

    if (cart.length === 0) {
        // Giỏ hàng trống
        emptyCartElement.style.display = 'block';
        cartSummaryElement.style.display = 'none';

        return;
    }

    // Giỏ hàng có sản phẩm
    emptyCartElement.style.display = 'none';
    cartSummaryElement.style.display = 'block';

    let subtotal = 0;
    let totalItems = 0;

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        
        subtotal += itemTotal;
        totalItems += item.quantity;

        const cartItem = document.createElement('div');
        
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('data-id', item.id);

        // ĐOẠN HTML ĐƯỢC CĂN CHỈNH RỘNG RÃI
        cartItem.innerHTML = `
            <img 
                src="${item.image}" 
                alt="${item.name}"
            >

            <div class="details">
                <h3>${item.name}</h3>
                <p>Giá: ${formatCurrency(item.price)}</p>
                <p>Tổng: ${formatCurrency(itemTotal)}</p>
            </div>

            <div class="quantity-control">
                <button onclick="updateQuantity('${item.id}', -1)">-</button>
                <input 
                    type="number" 
                    value="${item.quantity}" 
                    min="1" 
                    max="${item.stock}" 
                    onchange="updateQuantityManual('${item.id}', this.value)" 
                    readonly
                >
                <button onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>

            <button class="remove-btn" onclick="removeItem('${item.id}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        
        cartItemsElement.appendChild(cartItem);
    });

    // Cập nhật tổng kết
    const finalTotal = subtotal + SHIPPING_FEE;

    totalItemsElement.textContent = totalItems;
    subtotalElement.textContent = formatCurrency(subtotal);
    totalElement.textContent = formatCurrency(finalTotal);
}

// Hàm cập nhật số lượng sản phẩm (tăng/giảm 1)
function updateQuantity(productId, change) {
    let cart = getCart();
    
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex > -1) {
        const item = cart[itemIndex];
        const newQuantity = item.quantity + change;

        if (newQuantity < 1) {
            // Nếu số lượng giảm xuống 0, xóa sản phẩm
            removeItem(productId);
            
            return;
        }

        if (newQuantity > item.stock) {
            alert(`Số lượng tối đa cho sản phẩm này là ${item.stock}.`);
            
            return;
        }

        item.quantity = newQuantity;
        
        saveCart(cart);
        renderCart(); // Render lại giỏ hàng
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeItem(productId) {
    let cart = getCart();
    
    // Lọc ra những sản phẩm KHÔNG CÓ ID này
    cart = cart.filter((item) => item.id !== productId);

    saveCart(cart);
    renderCart(); // Render lại giỏ hàng
}

// Hàm chuyển hướng đến trang thanh toán
function checkout() {
    if (getCart().length > 0) {
        window.location.href = 'checkout.html';
    } else {
        alert('Giỏ hàng của bạn đang trống!');
    }
}

// Tải giỏ hàng khi trang được load
document.addEventListener('DOMContentLoaded', renderCart);