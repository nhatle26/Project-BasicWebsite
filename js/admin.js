const API_URL = 'http://localhost:3000/products';
const USER_API = 'http://localhost:3000/users';
let currentEditId = null;
let currentUserId = null;
let allProducts = []; // Lưu toàn bộ sản phẩm để tìm kiếm
let allUsers = []; // Lưu toàn bộ user để tìm kiếm

// ==================== QUẢN LÝ SẢN PHẨM ====================

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

// Load sản phẩm từ JSON Server
async function loadProducts() {
  const tbody = document.getElementById('productsTableBody');
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    allProducts = products; // Lưu để tìm kiếm
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
        <button onclick="editProduct(${p.id})" class="btn-edit">Sửa</button>
        <button onclick="deleteProduct(${p.id})" class="btn-delete">Xóa</button>
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
  
  if (!product.name || !product.price) {
    alert('Vui lòng nhập đầy đủ tên và giá.');
    return;
  }

  if (product.price <= 0) {
    alert('Giá sản phẩm phải lớn hơn 0.');
    return;
  }

  if (product.stock < 0) {
    alert('Số lượng trong kho không được âm.');
    return;
  }

  try {
    if (currentEditId) {
      // Cập nhật sản phẩm cũ
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
    alert('Không thể lưu sản phẩm!');
  }
}

// Sửa sản phẩm
async function editProduct(id) {
  try {
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
    document.getElementById('productEvent').value = product.event || '';
  } catch (err) {
    console.error('Lỗi khi sửa sản phẩm:', err);
    alert('Không thể tải thông tin sản phẩm!');
  }
}

// Xóa sản phẩm
async function deleteProduct(id) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;
  
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('Đã xóa sản phẩm.');
    await loadProducts();
  } catch (err) {
    console.error('Lỗi khi xóa sản phẩm:', err);
    alert('Không thể xóa sản phẩm!');
  }
}

// TÌM KIẾM SẢN PHẨM
function searchProducts() {
  const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
  
  if (!searchInput) {
    // Nếu không có từ khóa → hiển thị tất cả
    renderProducts(allProducts, document.getElementById('productsTableBody'));
    return;
  }

  // Tìm kiếm theo tên, danh mục, giá
  const filteredProducts = allProducts.filter(p => {
    const name = p.name.toLowerCase();
    const category = p.category.toLowerCase();
    const price = p.price.toString();
    
    return name.includes(searchInput) || 
           category.includes(searchInput) || 
           price.includes(searchInput);
  });

  renderProducts(filteredProducts, document.getElementById('productsTableBody'));
  
  // Thông báo kết quả
  if (filteredProducts.length === 0) {
    document.getElementById('productsTableBody').innerHTML = 
      `<tr><td colspan="7" style="text-align:center; color: #ff6b6b;">
        Không tìm thấy sản phẩm nào với từ khóa: "<strong>${searchInput}</strong>"
      </td></tr>`;
  }
}

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================
// Hàm tải danh sách người dùng
async function loadUsers() {
  try {
    const res = await fetch(USER_API);
    const users = await res.json();
    allUsers = users; // Lưu để tìm kiếm
    renderUsers(users);
  } catch (err) {
    console.error('Lỗi tải danh sách người dùng:', err);
    document.getElementById('usersTableBody').innerHTML = 
      `<tr><td colspan="6" style="text-align:center; color: #ff6b6b;">
        Không thể tải dữ liệu từ server
      </td></tr>`;
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
    // Kiểm tra trạng thái khóa (mặc định là false nếu chưa có)
    const isLocked = u.isLocked || false;
    const statusText = isLocked ? 'Đã khóa' : 'Hoạt động';
    const statusClass = isLocked ? 'status-locked' : 'status-active';
    const actionButton = isLocked 
      ? `<button class="btn-unlock" onclick="toggleLockUser(${u.id}, false)">Mở khóa</button>`
      : `<button class="btn-lock" onclick="toggleLockUser(${u.id}, true)">Khóa TK</button>`;

    tbody.innerHTML += `
      <tr class="${isLocked ? 'locked-row' : ''}">
        <td>${u.id}</td>
        <td>${u.fullname}</td>
        <td><span class="role-badge role-${u.role}">${u.role === 'admin' ? 'Admin' : 'User'}</span></td>
        <td>${u.email}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>
          <button onclick="editUser(${u.id})" class="btn-edit">Sửa</button>
          ${actionButton}
        </td>
      </tr>
    `;
  });
}

