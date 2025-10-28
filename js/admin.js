const API_URL = 'http://localhost:3000/products';
const USER_API = 'http://localhost:3000/users';
const ORDER_API = 'http://localhost:3000/orders'; // ✅ Thêm API đơn hàng

let currentEditId = null;
let currentUserId = null;
let allProducts = [];
let allUsers = [];
let allOrders = []; // ✅ Lưu toàn bộ đơn hàng

// ==================== QUẢN LÝ SẢN PHẨM ====================
function showAddProductForm() {
  currentEditId = null;
  document.getElementById('formTitle').innerText = 'Thêm Sản Phẩm Mới';
  document.getElementById('formProduct').reset();
  document.getElementById('productForm').style.display = 'block';
}

function cancelProductForm() {
  document.getElementById('productForm').style.display = 'none';
  currentEditId = null;
}

async function loadProducts() {
  const tbody = document.getElementById('productsTableBody');
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    allProducts = products;
    renderProducts(products, tbody);
  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err);
    tbody.innerHTML = `<tr><td colspan="7">Không thể tải dữ liệu từ server.</td></tr>`;
  }
}

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
      <td>${Array.isArray(p.event) ? p.event.join(', ') : p.event || 'N/A'}</td>
      <td>
        <button onclick="editProduct(${p.id})" class="btn-edit">Sửa</button>
        <button onclick="deleteProduct(${p.id})" class="btn-delete">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function getFormData() {
  return {
    name: document.getElementById('productName').value.trim(),
    price: Number(document.getElementById('productPrice').value),
    category: document.getElementById('productCategory').value,
    description: document.getElementById('productDescription').value.trim(),
    image: document.getElementById('productImage').value.trim(),
    stock: Number(document.getElementById('productStock').value),
    event: [document.getElementById('productEvent').value]
  };
}

async function saveProduct() {
  const product = getFormData();
  if (!product.name || !product.price) return alert('Vui lòng nhập đầy đủ tên và giá.');

  try {
    if (currentEditId) {
      await fetch(`${API_URL}/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(product)
      });
      alert('Đã cập nhật sản phẩm.');
    } else {
      const res = await fetch(API_URL);
      const products = await res.json();
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
    document.getElementById('productEvent').value = Array.isArray(product.event) ? product.event[0] : (product.event || '');
  } catch (err) {
    console.error('Lỗi khi sửa sản phẩm:', err);
  }
}

async function deleteProduct(id) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  alert('Đã xóa sản phẩm.');
  await loadProducts();
}

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================
async function loadUsers() {
  try {
    const res = await fetch(USER_API);
    const users = await res.json();
    allUsers = users;
    renderUsers(users);
  } catch (err) {
    console.error('Lỗi tải danh sách người dùng:', err);
  }
}

function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có người dùng nào.</td></tr>';
    return;
  }

  users.forEach(u => {
    const isLocked = u.isLocked || false;
    const statusText = isLocked ? 'Đã khóa' : 'Hoạt động';
    const actionButton = isLocked
      ? `<button class="btn-unlock" onclick="toggleLockUser(${u.id}, false)">Mở khóa</button>`
      : `<button class="btn-lock" onclick="toggleLockUser(${u.id}, true)">Khóa TK</button>`;

    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.fullname}</td>
<td>${u.role}</td>
        <td>${u.email}</td>
        <td>${statusText}</td>
        <td>${actionButton}</td>
      </tr>
    `;
  });
}

// ==================== QUẢN LÝ ĐƠN HÀNG ====================
async function loadOrders() {
  try {
    const res = await fetch(ORDER_API);
    const orders = await res.json();
    allOrders = orders;
    renderOrders(orders);
  } catch (err) {
    console.error('Lỗi tải danh sách đơn hàng:', err);
    document.getElementById('ordersTableBody').innerHTML =
      `<tr><td colspan="7">Không thể tải dữ liệu đơn hàng.</td></tr>`;
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = '';

  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Không có đơn hàng nào.</td></tr>';
    return;
  }

  orders.forEach(o => {
    const date = o.date || 'N/A';
    const total = formatCurrency(o.total || 0);

    // ✅ Lấy dữ liệu khách hàng
    const customerName = o.customer?.fullname || 'Không rõ';
    const customerEmail = o.customer?.email || '';
    const customerPhone = o.customer?.phone || '';
    const customerAddress = o.customer?.address || '';
    const note = o.customer?.note || '';

    // ✅ Hiển thị sản phẩm trong đơn (dạng danh sách)
    const productList = o.items?.map(item =>
      `<div>
        <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;border-radius:4px;margin-right:6px;vertical-align:middle;">
        ${item.name} (x${item.quantity})
      </div>`
    ).join('') || '';

    tbody.innerHTML += `
      <tr>
        <td>${o.id}</td>
        <td>${customerName}</td>
        <td>${productList}</td>
         <td>${customerAddress}</td>
        <td>${total}</td>
        <td>Ghi chú:</strong> ${note || 'Không có'}</td>
        <td>
          <select onchange="updateOrderStatus('${o.id}', this.value)">
            <option value="Chờ xử lý" ${o.status === 'Chờ xử lý' ? 'selected' : ''}>Chờ xử lý</option>
            <option value="Đang giao" ${o.status === 'Đang giao' ? 'selected' : ''}>Đang giao</option>
            <option value="Hoàn tất" ${o.status === 'Hoàn tất' ? 'selected' : ''}>Hoàn tất</option>
            <option value="Đã hủy" ${o.status === 'Đã hủy' ? 'selected' : ''}>Đã hủy</option>
          </select>
        </td>
      </tr>
    `;
  });
}

async function updateOrderStatus(id, newStatus) {
  try {
    await fetch(`${ORDER_API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    alert('✅ Đã cập nhật trạng thái đơn hàng!');
  } catch (err) {
    console.error('Lỗi khi cập nhật đơn hàng:', err);
    alert('❌ Không thể cập nhật trạng thái!');
  }
}
// ==================== CHUNG ====================
function formatCurrency(amount) {
return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function showSection(section) {
  const product = document.getElementById('productSection');
  const user = document.getElementById('userSection');
  const order = document.getElementById('orderSection'); // ✅ Thêm
  const btnProduct = document.getElementById('btnProduct');
  const btnUser = document.getElementById('btnUser');
  const btnOrder = document.getElementById('btnOrder'); // ✅ Thêm

  product.style.display = section === 'product' ? 'block' : 'none';
  user.style.display = section === 'user' ? 'block' : 'none';
  order.style.display = section === 'order' ? 'block' : 'none';

  btnProduct.classList.toggle('active', section === 'product');
  btnUser.classList.toggle('active', section === 'user');
  btnOrder.classList.toggle('active', section === 'order');

  if (section === 'user') loadUsers();
  if (section === 'order') loadOrders();
}

function logout() {
  if (confirm('Bạn có chắc muốn đăng xuất không?')) {
    localStorage.clear();
    alert('Đã đăng xuất.');
    window.location.href = 'login.html';
  }
}

// ==================== KHỞI TẠO ====================
document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.role !== 'admin') {
    alert('Bạn không có quyền truy cập!');
    window.location.href = 'login.html';
    return;
  }
  await loadProducts();
  await loadUsers();
  await loadOrders();
});
