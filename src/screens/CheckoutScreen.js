import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { MapPin, Phone, User, CreditCard, Wallet, Banknote, ArrowLeft, Check } from 'lucide-react-native';
import CustomModal from '../components/CustomModal';

export default function CheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cart, placeOrder, user, userLocation } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
  
  const [formData, setFormData] = useState({
    customer_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
    customer_phone: user?.phone || '',
    delivery_address: userLocation?.address || '',
    payment_method: 'cash',
    notes: '',
  });

  const deliveryFee = 500;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const paymentMethods = [
    { id: 'cash', label: 'Espèces', icon: Banknote, description: 'Payer à la livraison' },
    { id: 'mobile', label: 'Mobile Money', icon: Phone, description: 'MTN, Moov, Celtiis' },
    { id: 'card', label: 'Carte bancaire', icon: CreditCard, description: 'Visa, Mastercard' },
  ];

  const handleSubmit = async () => {
    if (!formData.customer_name.trim()) {
      setModal({ visible: true, type: 'warning', title: 'Nom requis', message: 'Veuillez entrer votre nom complet.' });
      return;
    }
    if (!formData.customer_phone.trim()) {
      setModal({ visible: true, type: 'warning', title: 'Téléphone requis', message: 'Veuillez entrer votre numéro de téléphone.' });
      return;
    }
    if (!formData.delivery_address.trim()) {
      setModal({ visible: true, type: 'warning', title: 'Adresse requise', message: 'Veuillez entrer votre adresse de livraison.' });
      return;
    }

    setIsLoading(true);
    try {
      await placeOrder({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        delivery_address: formData.delivery_address,
        notes: formData.notes,
        payment_method: formData.payment_method,
      });
      
      setModal({
        visible: true,
        type: 'success',
        title: 'Commande confirmée ! 🎉',
        message: 'Votre commande a été enregistrée. Vous serez notifié quand elle sera prête.',
        onConfirm: () => navigation.navigate('Commandes'),
      });
    } catch (error) {
      setModal({ visible: true, type: 'error', title: 'Erreur', message: 'Impossible de passer la commande. Réessayez.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finaliser la commande</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé de la commande</Text>
          <View style={styles.summaryCard}>
            {cart.map((item, index) => (
              <View key={item.id} style={[styles.summaryItem, index < cart.length - 1 && styles.itemBorder]}>
                <Text style={styles.itemQty}>{item.quantity}x</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()} F</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{subtotal.toLocaleString()} FCFA</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValue}>{deliveryFee.toLocaleString()} FCFA</Text>
            </View>
            <View style={[styles.summaryItem, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toLocaleString()} FCFA</Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de livraison</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={20} color={COLORS.textLight} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              placeholderTextColor={COLORS.textLight}
              value={formData.customer_name}
              onChangeText={(text) => setFormData({...formData, customer_name: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Phone size={20} color={COLORS.textLight} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
              value={formData.customer_phone}
              onChangeText={(text) => setFormData({...formData, customer_phone: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <MapPin size={20} color={COLORS.textLight} />
            </View>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Adresse de livraison complète"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={2}
              value={formData.delivery_address}
              onChangeText={(text) => setFormData({...formData, delivery_address: text})}
            />
          </View>

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Instructions spéciales (optionnel)"
            placeholderTextColor={COLORS.textLight}
            multiline
            numberOfLines={2}
            value={formData.notes}
            onChangeText={(text) => setFormData({...formData, notes: text})}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                formData.payment_method === method.id && styles.paymentOptionActive
              ]}
              onPress={() => setFormData({...formData, payment_method: method.id})}
            >
              <View style={styles.paymentIconContainer}>
                <method.icon size={24} color={formData.payment_method === method.id ? COLORS.primary : COLORS.textLight} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={[
                  styles.paymentLabel,
                  formData.payment_method === method.id && styles.paymentLabelActive
                ]}>{method.label}</Text>
                <Text style={styles.paymentDescription}>{method.description}</Text>
              </View>
              {formData.payment_method === method.id && (
                <View style={styles.checkIcon}>
                  <Check size={20} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.m }]}>
        <TouchableOpacity 
          style={[styles.orderButton, isLoading && styles.orderButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.textWhite} />
          ) : (
            <Text style={styles.orderButtonText}>
              Confirmer la commande • {total.toLocaleString()} FCFA
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Custom Modal */}
      <CustomModal
        visible={modal.visible}
        onClose={() => setModal({ ...modal, visible: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: SPACING.m,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemQty: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
    width: 30,
  },
  itemName: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  itemPrice: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.s,
  },
  summaryLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.s,
    paddingTop: SPACING.m,
  },
  totalLabel: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  totalValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.primary,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    padding: SPACING.m,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  input: {
    flex: 1,
    padding: SPACING.m,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  addressInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
  },
  paymentLabelActive: {
    color: COLORS.primary,
  },
  paymentDescription: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonDisabled: {
    opacity: 0.7,
  },
  orderButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 16,
  },
});
