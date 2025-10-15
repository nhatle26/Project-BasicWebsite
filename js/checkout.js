// Display Order Summary
function displayOrderSummary() {
    const cart = getCart();
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    const orderItemsContainer = document.getElementById('orderItems');
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-item-image"
                 onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
            <div class="order-item-info">
                <p class="order-item-name">${item.name}</p>
                <p class="order-item-quantity">x${item.quantity}</p>
            </div>
            <p class="order-item-price">${formatCurrency(item.price * item.quantity)}</p>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_FEE;
    
    document.getElementById('orderSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('orderTotal').textContent = formatCurrency(total);
}

// Place Order
async function placeOrder() {
    // Get form data
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const note = document.getElementById('note').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;
    
    // Validate
    if (!fullName || !phone || !address) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
    }
    
    if (phone.length < 10) {
        showToast('Số điện thoại không hợp lệ!', 'error');
        return;
    }
    
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Giỏ hàng trống!', 'error');
        return;
    }
    
    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_FEE;
    
    // Create order object
    const order = {
        customerName: fullName,
        phone: phone,
        email: email,
        address: address,
        note: note,
        paymentMethod: payment,
        items: cart,
        subtotal: subtotal,
        shippingFee: SHIPPING_FEE,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    try {
        // Send order to API
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        
        if (response.ok) {
            // Clear cart
            localStorage.removeItem('cart');
            updateCartBadge();
            
            // Show success message
            showToast('Đặt hàng thành công!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                alert('Cảm ơn bạn đã đặt hàng!\n\nMã đơn hàng của bạn sẽ được gửi qua email/SMS.\nChúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!');
                window.location.href = 'home.html';
            }, 1500);
        } else {
            throw new Error('Failed to place order');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra khi đặt hàng!', 'error');
    }
}

// Initialize
if (document.getElementById('orderItems')) {
    displayOrderSummary();
}