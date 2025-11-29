import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your server IP when running on device
const API_BASE_URL = 'http://192.168.1.21:8000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = null;
  }

  async getToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('accessToken');
    }
    return this.token;
  }

  hasValidToken() {
    return !!this.token;
  }

  async loadTokenFromStorage() {
    this.token = await AsyncStorage.getItem('accessToken');
    return !!this.token;
  }

  async setTokens(tokens) {
    this.token = tokens.access;
    await AsyncStorage.setItem('accessToken', tokens.access);
    await AsyncStorage.setItem('refreshToken', tokens.refresh);
  }

  async clearTokens() {
    this.token = null;
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      console.log(`API Response: ${response.status} ${endpoint}`);
      
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.token}`;
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, { ...config, headers });
          return this.handleResponse(retryResponse);
        } else {
          await this.clearTokens();
          throw new Error('Session expired');
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      console.log('API Error Response:', JSON.stringify(data));
      const errorMsg = data.detail || data.error || 
        (typeof data === 'object' ? JSON.stringify(data) : 'Request failed');
      throw new Error(errorMsg);
    }
    return data;
  }

  async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.access;
        await AsyncStorage.setItem('accessToken', data.access);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ==================== AUTH ====================
  
  async login(email, password) {
    console.log('API login called:', email);
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: { email, password },
    });
    console.log('API login success:', data.user);
    await this.setTokens(data.tokens);
    return data.user;
  }

  async register(userData) {
    console.log('API register called:', userData.email);
    const data = await this.request('/auth/register/', {
      method: 'POST',
      body: userData,
    });
    console.log('API register success:', data.user);
    await this.setTokens(data.tokens);
    return data.user;
  }

  async logout() {
    console.log('API logout called');
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken && this.token) {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: { refresh: refreshToken },
        });
      }
    } catch (error) {
      console.log('Logout API error (ignoring):', error.message);
    }
    await this.clearTokens();
  }

  async getProfile() {
    return this.request('/auth/profile/');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile/', {
      method: 'PATCH',
      body: userData,
    });
  }

  // ==================== CATEGORIES ====================

  async getCategories() {
    return this.request('/categories/');
  }

  // ==================== RESTAURANTS ====================

  async getRestaurants() {
    return this.request('/restaurants/');
  }

  async getRestaurant(id) {
    return this.request(`/restaurants/${id}/`);
  }

  async getRestaurantsByCategory(categoryId) {
    return this.request(`/restaurants/by_category/?category_id=${categoryId}`);
  }

  async getFeaturedRestaurants() {
    return this.request('/restaurants/featured/');
  }

  // ==================== PRODUCTS ====================

  async getProducts() {
    return this.request('/products/');
  }

  async getProduct(id) {
    return this.request(`/products/${id}/`);
  }

  async getProductsByRestaurant(restaurantId) {
    return this.request(`/products/by_restaurant/?restaurant_id=${restaurantId}`);
  }

  async getPopularProducts() {
    return this.request('/products/popular/');
  }

  async getFeaturedProducts() {
    return this.request('/products/featured/');
  }

  // ==================== CART ====================

  async getCart() {
    return this.request('/cart/');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/items/', {
      method: 'POST',
      body: { product_id: productId, quantity },
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request('/cart/items/', {
      method: 'PUT',
      body: { product_id: productId, quantity },
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/items/?product_id=${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/items/', {
      method: 'DELETE',
    });
  }

  // ==================== ORDERS ====================

  async getOrders() {
    return this.request('/orders/');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}/`);
  }

  async createOrder(orderData) {
    return this.request('/orders/create_from_cart/', {
      method: 'POST',
      body: orderData,
    });
  }

  async updateOrderStatus(orderId, status, driverId = null) {
    return this.request(`/orders/${orderId}/update_status/`, {
      method: 'POST',
      body: { status, driver_id: driverId },
    });
  }

  async getPendingOrders() {
    return this.request('/orders/pending/');
  }

  // ==================== DRIVER ====================

  async getDriverSchedule() {
    return this.request('/driver/schedule/my_schedule/');
  }

  async updateDriverDay(day, updates) {
    const payload = { day, ...updates };
    console.log('updateDriverDay payload:', JSON.stringify(payload));
    return this.request('/driver/schedule/update_day/', {
      method: 'POST',
      body: payload,
    });
  }

  async toggleDriverAvailability() {
    return this.request('/driver/schedule/toggle_availability/', {
      method: 'POST',
    });
  }

  async getDriverMissions() {
    return this.request('/driver/missions/');
  }

  async getDriverDashboard() {
    return this.request('/driver/dashboard/');
  }

  // ==================== MANAGER ====================

  async getManagerDashboard() {
    return this.request('/manager/dashboard/');
  }

  async getManagerRestaurant() {
    return this.request('/manager/restaurant/');
  }

  // ==================== BANNERS & SETTINGS ====================

  async getBanners() {
    return this.request('/banners/');
  }

  async getAppSettings() {
    return this.request('/settings/');
  }

  // ==================== IMAGE UPLOAD ====================

  async uploadImage(uri, type = 'product') {
    const token = await this.getToken();
    
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('image', {
      uri,
      name: filename,
      type: fileType,
    });
    formData.append('type', type);

    const response = await fetch(`${this.baseUrl}/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async updateProductImage(productId, imageUri) {
    const token = await this.getToken();
    
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: fileType,
    });

    const response = await fetch(`${this.baseUrl}/products/${productId}/upload_image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async updateRestaurantImage(restaurantId, imageUri) {
    const token = await this.getToken();
    
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: fileType,
    });

    const response = await fetch(`${this.baseUrl}/restaurants/${restaurantId}/upload_image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async updateBannerImage(bannerId, imageUri) {
    const token = await this.getToken();
    
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: fileType,
    });

    const response = await fetch(`${this.baseUrl}/banners/${bannerId}/upload_image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    return this.handleResponse(response);
  }
  }

export const api = new ApiService();
export default api;
