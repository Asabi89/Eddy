import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // Data States
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [banners, setBanners] = useState([]);
    
    // Auth State
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Driver State
    const [driverAvailability, setDriverAvailability] = useState(true);
    const [driverSchedule, setDriverSchedule] = useState({});
    const [drivers, setDrivers] = useState([
        { id: 'd1', name: 'Koffi Jean', phone: '+229 97 00 00 01', status: 'available' },
        { id: 'd2', name: 'Ahou Marie', phone: '+229 97 00 00 02', status: 'available' },
        { id: 'd3', name: 'Dossou Paul', phone: '+229 97 00 00 03', status: 'busy' },
    ]);
    
    // Team State - loaded from backend for each manager's restaurant
    const [teamMembers, setTeamMembers] = useState([]);
    
    // Restaurant State
    const [restaurant, setRestaurant] = useState({
        id: 'r1',
        name: 'Mon Restaurant',
        address: 'Cotonou, Bénin',
        phone: '+229 97 00 00 00',
        deliveryTime: '30-45 min',
        deliveryFee: 500,
        isOpen: true,
    });
    
    // Location State
    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    
    // Loading States
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [hasApiToken, setHasApiToken] = useState(false);

    // Load initial data
    useEffect(() => {
        loadData();
        loadLocation();
    }, []);

    // Location Functions
    const loadLocation = async () => {
        try {
            setLocationLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permission denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            
            // Reverse geocoding to get address
            const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
            
            const address = geocode 
                ? `${geocode.street || ''} ${geocode.name || ''}, ${geocode.city || geocode.subregion || ''}`
                : 'Position actuelle';
            
            setUserLocation({
                latitude,
                longitude,
                address: address.trim(),
                city: geocode?.city || geocode?.subregion || 'Bénin',
            });
        } catch (error) {
            console.log('Error getting location:', error);
            setUserLocation({
                address: 'Cotonou, Bénin',
                city: 'Cotonou',
            });
        } finally {
            setLocationLoading(false);
        }
    };

    const refreshLocation = async () => {
        await loadLocation();
    };

    const loadData = async () => {
        try {
            setIsLoading(true);

            // Check for stored user and token
            const storedUser = await AsyncStorage.getItem('user');
            const hasToken = await api.loadTokenFromStorage();
            
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                setHasApiToken(hasToken);
            }

            // Try to fetch from API
            try {
                const [categoriesData, restaurantsData, productsData, bannersData] = await Promise.all([
                    api.getCategories(),
                    api.getRestaurants(),
                    api.getPopularProducts(),
                    api.getBanners(),
                ]);

                setCategories(categoriesData.results || categoriesData);
                setCompanies(restaurantsData.results || restaurantsData);
                setProducts(productsData.results || productsData);
                setBanners(bannersData.results || bannersData);
                setIsOnline(true);

                // Cache data locally
                await AsyncStorage.setItem('categories', JSON.stringify(categoriesData.results || categoriesData));
                await AsyncStorage.setItem('companies', JSON.stringify(restaurantsData.results || restaurantsData));
                await AsyncStorage.setItem('products', JSON.stringify(productsData.results || productsData));

            } catch (apiError) {
                console.log('API unavailable, loading cached data:', apiError.message);
                setIsOnline(false);
                
                // Load from cache
                const [cachedCategories, cachedCompanies, cachedProducts] = await Promise.all([
                    AsyncStorage.getItem('categories'),
                    AsyncStorage.getItem('companies'),
                    AsyncStorage.getItem('products'),
                ]);

                if (cachedCategories) setCategories(JSON.parse(cachedCategories));
                if (cachedCompanies) setCompanies(JSON.parse(cachedCompanies));
                if (cachedProducts) setProducts(JSON.parse(cachedProducts));
            }

            // Load cart (always from local for offline support)
            const storedCart = await AsyncStorage.getItem('cart');
            if (storedCart) setCart(JSON.parse(storedCart));

            // Load orders from cache
            const storedOrders = await AsyncStorage.getItem('orders');
            if (storedOrders) setOrders(JSON.parse(storedOrders));

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auth Operations
    const login = async (email, password, role = 'client') => {
        try {
            const userData = await api.login(email, password);
            setUser(userData);
            setIsAuthenticated(true);
            setHasApiToken(true);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            
            // Load user-specific data
            if (userData.role === 'driver') {
                loadDriverData();
            } else if (userData.role === 'manager') {
                loadManagerRestaurant();
            }
            
            return userData;
        } catch (error) {
            // Check if it's a network error (offline) vs authentication error
            const isNetworkError = error.message === 'Network request failed' || 
                                   error.message.includes('fetch') ||
                                   error.message.includes('network');
            
            if (isNetworkError) {
                console.log('Network error, using offline mode');
                const mockUser = {
                    id: 'u' + Date.now(),
                    email,
                    username: email.split('@')[0],
                    first_name: email.split('@')[0],
                    role,
                };
                setUser(mockUser);
                setIsAuthenticated(true);
                setHasApiToken(false);
                await AsyncStorage.setItem('user', JSON.stringify(mockUser));
                return mockUser;
            }
            
            // For authentication errors, throw so the UI can display them
            console.log('Login error:', error.message);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const newUser = await api.register(userData);
            setUser(newUser);
            setIsAuthenticated(true);
            setHasApiToken(true);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
            
            // Load user-specific data after signup
            if (newUser.role === 'driver') {
                loadDriverData();
            } else if (newUser.role === 'manager') {
                loadManagerRestaurant();
            }
            
            return newUser;
        } catch (error) {
            // Check if it's a network error (offline) vs validation error
            const isNetworkError = error.message === 'Network request failed' || 
                                   error.message.includes('fetch') ||
                                   error.message.includes('network');
            
            if (isNetworkError) {
                console.log('Network error, using offline mode');
                const mockUser = {
                    id: 'u' + Date.now(),
                    ...userData,
                };
                setUser(mockUser);
                setIsAuthenticated(true);
                setHasApiToken(false);
                await AsyncStorage.setItem('user', JSON.stringify(mockUser));
                return mockUser;
            }
            
            // For validation/server errors, throw so the UI can display them
            console.log('Signup error:', error.message);
            throw error;
        }
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
        setIsAuthenticated(false);
        setHasApiToken(false);
        // Clear manager-specific data
        setProducts([]);
        setBanners([]);
        setTeamMembers([]);
        setRestaurant({
            id: 'r1',
            name: 'Mon Restaurant',
            address: 'Cotonou, Bénin',
            phone: '+229 97 00 00 00',
            deliveryTime: '30-45 min',
            deliveryFee: 500,
            isOpen: true,
        });
        await AsyncStorage.removeItem('user');
    };

    // Manager Data
    const loadManagerRestaurant = async () => {
        try {
            const restaurantData = await api.getManagerRestaurant();
            console.log('Loaded manager restaurant:', restaurantData.name);
            
            setRestaurant({
                id: restaurantData.id,
                name: restaurantData.name,
                address: restaurantData.address,
                phone: restaurantData.phone || '',
                deliveryTime: restaurantData.delivery_time,
                deliveryFee: restaurantData.delivery_fee,
                isOpen: restaurantData.is_open,
            });
            
            // Load restaurant's products (from the detailed response)
            if (restaurantData.products) {
                setProducts(restaurantData.products);
            }
            
            // Load restaurant's banners
            loadManagerBanners(restaurantData.id);
            
            // Load team members for this restaurant
            loadTeamMembers();
        } catch (error) {
            console.log('Could not load manager restaurant:', error.message);
        }
    };

    const loadTeamMembers = async () => {
        try {
            const members = await api.request('/team/');
            setTeamMembers(members.results || members);
        } catch (error) {
            console.log('Could not load team members');
        }
    };

    const loadManagerBanners = async (restaurantId) => {
        try {
            const allBanners = await api.request('/banners/');
            const restaurantBanners = (allBanners.results || allBanners).filter(
                b => b.restaurant === restaurantId
            );
            setBanners(restaurantBanners);
        } catch (error) {
            console.log('Could not load banners');
        }
    };

    // Driver Data
    const loadDriverData = async () => {
        try {
            const schedule = await api.getDriverSchedule();
            const scheduleMap = {};
            schedule.forEach(s => {
                scheduleMap[s.day] = {
                    enabled: s.is_enabled,
                    startTime: s.start_time,
                    endTime: s.end_time,
                };
            });
            console.log('Loaded driver schedule:', scheduleMap);
            setDriverSchedule(scheduleMap);
        } catch (error) {
            console.log('Could not load driver schedule:', error.message);
            // Initialize with default empty schedule
            const defaultSchedule = {
                monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
                tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
                wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
                thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
                friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
                saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
                sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
            };
            setDriverSchedule(defaultSchedule);
        }
    };

    const toggleDriverAvailability = async () => {
        const newAvailability = !driverAvailability;
        setDriverAvailability(newAvailability);
        try {
            await api.toggleDriverAvailability();
        } catch (error) {
            setDriverAvailability(!newAvailability);
            console.log('Failed to toggle driver availability:', error.message);
        }
    };

    const updateDriverSchedule = async (day, updates) => {
        console.log('updateDriverSchedule called:', day, updates);
        // Optimistic update
        const previousSchedule = driverSchedule[day];
        
        // Map API field names to frontend field names for local state
        const localUpdates = {};
        if ('is_enabled' in updates) localUpdates.enabled = updates.is_enabled;
        if ('enabled' in updates) localUpdates.enabled = updates.enabled;
        if ('start_time' in updates) localUpdates.startTime = updates.start_time;
        if ('startTime' in updates) localUpdates.startTime = updates.startTime;
        if ('end_time' in updates) localUpdates.endTime = updates.end_time;
        if ('endTime' in updates) localUpdates.endTime = updates.endTime;
        
        setDriverSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], ...localUpdates }
        }));
        
        try {
            // Map frontend field names to backend field names for the API
            const apiUpdates = {};
            if ('enabled' in localUpdates) apiUpdates.is_enabled = localUpdates.enabled;
            if ('startTime' in localUpdates) apiUpdates.start_time = localUpdates.startTime;
            if ('endTime' in localUpdates) apiUpdates.end_time = localUpdates.endTime;
            
            console.log('Sending apiUpdates:', apiUpdates);
            await api.updateDriverDay(day, apiUpdates);
            console.log('Schedule update successful');
        } catch (error) {
            // Revert on error
            setDriverSchedule(prev => ({
                ...prev,
                [day]: previousSchedule
            }));
            console.log('Could not update schedule:', error.message);
        }
    };

    const toggleDayAvailability = async (day) => {
        const newEnabled = !driverSchedule[day]?.enabled;
        await updateDriverSchedule(day, { is_enabled: newEnabled });
    };

    // Save cart changes locally
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isLoading]);

    // Cart Operations
    const addToCart = async (product) => {
        // Update local state immediately
        setCart((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        // Sync with API only if we have a valid API token
        if (isOnline && hasApiToken) {
            try {
                await api.addToCart(product.id, 1);
            } catch (error) {
                console.log('Could not sync cart with server');
            }
        }
    };

    const removeFromCart = async (productId) => {
        setCart((prev) => prev.filter((p) => p.id !== productId));
        
        if (isOnline && hasApiToken) {
            try {
                await api.removeFromCart(productId);
            } catch (error) {
                console.log('Could not sync cart with server');
            }
        }
    };

    const updateCartQuantity = async (productId, change) => {
        setCart((prev) =>
            prev.map((p) =>
                p.id === productId
                    ? { ...p, quantity: Math.max(0, p.quantity + change) }
                    : p
            ).filter((p) => p.quantity > 0)
        );

        if (isOnline && hasApiToken) {
            try {
                const item = cart.find(p => p.id === productId);
                if (item) {
                    await api.updateCartItem(productId, item.quantity + change);
                }
            } catch (error) {
                console.log('Could not sync cart with server');
            }
        }
    };

    const clearCart = async () => {
        setCart([]);
        await AsyncStorage.removeItem('cart');
        
        if (isOnline && hasApiToken) {
            try {
                await api.clearCart();
            } catch (error) {
                console.log('Could not sync cart with server');
            }
        }
    };

    // Order Operations
    const placeOrder = async (customerDetails) => {
        try {
            if (isOnline && hasApiToken) {
                const order = await api.createOrder(customerDetails);
                setOrders(prev => [order, ...prev]);
                clearCart();
                return order;
            }
        } catch (error) {
            console.log('API order failed, creating local order');
        }

        // Fallback to local order
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 500;
        const newOrder = {
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            items: cart.map(item => ({
                product_name: item.name,
                product_price: item.price,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
            })),
            total: subtotal + deliveryFee,
            delivery_fee: deliveryFee,
            status: 'pending',
            customer_name: customerDetails.customer_name,
            customer_phone: customerDetails.customer_phone,
            delivery_address: customerDetails.delivery_address,
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
        clearCart();
        return newOrder;
    };

    const updateOrderStatus = async (orderId, status, driverId = null) => {
        try {
            if (isOnline) {
                await api.updateOrderStatus(orderId, status, driverId);
            }
        } catch (error) {
            console.log('Could not update order status on server');
        }

        const updatedOrders = orders.map(o => {
            if (o.id === orderId) {
                return { ...o, status, ...(driverId ? { driver_id: driverId } : {}) };
            }
            return o;
        });
        setOrders(updatedOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    };

    // Refresh data from API
    const refreshData = async () => {
        await loadData();
    };

    // Product Management
    const addProduct = async (productData) => {
        console.log('addProduct called:', { isOnline, hasApiToken, productData, restaurantId: restaurant.id });
        
        const newProduct = {
            id: 'p' + Date.now(),
            ...productData,
            restaurant: restaurant.id,
            is_available: true,
            created_at: new Date().toISOString(),
        };
        setProducts(prev => [newProduct, ...prev]);
        
        if (isOnline && hasApiToken) {
            try {
                console.log('Sending POST to /products/');
                // Only send fields the backend expects (restaurant is auto-assigned)
                const response = await api.request('/products/', {
                    method: 'POST',
                    body: {
                        name: productData.name,
                        description: productData.description || '',
                        price: productData.price,
                    },
                });
                console.log('Product created on server:', response);
                
                // Upload image if provided and is a local file
                if (productData.image && productData.image.startsWith('file://')) {
                    try {
                        console.log('Uploading product image...');
                        await api.updateProductImage(response.id, productData.image);
                        console.log('Product image uploaded');
                    } catch (imageError) {
                        console.log('Failed to upload product image:', imageError.message);
                    }
                }
                
                // Update local product with server ID
                setProducts(prev => prev.map(p => 
                    p.id === newProduct.id ? { ...p, id: response.id } : p
                ));
                return response;
            } catch (error) {
                console.log('Could not sync product with server:', error.message);
            }
        } else {
            console.log('Skipping API sync - isOnline:', isOnline, 'hasApiToken:', hasApiToken);
        }
        
        return newProduct;
    };

    const updateProduct = async (productId, updates) => {
        console.log('updateProduct called:', { productId, updates, isOnline, hasApiToken });
        
        setProducts(prev => prev.map(p => 
            p.id === productId ? { ...p, ...updates } : p
        ));
        
        if (isOnline && hasApiToken) {
            try {
                // Separate image from other fields
                const { image, ...otherUpdates } = updates;
                
                // Update text fields first
                if (Object.keys(otherUpdates).length > 0) {
                    console.log(`Sending PATCH to /products/${productId}/`);
                    await api.request(`/products/${productId}/`, {
                        method: 'PATCH',
                        body: otherUpdates,
                    });
                    console.log('Product updated on server');
                }
                
                // If image is a local file, upload it separately
                if (image && image.startsWith('file://')) {
                    console.log('Uploading product image...');
                    await api.updateProductImage(productId, image);
                    console.log('Product image uploaded');
                }
            } catch (error) {
                console.log('Could not update product on server:', error.message);
            }
        } else {
            console.log('Skipping API sync - isOnline:', isOnline, 'hasApiToken:', hasApiToken);
        }
    };

    const deleteProduct = async (productId) => {
        console.log('deleteProduct called:', { productId, isOnline, hasApiToken });
        
        setProducts(prev => prev.filter(p => p.id !== productId));
        
        if (isOnline && hasApiToken) {
            try {
                console.log(`Sending DELETE to /products/${productId}/`);
                await api.request(`/products/${productId}/`, {
                    method: 'DELETE',
                });
                console.log('Product deleted on server');
            } catch (error) {
                console.log('Could not delete product on server:', error.message);
            }
        } else {
            console.log('Skipping API sync - isOnline:', isOnline, 'hasApiToken:', hasApiToken);
        }
    };

    // Update user profile
    const loadProfile = async () => {
    try {
        const profileData = await api.getProfile();
        console.log('Loaded profile:', profileData);
        setUser(profileData);
        await AsyncStorage.setItem('user', JSON.stringify(profileData));
        
        // Load driver dashboard stats if user is a driver
        if (profileData.role === 'driver') {
            try {
                const dashboardData = await api.getDriverDashboard();
                console.log('Loaded driver dashboard:', dashboardData);
                // Store dashboard stats in user object
                const userWithStats = { 
                    ...profileData, 
                    deliveries: dashboardData.deliveries || 0,
                    rating: dashboardData.rating || 0,
                    thisMonth: dashboardData.this_month || 0,
                };
                setUser(userWithStats);
                await AsyncStorage.setItem('user', JSON.stringify(userWithStats));
            } catch (dashError) {
                console.log('Could not load driver dashboard:', dashError.message);
            }
        }
    } catch (error) {
        console.log('Could not load profile:', error.message);
    }
};

const updateProfile = async (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (isOnline && hasApiToken) {
            try {
                await api.updateProfile(updates);
            } catch (error) {
                console.log('Could not update profile on server');
            }
        }
        
        return updatedUser;
    };

    // Banner Management
    const addBanner = async (bannerData) => {
        const newBanner = {
            id: 'b' + Date.now(),
            ...bannerData,
            restaurant: restaurant.id,
            is_active: true,
            order: banners.length,
        };
        setBanners(prev => [...prev, newBanner]);
        
        if (isOnline && hasApiToken) {
            try {
                // Only send fields the backend expects (restaurant is auto-assigned)
                const response = await api.request('/banners/', {
                    method: 'POST',
                    body: {
                        title: bannerData.title,
                        subtitle: bannerData.subtitle || '',
                    },
                });
                
                // Upload image if provided and is a local file
                if (bannerData.image && bannerData.image.startsWith('file://')) {
                    try {
                        console.log('Uploading banner image...');
                        await api.updateBannerImage(response.id, bannerData.image);
                        console.log('Banner image uploaded');
                    } catch (imageError) {
                        console.log('Failed to upload banner image:', imageError.message);
                    }
                }
                
                return response;
            } catch (error) {
                console.log('Could not sync banner with server:', error.message);
            }
        }
        
        return newBanner;
    };

    const updateBanner = async (bannerId, updates) => {
        setBanners(prev => prev.map(b => 
            b.id === bannerId ? { ...b, ...updates } : b
        ));
        
        if (isOnline && hasApiToken) {
            try {
                await api.request(`/banners/${bannerId}/`, {
                    method: 'PATCH',
                    body: updates,
                });
            } catch (error) {
                console.log('Could not update banner on server');
            }
        }
    };

    const deleteBanner = async (bannerId) => {
        setBanners(prev => prev.filter(b => b.id !== bannerId));
        
        if (isOnline && hasApiToken) {
            try {
                await api.request(`/banners/${bannerId}/`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.log('Could not delete banner on server');
            }
        }
    };

    // Team Management
    const addTeamMember = async (memberData) => {
        const newMember = {
            id: 't' + Date.now(),
            ...memberData,
            status: 'active',
        };
        setTeamMembers(prev => [...prev, newMember]);
        
        if (isOnline && hasApiToken) {
            try {
                await api.request('/team/', {
                    method: 'POST',
                    body: memberData,
                });
            } catch (error) {
                console.log('Could not sync team member with server');
            }
        }
        
        return newMember;
    };

    const updateTeamMember = async (memberId, updates) => {
        setTeamMembers(prev => prev.map(m => 
            m.id === memberId ? { ...m, ...updates } : m
        ));
        
        if (isOnline && hasApiToken) {
            try {
                await api.request(`/team/${memberId}/`, {
                    method: 'PATCH',
                    body: updates,
                });
            } catch (error) {
                console.log('Could not update team member on server');
            }
        }
    };

    const deleteTeamMember = async (memberId) => {
        setTeamMembers(prev => prev.filter(m => m.id !== memberId));
        
        if (isOnline && hasApiToken) {
            try {
                await api.request(`/team/${memberId}/`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.log('Could not delete team member on server');
            }
        }
    };

    // Restaurant Management
    const updateRestaurant = async (updates) => {
        const updatedRestaurant = { ...restaurant, ...updates };
        setRestaurant(updatedRestaurant);
        
        if (isOnline && hasApiToken) {
            try {
                await api.request(`/restaurants/${restaurant.id}/`, {
                    method: 'PATCH',
                    body: updates,
                });
            } catch (error) {
                console.log('Could not update restaurant on server');
            }
        }
        
        return updatedRestaurant;
    };

    const toggleRestaurantOpen = async () => {
        const newStatus = !restaurant.isOpen;
        setRestaurant(prev => ({ ...prev, isOpen: newStatus }));
        
        if (isOnline && hasApiToken) {
            try {
                await api.request(`/restaurants/${restaurant.id}/toggle_open/`, {
                    method: 'POST',
                });
            } catch (error) {
                console.log('Could not toggle restaurant status on server');
            }
        }
        
        return newStatus;
    };

    // Fetch restaurant details with products
    const getRestaurantWithProducts = async (restaurantId) => {
        try {
            if (isOnline) {
                return await api.getRestaurant(restaurantId);
            }
        } catch (error) {
            console.log('Could not fetch restaurant details');
        }
        
        // Fallback to local data
        const restaurant = companies.find(r => r.id === restaurantId);
        const restaurantProducts = products.filter(p => p.restaurant === restaurantId);
        return { ...restaurant, products: restaurantProducts };
    };

    return (
        <DataContext.Provider
            value={{
                // Data
                categories,
                companies,
                products,
                cart,
                orders,
                banners,
                
                // Auth
                user,
                isAuthenticated,
                login,
                signup,
                logout,
                
                // Loading
                isLoading,
                isOnline,
                refreshData,
                
                // Cart
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
                
                // Orders
                placeOrder,
                updateOrderStatus,
                
                // Restaurant
                restaurant,
                getRestaurantWithProducts,
                updateRestaurant,
                toggleRestaurantOpen,
                
                // Products
                addProduct,
                updateProduct,
                deleteProduct,
                
                // Banners
                addBanner,
                updateBanner,
                deleteBanner,
                
                // Team
                teamMembers,
                addTeamMember,
                updateTeamMember,
                deleteTeamMember,
                
                // Profile
                loadProfile,
                updateProfile,
                
                // Driver
                drivers,
                driverAvailability,
                toggleDriverAvailability,
                driverSchedule,
                updateDriverSchedule,
                toggleDayAvailability,
                
                // Location
                userLocation,
                locationLoading,
                refreshLocation,
                
                // Legacy
                userMode: user?.role || 'client',
                setUserRole: async (role) => {
                    if (user) {
                        const updatedUser = { ...user, role };
                        setUser(updatedUser);
                        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                },
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
