async function trackOrder() {
  const id = document.getElementById('orderId').value.trim();
  if (!id) return alert('Vui lòng nhập mã đơn hàng.');

  const res = await fetch(`http://localhost:3000/orders/${id}`);
  if (!res.ok) return alert('Không tìm thấy đơn hàng.');

  const order = await res.json();
  document.getElementById('result').innerHTML = `
    <p><strong>Mã đơn:</strong> ${order.id}</p>
    <p><strong>Trạng thái:</strong> ${order.status}</p>
    <p><strong>Ngày tạo:</strong> ${order.date}</p>
  `;
}
