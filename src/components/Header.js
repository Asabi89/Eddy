// components/Header.js - Composant Header
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SCREENS } from '../constants';

export default function Header({ currentScreen, setCurrentScreen, cartItemsCount, showMenu, setShowMenu }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => setCurrentScreen(SCREENS.HOME)}
          style={styles.logoContainer}
        >
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>BE</Text>
          </View>
          <Text style={styles.logoName}>BeninEats</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un plat, un restaurant..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.navContainer}>
          <TouchableOpacity
            onPress={() => setCurrentScreen(SCREENS.RESTAURANTS)}
            style={styles.navButton}
          >
            <MaterialIcons name="restaurant" size={20} color="#333" />
            <Text style={styles.navText}>Restaurants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentScreen(SCREENS.CART)}
            style={styles.navButton}
          >
            <MaterialIcons name="shopping-cart" size={20} color="#333" />
            <Text style={styles.navText}>Panier</Text>
            {cartItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentScreen(SCREENS.LOGIN)}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Connexion</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <MaterialIcons name={showMenu ? "close" : "menu"} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity
            onPress={() => {
              setCurrentScreen(SCREENS.RESTAURANTS);
              setShowMenu(false);
            }}
            style={styles.mobileMenuItem}
          >
            <MaterialIcons name="restaurant" size={20} color="#333" />
            <Text style={styles.mobileMenuText}>Restaurants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCurrentScreen(SCREENS.CART);
              setShowMenu(false);
            }}
            style={styles.mobileMenuItem}
          >
            <MaterialIcons name="shopping-cart" size={20} color="#333" />
            <Text style={styles.mobileMenuText}>Panier ({cartItemsCount})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCurrentScreen(SCREENS.LOGIN);
              setShowMenu(false);
            }}
            style={[styles.mobileMenuItem, styles.mobileLoginButton]}
          >
            <Text style={styles.mobileLoginText}>Connexion</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  logoName: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: '#333',
    fontSize: 14,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navText: {
    marginLeft: 4,
    color: '#333',
    fontSize: 14,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#16a34a',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  mobileMenu: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  mobileMenuText: {
    marginLeft: 12,
    color: '#333',
    fontSize: 14,
  },
  mobileLoginButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  mobileLoginText: {
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },
});
