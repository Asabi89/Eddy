import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ShoppingCart, User, FileText, Truck, Store, LayoutDashboard, Menu } from 'lucide-react-native';
import { COLORS, FONTS } from '../theme';
import { useData } from '../context/DataContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OrdersScreen from '../screens/OrdersScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import ManagerDashboardScreen from '../screens/ManagerDashboardScreen';
import DriverDashboardScreen from '../screens/DriverDashboardScreen';
import DriverScheduleScreen from '../screens/DriverScheduleScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';
import DriverProfileScreen from '../screens/DriverProfileScreen';
import ManagerProfileScreen from '../screens/ManagerProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.textLight,
  tabBarStyle: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 0,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabelStyle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
};

// --- Auth Stack ---
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// --- Client Navigation ---
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartMain" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="Accueil" 
        component={HomeStack}
        options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Commandes" 
        component={OrdersScreen}
        options={{ tabBarIcon: ({ color, size }) => <FileText color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Panier" 
        component={CartStack}
        options={{ tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ClientProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

// --- Manager Navigation ---
function ManagerTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="ManagerDashboard" 
        component={ManagerDashboardScreen}
        options={{ 
          title: 'Tableau de bord',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> 
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ManagerProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

// --- Driver Navigation ---
function DriverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverMain" component={DriverDashboardScreen} />
      <Stack.Screen name="DriverSchedule" component={DriverScheduleScreen} />
    </Stack.Navigator>
  );
}

function DriverTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="DriverDashboard" 
        component={DriverStack}
        options={{ 
          title: 'Missions',
          tabBarIcon: ({ color, size }) => <Truck color={color} size={size} /> 
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={DriverProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

// --- Admin Navigation ---
function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ 
          title: 'Admin',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> 
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isAuthenticated } = useData();

  // Force loading state check if needed, but assuming context handles it.
  // We render AuthStack if not authenticated.
  // If authenticated, we render the specific Role Tabs.

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {user?.role === 'manager' ? (
        <ManagerTabs />
      ) : user?.role === 'driver' ? (
        <DriverTabs />
      ) : user?.role === 'admin' ? (
        <AdminTabs />
      ) : (
        <ClientTabs />
      )}
    </NavigationContainer>
  );
}
