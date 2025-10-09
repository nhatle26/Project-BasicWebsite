
        // Render sản phẩm khi trang load
        document.addEventListener('DOMContentLoaded', function() {
            renderAllProducts();
            updateCartBadge();
            updateNavbar();
        });

        // Tìm kiếm sản phẩm
        function searchProducts() {
            const query = document.getElementById('searchInput').value;
            if (query.trim()) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }

        // Xử lý Enter trong search
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchProducts();
        });