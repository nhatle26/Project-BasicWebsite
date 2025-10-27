async function trackOrder() {
  const id = document.getElementById("orderId").value.trim();
  if (!id) return alert("Vui lòng nhập mã đơn hàng.");

  const res = await fetch(`http://localhost:3000/orders/${id}`);
  if (!res.ok) return alert("Không tìm thấy đơn hàng.");
  const order = await res.json();
  document.getElementById("result").innerHTML = `
    <p><strong>Mã đơn:</strong> ${order.id}</p>
    <p><strong>Tổng tiền:</strong> ${order.total} VND</p>
    <p><strong>Trạng thái:</strong> ${order.status}</p>
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
  const userEmail = user.email;

  try {
    const res = await fetch(
      `http://localhost:3000/orders?userEmail=${userEmail}`
    );
    if (!res.ok) {
      alert("Không thể lấy thông tin đơn hàng.");
      return;
    }

    const orders = await res.json();
    const orderIds = orders.map((order) => order.id).join("<br>");

    document.getElementById("userOrderId").innerHTML = `
      <strong>Các mã đơn hàng của bạn:</strong> <br>${orderIds}
    `;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    alert("Đã xảy ra lỗi khi lấy dữ liệu.");
  }
}

// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", displayUserOrders);
