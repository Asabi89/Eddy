// screens/CartScreen.js - Écran du panier
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CartScreen({ cart, updateCartItem, removeFromCart, deliveryFee = 500 }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon panier</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <MaterialIcons name="shopping-cart" size={64} color="#ddd" />
          <Text style={styles.emptyCartTitle}>Votre panier est vide</Text>
          <Text style={styles.emptyCartText}>
            Ajoutez des plats pour commencer votre commande
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Cart Items */}
          <View style={styles.itemsContainer}>
            <FlatList
              scrollEnabled={false}
              data={cart}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.cartItem,
                    index !== cart.length - 1 && styles.cartItemBorder,
                  ]}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                    <Text style={styles.itemPrice}>
                      {item.price.toLocaleString()} FCFA
                    </Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => updateCartItem(item.id, -1)}
                      style={styles.controlButton}
                    >
                      <MaterialIcons
                        name={item.quantity === 1 ? 'delete' : 'remove'}
                        size={16}
                        color="#666"
                      />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateCartItem(item.id, 1)}
                      style={styles.controlButton}
                    >
                      <MaterialIcons name="add" size={16} color="#16a34a" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemTotal}>
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>
                {subtotal.toLocaleString()} FCFA
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de livraison</Text>
              <Text style={styles.summaryValue}>
                {deliveryFee.toLocaleString()} FCFA
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {total.toLocaleString()} FCFA
              </Text>
            </View>

            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Passer la commande</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continuer mes achats</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 48,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cartItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotal: {
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 80,
    textAlign: 'right',
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTopY: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#16a34a',
  },
  orderButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
});
