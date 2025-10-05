
        document.addEventListener('DOMContentLoaded', async function() {
            if (!window.auth.requireLogin()) return;

            const user = window.auth.getCurrentUser();
            if (user.email !== 'admin@shopvn.com') {
                alert('Bạn không có quyền truy cập!');
                window.location.href = 'index.html';
                return;
            }

            await loadProducts();
        });

        document.getElementById('addProductForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newProduct = {
                name: document.getElementById('productName').value,
                price: parseInt(document.getElementById('productPrice').value),
                category: document.getElementById('productCategory').value,
                stock: 10
            };

            await ProductsAPI.create(newProduct);
            alert('Thêm sản phẩm thành công!');
            await loadProducts();
        });

        async function loadProducts() {
            const products = await ProductsAPI.getAll();
            // Render products list...
        }

        async function deleteProduct(productId) {
            if (confirm('Bạn có chắc muốn xóa?')) {
                await ProductsAPI.delete(productId);
                alert('Đã xóa!');
                await loadProducts();
            }
        }