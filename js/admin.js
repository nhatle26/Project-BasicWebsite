// admin.js
const JSON_PATH = '../data/db.json';
let currentEditId = null;

// 🧩 Hiển thị form thêm sản phẩm
function showAddProductForm() {
  currentEditId = null;
  document.getElementById('formTitle').innerText = 'Thêm Sản Phẩm Mới';
  document.getElementById('formProduct').reset();
  document.getElementById('productForm').style.display = 'block';
}

// 🧩 Ẩn form
function cancelProductForm() {
  document.getElementById('productForm').style.display = 'none';
  currentEditId = null;
}

// 🧩 Hiển thị danh sách sản phẩm
document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('productsTableBody');
  let products = JSON.parse(localStorage.getItem('products') || '[]');

  // Nếu chưa có dữ liệu thì đọc từ db.json
  if (!products.length) {
    try {
      const res = await fetch(JSON_PATH);
      const data = await res.json();
      products = data.products || [];
      localStorage.setItem('products', JSON.stringify(products));
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    }
  }

  renderProducts(products, tbody);
});

// 🧩 Hiển thị sản phẩm
function renderProducts(products, tbody) {
  tbody.innerHTML = '';
  if (!products.length) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align:center;">Chưa có sản phẩm nào</td></tr>';
    return;
  }

  products.forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td><img src="${p.image || ''}" width="60" height="60" style="object-fit:cover; border-radius:5px;" onerror="this.src='https://via.placeholder.com/60?text=No+Img'"></td>
      <td>${p.name}</td>
      <td>${formatCurrency(p.price)}</td>
      <td>${p.category}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct(${p.id})">✏️ Sửa</button>
        <button onclick="deleteProduct(${p.id})">🗑️ Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 🧩 Sửa sản phẩm
function editProduct(id) {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product = products.find((p) => p.id == id);
  if (!product) return alert('Không tìm thấy sản phẩm');

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

// 🧮 Lấy ID mới (max + 1)
function getNextProductId(products) {
  if (!products.length) return 1;
  const maxId = Math.max(...products.map((p) => p.id || 0));
  return maxId + 1;
}

// 🧩 Lưu sản phẩm (thêm mới hoặc cập nhật)
function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const price = Number(document.getElementById('productPrice').value);
  const category = document.getElementById('productCategory').value;
  const description = document.getElementById('productDescription').value.trim();
  const image = document.getElementById('productImage').value.trim();
  const stock = Number(document.getElementById('productStock').value);

  if (!name || !price) return alert('⚠️ Vui lòng nhập đầy đủ tên và giá.');

  let products = JSON.parse(localStorage.getItem('products') || '[]');

  if (currentEditId) {
    // 🛠 Cập nhật
    const idx = products.findIndex((p) => p.id == currentEditId);
    if (idx >= 0) {
      products[idx] = {
        ...products[idx],
        name,
        price,
        category,
        description,
        image,
        stock,
      };
      alert('✅ Đã cập nhật sản phẩm.');
    }
  } else {
    // ➕ Thêm mới
    const newId = getNextProductId(products);
    products.push({ id: newId, name, price, category, description, image, stock });
    alert('✅ Đã thêm sản phẩm mới.');
  }

  localStorage.setItem('products', JSON.stringify(products));
  document.getElementById('productForm').style.display = 'none';
  renderProducts(products, document.getElementById('productsTableBody'));
  currentEditId = null;
}

// 🗑 Xóa sản phẩm
function deleteProduct(id) {
  if (!confirm('🗑️ Bạn có chắc muốn xóa sản phẩm này không?')) return;
  let products = JSON.parse(localStorage.getItem('products') || '[]');
  products = products.filter((p) => p.id != id);
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts(products, document.getElementById('productsTableBody'));
}

// 💰 Format tiền
function formatCurrency(amount) {
  return Number(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}
