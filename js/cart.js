const SHIPPING_FEE = 30000;

// Display Cart
function displayCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContent.style.display = 'block';
    cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';
    
    // Display cart items
    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                         onerror="this.src='https://via.placeholder.com/120?text=No+Image'">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">${formatCurrency(item.price)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" value="${item.quantity}" min="1" 
                                   class="quantity-input" 
                                   onchange="updateQuantity(${item.id}, this.value)">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <p class="cart-item-total">${formatCurrency(item.price * item.quantity)}</p>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_FEE;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Display summary
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shippingFee').textContent = formatCurrency(SHIPPING_FEE);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
}

// Update Quantity
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        displayCart();
        showToast('Đã cập nhật số lượng!', 'success');
    }
}

// Remove from Cart
function removeFromCart(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
    displayCart();
    showToast('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
}

// Proceed to Checkout
function proceedToCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showToast('Giỏ hàng trống!', 'error');
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Initialize
if (document.getElementById('cartContent')) {
    displayCart();
}