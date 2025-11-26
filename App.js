// App.js - Fichier principal de l'application
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import HomeScreen from './src/screens/HomeScreen';
import RestaurantsScreen from './src/screens/RestaurantsScreen';
import RestaurantDetailScreen from './src/screens/RestaurantDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import CartScreen from './src/screens/CartScreen';
import { SCREENS } from './src/constants';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.HOME);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from storage on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };
    if (!isLoading) {
      saveCart();
    }
  }, [cart, isLoading]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateCartItem = (id, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.HOME:
        return (
          <HomeScreen
            setCurrentScreen={setCurrentScreen}
            setSelectedRestaurant={setSelectedRestaurant}
          />
        );
      case SCREENS.RESTAURANTS:
        return (
          <RestaurantsScreen
            setCurrentScreen={setCurrentScreen}
            setSelectedRestaurant={setSelectedRestaurant}
          />
        );
      case SCREENS.RESTAURANT_DETAIL:
        if (!selectedRestaurant) {
          return (
            <HomeScreen
              setCurrentScreen={setCurrentScreen}
              setSelectedRestaurant={setSelectedRestaurant}
            />
          );
        }
        return (
          <RestaurantDetailScreen
            restaurant={selectedRestaurant}
            cart={cart}
            addToCart={addToCart}
            updateCartItem={updateCartItem}
          />
        );
      case SCREENS.LOGIN:
        return <LoginScreen />;
      case SCREENS.CART:
        return (
          <CartScreen
            cart={cart}
            updateCartItem={updateCartItem}
            removeFromCart={removeFromCart}
            deliveryFee={selectedRestaurant?.deliveryFee || 500}
          />
        );
      default:
        return (
          <HomeScreen
            setCurrentScreen={setCurrentScreen}
            setSelectedRestaurant={setSelectedRestaurant}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        cartItemsCount={cart.length}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      {renderScreen()}
      <Footer />
    </View>
  );
}
