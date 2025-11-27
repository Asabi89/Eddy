import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { restaurants as initialRestaurants } from '../data/restaurants';
import { menuItems as initialProducts } from '../data/menuItems';
import { categories as initialCategories } from '../constants';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // Data States
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]); // Restaurants/Entreprises
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    // Auth State
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ... existing drivers state ...
    const [drivers, setDrivers] = useState([
        { id: 'd1', name: 'Jean Livreur', status: 'available', phone: '+229 60000001' },
        { id: 'd2', name: 'Paul Express', status: 'busy', phone: '+229 60000002' },
    ]);
    const [userMode, setUserMode] = useState('client');
    // Note: userMode is kept for legacy/demo switching in Profile, but 'user.role' will be the source of truth for auth flow.

    // ... existing loadData ...

    // Auth Operations
    const login = async (email, password, role = 'client') => {
        // Mock Login
        const mockUser = {
            id: 'u' + Date.now(),
            email,
            name: email.split('@')[0],
            role,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        setUserMode(role); // Sync legacy mode
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    };

    const signup = async (userData) => {
        // Mock Signup
        const mockUser = {
            id: 'u' + Date.now(),
            ...userData,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        setUserMode(userData.role); // Sync legacy mode
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    };

    const logout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        setUserMode('client');
        await AsyncStorage.removeItem('user');
    };

    // Update loadData to check for user
    /* ... inside loadData try block ... */
    // const storedUser = await AsyncStorage.getItem('user');
    // if (storedUser) {
    //   const parsedUser = JSON.parse(storedUser);
    //   setUser(parsedUser);
    //   setIsAuthenticated(true);
    //   setUserMode(parsedUser.role);
    // }

    const [isLoading, setIsLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    // Save cart changes
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isLoading]);

    const loadData = async () => {
        try {
            setIsLoading(true);

            // Try to load from storage
            const [
                storedCategories,
                storedCompanies,
                storedProducts,
                storedCart,
                storedOrders,
                storedDrivers,
                storedUser
            ] = await Promise.all([
                AsyncStorage.getItem('categories'),
                AsyncStorage.getItem('companies'),
                AsyncStorage.getItem('products'),
                AsyncStorage.getItem('cart'),
                AsyncStorage.getItem('orders'),
                AsyncStorage.getItem('drivers'),
                AsyncStorage.getItem('user'),
            ]);

            // Initialize User
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                setUserMode(parsedUser.role);
            }

            // Initialize Categories
            if (storedCategories) {
                setCategories(JSON.parse(storedCategories));
            } else {
                setCategories(initialCategories);
                await AsyncStorage.setItem('categories', JSON.stringify(initialCategories));
            }

            // Initialize Companies (Restaurants)
            if (storedCompanies) {
                setCompanies(JSON.parse(storedCompanies));
            } else {
                setCompanies(initialRestaurants);
                await AsyncStorage.setItem('companies', JSON.stringify(initialRestaurants));
            }

            // Initialize Products
            // Always update products from source of truth for development to show new images
            setProducts(initialProducts);
            await AsyncStorage.setItem('products', JSON.stringify(initialProducts));

            // Initialize Cart
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }

            // Initialize Orders
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            }

            // Initialize Drivers
            if (storedDrivers) {
                setDrivers(JSON.parse(storedDrivers));
            } else {
                await AsyncStorage.setItem('drivers', JSON.stringify(drivers));
            }

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Cart Operations
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((p) => p.id !== productId));
    };

    const updateCartQuantity = (productId, change) => {
        setCart((prev) =>
            prev.map((p) =>
                p.id === productId
                    ? { ...p, quantity: Math.max(0, p.quantity + change) }
                    : p
            ).filter((p) => p.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        AsyncStorage.removeItem('cart');
    };

    // Order Operations
    const placeOrder = async (customerDetails) => {
        const newOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending', // pending, accepted, preparing, ready, assigned, picked_up, delivering, delivered, cancelled
            customer: customerDetails || { name: 'Client Anonyme', address: 'Cotonou, Haie Vive' },
            driverId: null,
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
        clearCart();
        return newOrder;
    };

    const updateOrderStatus = async (orderId, status, driverId = null) => {
        const updatedOrders = orders.map(o => {
            if (o.id === orderId) {
                return {
                    ...o,
                    status,
                    ...(driverId ? { driverId } : {})
                };
            }
            return o;
        });
        setOrders(updatedOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    };

    // Vendor Operations
    const addProduct = async (product) => {
        const newProduct = { ...product, id: Date.now() };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
    };

    const setUserRole = async (role) => {
        setUserMode(role);
        if (user) {
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            try {
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (error) {
                console.error('Error updating user role:', error);
            }
        }
    };

    return (
        <DataContext.Provider
            value={{
                categories,
                companies,
                products,
                cart,
                orders,
                drivers,
                userMode,
                isLoading,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
                placeOrder,
                updateOrderStatus,
                addProduct,
                setUserRole,
                user,
                isAuthenticated,
                login,
                signup,
                logout
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
