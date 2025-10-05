
        let currentProduct = null;

        document.addEventListener('DOMContentLoaded', async function() {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            
            currentProduct = await ProductsAPI.getById(productId);
            // Render...
        });

        async function addToCart() {
            if (!window.auth.isLoggedIn()) {
                alert('Vui lòng đăng nhập!');
                window.location.href = 'login.html';
                return;
            }

            const user = window.auth.getCurrentUser();
            await CartAPI.add({
                userId: user.id,
                productId: currentProduct.id,
                productName: currentProduct.name,
                price: currentProduct.price,
                quantity: 1
            });
            alert('Đã thêm vào giỏ hàng!');
        }