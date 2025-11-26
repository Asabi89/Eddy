// screens/RestaurantDetailScreen.js - Écran détail du restaurant
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SectionList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { menuItems } from '../data/menuItems';

export default function RestaurantDetailScreen({
  restaurant,
  cart,
  addToCart,
  updateCartItem,
}) {
  // Guard clause: ensure restaurant exists
  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  const groupedMenu = menuItems
    .filter((item) => item.restaurantId === restaurant.id)
    .reduce((acc, item) => {
      const section = acc.find((s) => s.title === item.category);
      if (section) {
        section.data.push(item);
      } else {
        acc.push({ title: item.category, data: [item] });
      }
      return acc;
    }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDesc}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>{item.price.toLocaleString()} FCFA</Text>
      </View>
      <TouchableOpacity
        onPress={() => addToCart(item)}
        style={styles.menuItemButton}
      >
        <MaterialIcons name="add" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      {/* Restaurant Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={14} color="#eab308" />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
          </View>

          <Text style={styles.cuisine}>
            {restaurant.cuisine} • {restaurant.priceRange}
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={16} color="#16a34a" />
            <Text style={styles.infoText}>
              Livraison : {restaurant.deliveryTime} • {restaurant.distance} •{' '}
              {restaurant.deliveryFee} FCFA
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color="#16a34a" />
            <Text style={styles.infoText}>Rue 254, Cotonou</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Menu */}
        <View style={styles.menuSection}>
          <SectionList
            scrollEnabled={false}
            sections={groupedMenu}
            keyExtractor={(item, idx) => item.id.toString() + idx}
            renderItem={renderMenuItem}
            renderSectionHeader={renderSectionHeader}
          />
        </View>

        {/* Side Cart */}
        <View style={styles.cartSection}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>Votre commande</Text>
          </View>

          <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <Text style={styles.emptyCart}>Votre panier est vide</Text>
            ) : (
              cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      {item.quantity} x {item.price.toLocaleString()} FCFA
                    </Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => updateCartItem(item.id, -1)}
                      style={styles.quantityButton}
                    >
                      <MaterialIcons
                        name={item.quantity === 1 ? 'delete' : 'remove'}
                        size={14}
                        color="#666"
                      />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateCartItem(item.id, 1)}
                      style={styles.quantityButton}
                    >
                      <MaterialIcons name="add" size={14} color="#16a34a" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {cart.length > 0 && (
            <View style={styles.cartSummary}>
              <View style={styles.summaryRow}>
                <Text>Sous-total</Text>
                <Text>{cartTotal.toLocaleString()} FCFA</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Frais de livraison</Text>
                <Text>{restaurant.deliveryFee} FCFA</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  {(cartTotal + restaurant.deliveryFee).toLocaleString()} FCFA
                </Text>
              </View>
              <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Passer la commande</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 32,
  },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  menuSection: {
    flex: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
  },
  menuItemButton: {
    backgroundColor: '#16a34a',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    padding: 16,
  },
  cartHeader: {
    marginBottom: 12,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItems: {
    flex: 1,
    marginBottom: 12,
    maxHeight: 300,
  },
  emptyCart: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 24,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  cartSummary: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 13,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginBottom: 12,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#16a34a',
  },
  orderButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
