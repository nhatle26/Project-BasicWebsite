const API_URL = "http://localhost:3000/products";
const USER_API = "http://localhost:3000/users";
const ORDER_API = "http://localhost:3000/orders";

let allProducts = [];
let allUsers = [];
let allOrders = [];
let currentEditId = null;

// ============ SẢN PHẨM ============
async function loadProducts() {
  const tbody = document.getElementById("productsTableBody");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Không thể kết nối tới API sản phẩm");
    allProducts = await res.json();

    if (allProducts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">Chưa có sản phẩm nào</td></tr>`;
      return;
    }

    tbody.innerHTML = allProducts
      .map(
        (p) => `
      <tr>
        <td>${p.id}</td>
        <td><img src="${
          p.image || "https://via.placeholder.com/60"
        }" width="60" height="60" style="object-fit:cover;border-radius:5px"></td>
        <td>${p.name}</td>
        <td>${formatCurrency(p.price)}</td>
        <td>${p.category}</td>
        <td>${p.stock}</td>
        <td>${p.event}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="openEditProduct(${
            p.id
          })"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${
            p.id
          })"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Không thể tải dữ liệu sản phẩm!</td></tr>`;
  }
}

function openAddProduct() {
  currentEditId = null;
  document.getElementById("productForm").reset();
  document.getElementById("productModalLabel").innerText = "Thêm sản phẩm mới";
  new bootstrap.Modal(document.getElementById("productModal")).show();
}

function openEditProduct(id) {
  id = String(id);
  const p = allProducts.find((x) => x.id === id);
  if (!p) return alert("Không tìm thấy sản phẩm!");

  currentEditId = id;
  document.getElementById("productModalLabel").innerText = "Sửa sản phẩm";
  document.getElementById("productId").value = id;
  document.getElementById("productName").value = p.name;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productCategory").value = p.category;
  document.getElementById("productDescription").value = p.description;
  document.getElementById("productImage").value = p.image;
  document.getElementById("productStock").value = p.stock;
  document.getElementById("productEvent").value = p.event;
  new bootstrap.Modal(document.getElementById("productModal")).show();
}

async function saveProduct() {
  const p = {
    name: productName.value.trim(),
    price: Number(productPrice.value),
    category: productCategory.value.trim(),
    description: productDescription.value.trim(),
    image: productImage.value.trim(),
    stock: Number(productStock.value),
    event: productEvent.value.trim(),
  };

  if (!p.name || isNaN(p.price))
    return alert("⚠️ Vui lòng nhập đủ thông tin hợp lệ!");

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("productModal")
  );

  try {
    if (currentEditId) {
      // Sửa sản phẩm
      await fetch(`${API_URL}/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      alert("✅ Đã cập nhật sản phẩm!");
    } else {
      // Thêm sản phẩm
      p.id = Date.now();
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      alert("✅ Đã thêm sản phẩm!");
    }

    modal.hide();
    await loadProducts();
  } catch (err) {
    console.error("Lỗi lưu sản phẩm:", err);
    alert("❌ Không thể lưu sản phẩm!");
  }
}

async function deleteProduct(id) {
  if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("🗑️ Đã xóa sản phẩm!");
    loadProducts();
  } catch (err) {
    console.error("Lỗi xóa sản phẩm:", err);
    alert("❌ Không thể xóa sản phẩm!");
  }
}

// ============ NGƯỜI DÙNG ============
async function loadUsers() {
  const tbody = document.getElementById("usersTableBody");
  try {
    const res = await fetch(USER_API);
    if (!res.ok) throw new Error("Không thể kết nối tới API người dùng");
    allUsers = await res.json();

    if (allUsers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">Chưa có người dùng nào</td></tr>`;
      return;
    }

    tbody.innerHTML = allUsers
      .map(
        (u) => `
      <tr>
        <td>${u.id}</td>
        <td>${u.fullname}</td>
        <td>${u.role}</td>
        <td>${u.email}</td>
        <td>${u.isLocked ? "🔒 Đã khóa" : "🟢 Hoạt động"}</td>
        <td>
          <button class="btn btn-${
            u.isLocked ? "success" : "danger"
          } btn-sm" onclick="toggleUser(${u.id}, ${!u.isLocked})">
            ${u.isLocked ? "Mở khóa" : "Khóa TK"}
          </button>
          <button class="btn btn-sm btn-warning" onclick="openEditUser(${
            u.id
          })"><i class="fa-solid fa-pen"></i></button>
        </td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Lỗi tải người dùng:", err);
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Không thể tải dữ liệu người dùng!</td></tr>`;
  }
}

async function toggleUser(id, lock) {
  const action = lock ? "khóa" : "mở khóa";
  if (!confirm(`Bạn có chắc muốn ${action} người dùng này không?`)) return;

  try {
    await fetch(`${USER_API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLocked: lock }),
    });
    alert(`✅ Đã ${action} tài khoản!`);
    loadUsers();
  } catch (err) {
    console.error("Lỗi khóa/mở khóa:", err);
    alert("❌ Không thể thay đổi trạng thái!");
  }
}

// ======== SỬA NGƯỜI DÙNG =========
function openEditUser(id) {
  id = String(id);
  const u = allUsers.find((x) => x.id === id);
  if (!u) return alert("Không tìm thấy người dùng!");

  currentEditId = id;
  document.getElementById("userModalLabel").innerText =
    "Sửa thông tin người dùng";
  document.getElementById("userFullname").value = u.fullname;
  document.getElementById("userEmail").value = u.email;
  document.getElementById("userRole").value = u.role;
  new bootstrap.Modal(document.getElementById("userModal")).show();
}

async function saveUser() {
  const u = {
    fullname: userFullname.value.trim(),
    email: userEmail.value.trim(),
    role: userRole.value.trim(),
  };
  if (!u.fullname || !u.email)
    return alert("⚠️ Vui lòng nhập đầy đủ thông tin!");

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("userModal")
  );

  try {
    await fetch(`${USER_API}/${currentEditId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u),
    });
    alert("✅ Đã cập nhật người dùng!");
    modal.hide();
    loadUsers();
  } catch (err) {
    console.error("Lỗi lưu người dùng:", err);
    alert("❌ Không thể cập nhật người dùng!");
  }
}

