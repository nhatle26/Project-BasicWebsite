// Check Admin Access
function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang này!');
        window.location.href = 'index.html';
        return false;
    }
    
    // Display admin name
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = user.fullname || user.username;
    }
    
    return true;
}

// Load All Products for Admin
async function loadAdminProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        displayAdminProducts(products);
    } catch (error) {
        console.error('Error:', error);
        showToast('Không thể tải danh sách sản phẩm!', 'error');
    }
}

// Display Admin Products
function displayAdminProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-table-image"
                     onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
            </td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

// Show Add Product Form
function showAddProductForm() {
    document.getElementById('formTitle').textContent = 'Thêm Sản Phẩm Mới';
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = 'Hoa Hồng';
    document.getElementById('productDescription').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productForm').style.display = 'block';
    
    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

// Edit Product
async function editProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();
        
        document.getElementById('formTitle').textContent = 'Chỉnh Sửa Sản Phẩm';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productForm').style.display = 'block';
        
        // Scroll to form
        document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        showToast('Không thể tải thông tin sản phẩm!', 'error');
    }
}

// Save Product (Add or Update)
async function saveProduct() {
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const stock = parseInt(document.getElementById('productStock').value);
    
    // Validate
    if (!name || !price || !description || !image || !stock) {
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
    
    const productData = {
        name: name,
        price: price,
        category: category,
        description: description,
        image: image,
        stock: stock
    };
    
    try {
        let response;
        if (productId) {
            // Update existing product
            response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...productData, id: parseInt(productId) })
            });
        } else {
            // Add new product
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (response.ok) {
            showToast(productId ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!', 'success');
            cancelProductForm();
            loadAdminProducts();
        } else {
            throw new Error('Failed to save product');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra khi lưu sản phẩm!', 'error');
    }
}

// Delete Product
async function deleteProduct(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Xóa sản phẩm thành công!', 'success');
            loadAdminProducts();
        } else {
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra khi xóa sản phẩm!', 'error');
    }
}

// Cancel Product Form
function cancelProductForm() {
    document.getElementById('productForm').style.display = 'none';
}

// Initialize
if (document.getElementById('productsTableBody')) {
    if (checkAdminAccess()) {
        loadAdminProducts();
    }
}