// Hàm khóa/mở khóa tài khoản người dùng
async function toggleLockUser(id, lockStatus) {
  const action = lockStatus ? 'khóa' : 'mở khóa';
  const confirmMessage = lockStatus 
    ? 'Bạn có chắc muốn KHÓA tài khoản này không?\n\nNgười dùng sẽ không thể đăng nhập sau khi bị khóa.'
    : 'Bạn có chắc muốn MỞ KHÓA tài khoản này không?';
  
  if (!confirm(confirmMessage)) return;

  try {
    // Cập nhật trạng thái khóa trong database
    await fetch(`${USER_API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLocked: lockStatus })
    });

    const successMessage = lockStatus 
      ? 'Đã khóa tài khoản thành công!'
      : 'Đã mở khóa tài khoản thành công!';
    
    alert(successMessage);
    await loadUsers();

  } catch (err) {
    console.error(`Lỗi khi ${action} tài khoản:`, err);
    alert(`Không thể ${action} tài khoản. Vui lòng thử lại!`);
  }
}

// Cập nhật: Cho phép sửa email (tài khoản), mật khẩu, vai trò
async function editUser(id) {
  try {
    const res = await fetch(`${USER_API}/${id}`);
    const user = await res.json();

    // Kiểm tra nếu tài khoản đang bị khóa
    if (user.isLocked) {
      alert('Tài khoản này đang bị khóa. Vui lòng mở khóa trước khi chỉnh sửa!');
      return;
    }

    // Hiển thị prompt cho từng trường
    const newEmail = prompt(`Nhập email mới cho người dùng (hiện tại: ${user.email}):`, user.email);
    if (!newEmail) return;

    // Kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail)) {
      alert('Email không hợp lệ!');
      return;
    }

    const newPassword = prompt(`Nhập mật khẩu mới cho người dùng (hiện tại: ${user.password}):`, user.password);
    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    const newRole = prompt(`👤 Nhập vai trò mới (admin/user):`, user.role);
    if (!newRole || (newRole !== 'admin' && newRole !== 'user')) {
      alert('Vai trò không hợp lệ! Chỉ chấp nhận "admin" hoặc "user".');
      return;
    }

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
    alert('Không thể cập nhật thông tin. Vui lòng thử lại!');
  }
}

// 🔍 TÌM KIẾM NGƯỜI DÙNG
function searchUsers() {
  const searchInput = document.getElementById('searchUserInput').value.trim().toLowerCase();
  
  if (!searchInput) {
    // Nếu không có từ khóa → hiển thị tất cả
    renderUsers(allUsers);
    return;
  }

  // Tìm kiếm theo tên, email, role
  const filteredUsers = allUsers.filter(u => {
    const fullname = u.fullname.toLowerCase();
    const email = u.email.toLowerCase();
    const role = u.role.toLowerCase();
    
    return fullname.includes(searchInput) || 
           email.includes(searchInput) || 
           role.includes(searchInput);
  });

  renderUsers(filteredUsers);
  
  // Thông báo kết quả
  if (filteredUsers.length === 0) {
    document.getElementById('usersTableBody').innerHTML = 
      `<tr><td colspan="6" style="text-align:center; color: #ff6b6b;">
        Không tìm thấy người dùng nào với từ khóa: "<strong>${searchInput}</strong>"
      </td></tr>`;
  }
}

// ==================== CHỨC NĂNG CHUNG ====================
// Format tiền
function formatCurrency(amount) {
  return Number(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
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
    
    // Reset search
    if (document.getElementById('searchUserInput')) {
      document.getElementById('searchUserInput').value = '';
    }
    loadUsers();
  }
}

// Đăng xuất
function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    // Xóa TẤT CẢ thông tin đăng nhập
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    alert("Đã đăng xuất thành công!");
    
    // Chuyển về trang đăng nhập (đường dẫn ĐÚNG)
    window.location.href = "login.html";
  }
}

// ==================== KHỞI TẠO ====================
// Khi tải trang xong → load danh sách sản phẩm và người dùng
document.addEventListener('DOMContentLoaded', async () => {
  // Kiểm tra quyền admin
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.role !== 'admin') {
    alert('Bạn không có quyền truy cập trang này!');
    window.location.href = 'login.html';
    return;
  }
  await loadProducts();
  await loadUsers();
});