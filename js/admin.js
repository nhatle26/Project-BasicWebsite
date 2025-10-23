const API_URL = 'http://localhost:3000/products';
let currentEditId = null;

// Hiển thị form thêm sản phẩm
function showAddProductForm() {
  currentEditId = null;
  document.getElementById('formTitle').innerText = 'Thêm Sản Phẩm Mới';
  document.getElementById('formProduct').reset();
  document.getElementById('productForm').style.display = 'block';
}

// Ẩn form
function cancelProductForm() {
  document.getElementById('productForm').style.display = 'none';
  currentEditId = null;
}

// Hiển thị danh sách sản phẩm
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
});

// Load sản phẩm từ JSON Server
async function loadProducts() {
  const tbody = document.getElementById('productsTableBody');
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    renderProducts(products, tbody);
  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err);
    tbody.innerHTML = `<tr><td colspan="7">Không thể tải dữ liệu từ server.</td></tr>`;
  }
}

// Render sản phẩm
function renderProducts(products, tbody) {
  tbody.innerHTML = '';
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Chưa có sản phẩm nào</td></tr>';
    return;
  }

  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td><img src="${p.image || ''}" width="60" height="60" style="object-fit:cover;border-radius:5px;" onerror="this.src='https://via.placeholder.com/60?text=No+Img'"></td>
      <td>${p.name}</td>
      <td>${formatCurrency(p.price)}</td>
      <td>${p.category}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct(${p.id})">Sửa</button>
        <button onclick="deleteProduct(${p.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Lấy dữ liệu form
function getFormData() {
  return {
    name: document.getElementById('productName').value.trim(),
    price: Number(document.getElementById('productPrice').value),
    category: document.getElementById('productCategory').value,
    description: document.getElementById('productDescription').value.trim(),
    image: document.getElementById('productImage').value.trim(),
    stock: Number(document.getElementById('productStock').value),
  };
}

// Lưu sản phẩm
async function saveProduct() {
  const product = getFormData();
  if (!product.name || !product.price) return alert('Vui lòng nhập đầy đủ tên và giá.');

  try {
    if (currentEditId) {
      // 🛠️ Cập nhật sản phẩm cũ
      await fetch(`${API_URL}/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      alert('Đã cập nhật sản phẩm.');
    } else {

// Lấy danh sách sản phẩm hiện tại để tính ID kế tiếp
      const res = await fetch(API_URL);
      const products = await res.json();

      // Tính ID mới = maxID + 1
      const maxId = products.length ? Math.max(...products.map(p => p.id || 0)) : 0;
      const newProduct = { id: maxId + 1, ...product };

      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      alert('Đã thêm sản phẩm mới.');
    }

    cancelProductForm();
    await loadProducts();
  } catch (err) {
    console.error('Lỗi khi lưu:', err);
  }
}

// Sửa sản phẩm
async function editProduct(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const product = await res.json();
  currentEditId = id;
  document.getElementById('formTitle').innerText = 'Chỉnh Sửa Sản Phẩm';
  document.getElementById('productForm').style.display = 'block';

  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productDescription').value = product.description || '';
  document.getElementById('productImage').value = product.image || '';
  document.getElementById('productStock').value = product.stock || '';
}

// Xóa sản phẩm
async function deleteProduct(id) {
  if (!confirm(' Bạn có chắc muốn xóa sản phẩm này không?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  alert(' Đã xóa sản phẩm.');
  await loadProducts();
}

// Format tiền
function formatCurrency(amount) {
  return Number(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================
const USER_API = 'http://localhost:3000/users';
let currentUserId = null;

// Khi tải trang xong → load danh sách người dùng
document.addEventListener('DOMContentLoaded', async () => {
  await loadUsers();
});

// Hàm tải danh sách người dùng
async function loadUsers() {
  try {
    const res = await fetch(USER_API);
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error('Lỗi tải danh sách người dùng:', err);
  }
}

// Hiển thị danh sách người dùng ra bảng HTML
function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';

  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có người dùng nào.</td></tr>';
    return;
  }

  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.fullname}</td>
        <td>${u.role}</td>
        <td>${u.email}</td>
        <td>
          <button onclick="editUser(${u.id})">✏️ Sửa</button>
          <button onclick="deleteUser(${u.id})">🗑️ Xóa</button>
        </td>
      </tr>
    `;
  });
}

// Cập nhật: Cho phép sửa email (tài khoản), mật khẩu, vai trò
async function editUser(id) {
  try {
    const res = await fetch(`${USER_API}/${id}`);
    const user = await res.json();

    // Hiển thị prompt cho từng trường
    const newEmail = prompt(` Nhập email mới cho người dùng (hiện tại: ${user.email}):`, user.email);
    if (!newEmail) return;

    const newPassword = prompt(` Nhập mật khẩu mới cho người dùng (hiện tại: ${user.password}):`, user.password);
    if (!newPassword) return;

    const newRole = prompt(` Nhập vai trò mới (admin/user):`, user.role);
    if (!newRole) return;

    // Cập nhật dữ liệu người dùng
    await fetch(`${USER_API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail,
        password: newPassword,
        role: newRole
      })
    });

    alert('Đã cập nhật thông tin người dùng.');
    await loadUsers();

  } catch (err) {
    console.error('Lỗi khi sửa người dùng:', err);
  }
}

// Xóa người dùng
async function deleteUser(id) {
  if (!confirm(' Bạn có chắc muốn xóa người dùng này không?')) return;
  await fetch(`${USER_API}/${id}`, { method: 'DELETE' });
  alert(' Đã xóa người dùng.');
  await loadUsers();
}

// Chuyển đổi giữa 2 phần quản lý: sản phẩm ↔ người dùng
function showSection(section) {
  const product = document.getElementById('productSection');
  const user = document.getElementById('userSection');
  const btnProduct = document.getElementById('btnProduct');
  const btnUser = document.getElementById('btnUser');

  if (section === 'product') {
    product.style.display = 'block';
    user.style.display = 'none';
    btnProduct.classList.add('active');
    btnUser.classList.remove('active');
  } else {
    product.style.display = 'none';
    user.style.display = 'block';
    btnProduct.classList.remove('active');
    btnUser.classList.add('active');
  }
}
function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    // Xóa TẤT CẢ thông tin đăng nhập
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    alert(" Đã đăng xuất thành công!");
    
    // Chuyển về trang đăng nhập (đường dẫn ĐÚNG)
    window.location.href = "login.html";
  }
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    checkAuth();
})

