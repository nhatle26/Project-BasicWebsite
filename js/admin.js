// admin.js - Quản lý sản phẩm cho Admin

// Hàm hiển thị thông báo toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

// Tải danh sách sản phẩm
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    displayProducts(products);
}

// Hiển thị sản phẩm trong bảng
function displayProducts(products) {
    const tbody = document.getElementById('productTable');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;"
                     onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
            </td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct('${product.id}')" style="margin: 2px; padding: 5px 10px; background: #ff9800; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button onclick="deleteProduct('${product.id}')" style="margin: 2px; padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

// Hiển thị form thêm sản phẩm
function showAddForm() {
    document.getElementById('formTitle').textContent = 'Thêm Sản Phẩm Mới';
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = 'Hoa Hồng';
    document.getElementById('productDescription').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productForm').style.display = 'block';
    
    // Scroll đến form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

// Sửa sản phẩm
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    document.getElementById('formTitle').textContent = 'Chỉnh Sửa Sản Phẩm';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productForm').style.display = 'block';
    
    // Scroll đến form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

// Lưu sản phẩm (thêm mới hoặc cập nhật)
function saveProduct() {
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const stock = parseInt(document.getElementById('productStock').value);
    
    // Validate
    if (!name || !price || !description || !image || isNaN(stock)) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (price <= 0) {
        showToast('Giá sản phẩm phải lớn hơn 0!', 'error');
        return;
    }
    
    if (stock < 0) {
        showToast('Số lượng tồn kho không hợp lệ!', 'error');
        return;
    }
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (productId) {
        // Cập nhật sản phẩm hiện có
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                category,
                description,
                image,
                stock
            };
            showToast('Cập nhật sản phẩm thành công!', 'success');
        }
    } else {
        // Thêm sản phẩm mới
        const newProduct = {
            id: Date.now().toString(),
            name,
            price,
            category,
            description,
            image,
            stock
        };
        products.push(newProduct);
        showToast('Thêm sản phẩm thành công!', 'success');
    }
    
    // Lưu vào localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reset form và reload danh sách
    cancelForm();
    loadProducts();
}

// Xóa sản phẩm
function deleteProduct(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== productId);
    
    localStorage.setItem('products', JSON.stringify(products));
    showToast('Xóa sản phẩm thành công!', 'success');
    loadProducts();
}

// Hủy form
function cancelForm() {
    document.getElementById('productForm').style.display = 'none';
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = 'Hoa Hồng';
    document.getElementById('productDescription').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productStock').value = '';
}

// Khởi tạo dữ liệu demo nếu chưa có
function initDemoProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    
    if (!products || products.length === 0) {
        const demoProducts = [
            {
                id: '1',
                name: 'Hoa Hồng Đỏ',
                price: 150000,
                category: 'Hoa Hồng',
                description: 'Bó hoa hồng đỏ tươi, tượng trưng cho tình yêu nồng cháy',
                image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300',
                stock: 50
            },
            {
                id: '2',
                name: 'Hoa Tulip Vàng',
                price: 180000,
                category: 'Hoa Tulip',
                description: 'Hoa tulip vàng tươi sáng, mang lại niềm vui và năng lượng tích cực',
                image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=300',
                stock: 30
            },
            {
                id: '3',
                name: 'Hoa Ly Trắng',
                price: 220000,
                category: 'Hoa Ly',
                description: 'Hoa ly trắng tinh khôi, thanh lịch và sang trọng',
                image: 'https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=300',
                stock: 25
            },
            {
                id: '4',
                name: 'Hoa Lan Tím',
                price: 350000,
                category: 'Hoa Lan',
                description: 'Chậu hoa lan tím quý phái, thích hợp làm quà tặng',
                image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300',
                stock: 15
            },
            {
                id: '5',
                name: 'Hoa Hồng Phấn',
                price: 165000,
                category: 'Hoa Hồng',
                description: 'Hoa hồng màu phấn nhẹ nhàng, lãng mạn',
                image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=300',
                stock: 40
            },
            {
                id: '6',
                name: 'Hoa Tulip Đỏ',
                price: 175000,
                category: 'Hoa Tulip',
                description: 'Tulip đỏ rực rỡ, biểu tượng của tình yêu chân thành',
                image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=300',
                stock: 35
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(demoProducts));
        console.log('Đã khởi tạo dữ liệu sản phẩm demo');
    }
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    initDemoProducts();
    loadProducts();
});