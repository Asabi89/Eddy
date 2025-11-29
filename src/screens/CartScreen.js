import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react-native';

export default function CartScreen({ navigation }) {
  const { cart, updateCartQuantity, removeFromCart } = useData();
  const deliveryFee = 500; // Hardcoded for demo

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (cart.length > 0 ? deliveryFee : 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigation.navigate('Checkout');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Mon panier</Text>

        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <ShoppingCart size={64} color={COLORS.border} />
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
                      <Text style={styles.itemPrice}>
                        {item.price.toLocaleString()} FCFA
                      </Text>
                    </View>

                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        onPress={() => {
                            if(item.quantity === 1) removeFromCart(item.id);
                            else updateCartQuantity(item.id, -1);
                        }}
                        style={styles.controlButton}
                      >
                        {item.quantity === 1 ? (
                           <Trash2 size={16} color={COLORS.textLight} />
                        ) : (
                           <Minus size={16} color={COLORS.textLight} />
                        )}
                      </TouchableOpacity>
                      
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      
                      <TouchableOpacity
                        onPress={() => updateCartQuantity(item.id, 1)}
                        style={styles.controlButton}
                      >
                        <Plus size={16} color={COLORS.primary} />
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

              <TouchableOpacity style={styles.orderButton} onPress={handleCheckout}>
                <Text style={styles.orderButtonText}>Passer la commande</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => navigation.navigate('Accueil')}
              >
                <Text style={styles.continueButtonText}>Continuer mes achats</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.l,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingVertical: 48,
  },
  emptyCartTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  emptyCartText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SPACING.m,
  },
  content: {
    flex: 1,
  },
  itemsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.m,
    overflow: 'hidden',
  },
  cartItem: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  cartItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.text,
  },
  itemPrice: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  quantity: {
    fontFamily: FONTS.bold,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
    color: COLORS.text,
  },
  itemTotal: {
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 70,
    textAlign: 'right',
    color: COLORS.text,
  },
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.m,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.text,
  },
  totalValue: {
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  orderButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
});
