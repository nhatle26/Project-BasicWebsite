async function trackOrder() {
  const id = document.getElementById("orderId").value.trim();
  if (!id) return alert("Vui lòng nhập mã đơn hàng.");

  const res = await fetch(`http://localhost:3000/orders/${id}`);
  if (!res.ok) return alert("Không tìm thấy đơn hàng.");
  const order = await res.json();
  document.getElementById("result").innerHTML = `
    <p><strong>Mã đơn:</strong> ${order.id}</p>
    <p><strong>Sản phẩm:</strong> ${order.items.map(item => item.name).join(', ')}</p>
    <p><strong>Tổng tiền:</strong> ${order.total} VND</p>
    <p><strong>Trạng thái:</strong> ${order.status}</p>
    <p><strong>Địa chỉ: </strong> ${order.customer.address}</p>
    <p><strong>Ngày tạo:</strong> ${order.date}</p>
  `;
}
// hàm sử dụng để hiển thị tất cả các đơn hàng của tài khoản hiện tại đang dùng 
async function displayUserOrders() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Vui lòng đăng nhập để xem đơn hàng!");
    return;
  }

  const user = JSON.parse(currentUser);
  const userEmail = user.email; // ✅ Lấy email người dùng hiện tại

  try {
    const res = await fetch(`http://localhost:3000/orders`);
    if (!res.ok) {
      alert("Không thể lấy thông tin đơn hàng.");
      return;
    }

    const allOrders = await res.json();
    // ✅ Lọc ra các đơn hàng có email trùng khớp
    const orders = allOrders.filter(
      (order) => order.customer?.email === userEmail
    );

    if (!orders.length) {
      document.getElementById("userOrderId").innerHTML =
        "<strong>Bạn chưa có đơn hàng nào.</strong>";
      return;
    }

    // ✅ Hiển thị danh sách đơn hàng chi tiết
    const orderListHTML = orders
      .map(
        (order) => `
        <div class="order-card" style="border:1px solid #ccc;padding:10px;margin:8px 0;border-radius:8px;">
          <p><strong>Mã đơn:</strong> ${order.id}</p>
          <p><strong>Sản phẩm:</strong> ${order.items.map((i) => i.name).join(", ")}</p>
          <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString("vi-VN")} ₫</p>
          <p><strong>Trạng thái:</strong> ${order.status}</p>
          <p><strong>Địa chỉ:</strong> ${order.customer?.address || "Không có"}</p>
          <p><strong>Ngày tạo:</strong> ${order.date}</p>
        </div>
      `
      )
      .join("");

    document.getElementById("userOrderId").innerHTML = `
      <strong>Các đơn hàng của bạn:</strong><br>${orderListHTML}
    `;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    alert("Đã xảy ra lỗi khi lấy dữ liệu.");
  }
}

document.addEventListener("DOMContentLoaded", displayUserOrders);

// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", displayUserOrders);