// ============ CHẠY KHI MỞ TRANG ============
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadUsers();
});

// ============ HÀM HỖ TRỢ ============
function formatCurrency(n) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
// ============ ĐƠN HÀNG ============
async function loadOrders() {
  const tbody = document.getElementById("ordersTableBody");
  try {
    const res = await fetch(ORDER_API);
    allOrders = await res.json();
    tbody.innerHTML = allOrders
      .map(
        (o) => `
      <tr>
        <td>${o.id}</td>
        <td>${o.customer?.fullname || "Không rõ"}</td>
        <td>${o.items
          .map((i) => `${i.name} (x${i.quantity})`)
          .join("<br>")}</td>
        <td>${o.customer?.address || ""}</td>
        <td>${formatCurrency(o.total || 0)}</td>
        <td>${o.customer?.note || ""}</td>
        <td>
          <select class="form-select form-select-sm" onchange="updateOrderStatus('${
            o.id
          }', this.value)">
            ${["Chờ xử lý", "Đang giao", "Hoàn tất", "Đã hủy"]
              .map(
                (s) =>
                  `<option value="${s}" ${
                    o.status === s ? "selected" : ""
                  }>${s}</option>`
              )
              .join("")}
          </select>
        </td>
      </tr>
    `
      )
      .join("");
  } catch {
    tbody.innerHTML = `<tr><td colspan="7">Không thể tải dữ liệu!</td></tr>`;
  }
}

async function updateOrderStatus(id, status) {
  await fetch(`${ORDER_API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  alert("✅ Đã cập nhật trạng thái!");
}

// ============ CHUNG ============
function showSection(section) {
  ["product", "user", "order"].forEach((s) => {
    document.getElementById(`${s}Section`).style.display =
      s === section ? "block" : "none";
    document
      .getElementById(`btn${s.charAt(0).toUpperCase() + s.slice(1)}`)
      .classList.toggle("active", s === section);
  });
  if (section === "user") loadUsers();
  if (section === "order") loadOrders();
}

function formatCurrency(num) {
  return Number(num).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

function logout() {
  if (confirm("Đăng xuất tài khoản quản trị?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

// ============ KHỞI TẠO ============
document.addEventListener("DOMContentLoaded", () => {
  const u = JSON.parse(localStorage.getItem("currentUser"));
  if (!u || u.role !== "admin") {
    alert("Bạn không có quyền truy cập!");
    location.href = "login.html";
  } else {
    loadProducts();
  }
});
