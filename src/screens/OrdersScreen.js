import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { Package, CheckCircle, Clock } from 'lucide-react-native';

export default function OrdersScreen() {
  const { orders } = useData();

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return COLORS.success;
      case 'pending': return COLORS.secondary;
      case 'accepted': return COLORS.primary;
      default: return COLORS.textLight;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Livrée';
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      default: return status;
    }
  };

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Package size={64} color={COLORS.textLight} />
        <Text style={styles.emptyText}>Aucune commande passée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mes Commandes</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Commande #{String(item.id).slice(-6)}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.date}>
              {new Date(item.created_at || item.date).toLocaleDateString('fr-FR')} à {new Date(item.created_at || item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>

            <View style={styles.divider} />

            {item.items?.map((product, index) => (
              <View key={index} style={styles.productRow}>
                <Text style={styles.productText}>
                  {product.quantity}x {product.product_name || product.name}
                </Text>
                <Text style={styles.productPrice}>
                  {((product.product_price || product.price) * product.quantity).toLocaleString()} FCFA
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{(item.total || 0).toLocaleString()} FCFA</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    padding: SPACING.m,
    backgroundColor: COLORS.surface,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  emptyText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },
  listContent: {
    padding: SPACING.m,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  orderId: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: SPACING.s,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.s,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  productPrice: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
  },
  totalLabel: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalAmount: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
