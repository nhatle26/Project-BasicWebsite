// api.js - Cấu hình và xử lý API calls

// Base URL của JSON Server (thay đổi theo cấu hình của bạn)
const API_BASE_URL = 'http://localhost:3000';

// API Endpoints
const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    cart: `${API_BASE_URL}/cart`,
    users: `${API_BASE_URL}/users`,
};

// API Helper Functions
const API = {
    // GET request
    async get(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('GET Error:', error);
            throw error;
        }
    },

    // POST request
    async post(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('POST Error:', error);
            throw error;
        }
    },

    // PATCH request
    async patch(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('PATCH Error:', error);
            throw error;
        }
    },

    // DELETE request
    async delete(url) {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('DELETE Error:', error);
            throw error;
        }
    },
};

// ===== PRODUCTS API =====
const ProductsAPI = {
    // Lấy tất cả sản phẩm
    async getAll() {
        return await API.get(API_ENDPOINTS.products);
    },

    // Lấy sản phẩm theo ID
    async getById(id) {
        return await API.get(`${API_ENDPOINTS.products}/${id}`);
    },

    // Thêm sản phẩm mới (admin)
    async create(productData) {
        return await API.post(API_ENDPOINTS.products, productData);
    },

    // Cập nhật sản phẩm (admin)
    async update(id, productData) {
        return await API.patch(`${API_ENDPOINTS.products}/${id}`, productData);
    },

    // Xóa sản phẩm (admin)
    async delete(id) {
        return await API.delete(`${API_ENDPOINTS.products}/${id}`);
    },
};

// ===== CART API =====
const CartAPI = {
    // Lấy tất cả items trong giỏ hàng
    async getAll() {
        return await API.get(API_ENDPOINTS.cart);
    },

    // Thêm sản phẩm vào giỏ
    async add(cartItem) {
        return await API.post(API_ENDPOINTS.cart, cartItem);
    },

    // Cập nhật số lượng
    async updateQuantity(id, quantity) {
        return await API.patch(`${API_ENDPOINTS.cart}/${id}`, { quantity });
    },

    // Xóa item khỏi giỏ
    async remove(id) {
        return await API.delete(`${API_ENDPOINTS.cart}/${id}`);
    },

    // Xóa toàn bộ giỏ hàng
    async clear() {
        const items = await this.getAll();
        const deletePromises = items.map(item => this.remove(item.id));
        return await Promise.all(deletePromises);
    },
};

// ===== USERS API =====
const UsersAPI = {
    // Đăng ký người dùng mới
    async register(userData) {
        return await API.post(API_ENDPOINTS.users, userData);
    },

    // Đăng nhập (kiểm tra email & password)
    async login(email, password) {
        const url = `${API_ENDPOINTS.users}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        const users = await API.get(url);
        
        if (users.length > 0) {
            return users[0]; // Trả về user đầu tiên tìm thấy
        } else {
            throw new Error('Email hoặc mật khẩu không đúng');
        }
    },

    // Kiểm tra email đã tồn tại chưa
    async checkEmailExists(email) {
        const url = `${API_ENDPOINTS.users}?email=${encodeURIComponent(email)}`;
        const users = await API.get(url);
        return users.length > 0;
    },

    // Lấy thông tin user theo ID
    async getById(id) {
        return await API.get(`${API_ENDPOINTS.users}/${id}`);
    },
};