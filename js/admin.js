// js/admin.js - CRUD sản phẩm cho trang admin

let isEditMode = false;
let editingProductId = null;

// ===== RENDER BẢNG SẢN PHẨM =====
function renderProductTable() {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;

    const products = window.productsUtils.getAllProducts();

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td style="font-size: 24px;">${product.emoji}</td>
            <td>${product.name}</td>
            <td>${getCategoryLabel(product.category)}</td>
            <td>${product.price.toLocaleString('vi-VN')}đ</td>
            <td>${product.stock}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-secondary btn-small" onclick="openEditModal(${product.id})">✏️ Sửa</button>
                    <button class="btn btn-small" style="background: #ff6b6b; color: white;" onclick="deleteProduct(${product.id})">🗑️ Xóa</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== LẤY TÊN DANH MỤC =====
function getCategoryLabel(category) {
    const labels = {
        'hoa': '🌹 Hoa',
        'chau': '🪴 Chậu cây',
        'phu-kien': '✂️ Phụ kiện'
    };
    return labels[category] || category;
}

// ===== MỞ MODAL THÊM SẢN PHẨM =====
function openAddModal() {
    isEditMode = false;
    editingProductId = null;
    
    document.getElementById('modalTitle').textContent = 'Thêm sản phẩm mới';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    
    document.getElementById('productModal').classList.add('show');
}

// ===== MỞ MODAL SỬA SẢN PHẨM =====
function openEditModal(productId) {
    isEditMode = true;
    editingProductId = productId;
    
    const product = window.productsUtils.getProductById(productId);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'Sửa sản phẩm';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productEmoji').value = product.emoji;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description || '';
    
    document.getElementById('productModal').classList.add('show');
}

// ===== ĐÓNG MODAL =====
function closeModal() {
    document.getElementById('productModal').classList.remove('show');
    document.getElementById('productForm').reset();
}

// ===== XỬ LÝ SUBMIT FORM =====
function handleSubmit(event) {
    event.preventDefault();
    
    const productData = {
        id: isEditMode ? editingProductId : Date.now(),
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        emoji: document.getElementById('productEmoji').value.trim(),
        price: parseInt(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value.trim()
    };
    
    if (isEditMode) {
        updateProduct(productData);
    } else {
        addProduct(productData);
    }
}

// ===== THÊM SẢN PHẨM MỚI =====
function addProduct(productData) {
    const products = window.productsUtils.getAllProducts();
    products.push(productData);
    window.productsUtils.saveProductsToStorage();
    
    closeModal();
    renderProductTable();
    showToast('✅ Thêm sản phẩm thành công!', 'success');
}

// ===== CẬP NHẬT SẢN PHẨM =====
function updateProduct(productData) {
    const products = window.productsUtils.getAllProducts();
    const index = products.findIndex(p => p.id === productData.id);
    
    if (index !== -1) {
        products[index] = productData;
        window.productsUtils.saveProductsToStorage();
        
        closeModal();
        renderProductTable();
        showToast('✅ Cập nhật sản phẩm thành công!', 'success');
    }
}

// ===== XÓA SẢN PHẨM =====
function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }
    
    const products = window.productsUtils.getAllProducts();
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        products.splice(index, 1);
        window.productsUtils.saveProductsToStorage();
        
        renderProductTable();
        showToast('✅ Xóa sản phẩm thành công!', 'success');
    }
}

// ===== HIỂN THỊ THÔNG BÁO TOAST =====
function showToast(message, type = 'success') {
    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// CSS cho animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);