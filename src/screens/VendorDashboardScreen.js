import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useData } from '../context/DataContext';
import { COLORS, SPACING } from '../theme';
import { Plus, Package, Check } from 'lucide-react-native';

export default function VendorDashboardScreen() {
  const { orders, updateOrderStatus, products, addProduct } = useData();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Plats principaux'
  });

  // Filter for active orders (not delivered)
  const activeOrders = orders.filter(o => o.status !== 'delivered');

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert('Erreur', 'Nom et prix requis');
      return;
    }
    addProduct({
      ...newProduct,
      price: parseInt(newProduct.price),
      restaurantId: 1 // Hardcoded for demo, assuming this device is restaurant 1
    });
    setShowAddProduct(false);
    setNewProduct({ name: '', price: '', description: '', category: 'Plats principaux' });
    Alert.alert('Succès', 'Produit ajouté au catalogue');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
          <Text style={styles.headerSubtitle}>Gérez vos commandes et produits</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Commandes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Produits</Text>
          </View>
        </View>

        {/* Active Orders */}
        <Text style={styles.sectionTitle}>Commandes en cours</Text>
        {activeOrders.length === 0 ? (
          <Text style={styles.emptyText}>Aucune commande en attente</Text>
        ) : (
          activeOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Cmd #{order.id.slice(-4)}</Text>
                <Text style={styles.orderTime}>
                  {new Date(order.date).toLocaleTimeString()}
                </Text>
              </View>
              
              <View style={styles.orderItems}>
                {order.items.map((item, idx) => (
                  <Text key={idx} style={styles.orderItemText}>
                    {item.quantity}x {item.name}
                  </Text>
                ))}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{order.total} FCFA</Text>
                <View style={styles.actionButtons}>
                  {order.status === 'pending' && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => updateOrderStatus(order.id, 'accepted')}
                    >
                      <Text style={styles.actionButtonText}>Accepter</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === 'accepted' && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deliverButton]}
                      onPress={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      <Text style={styles.actionButtonText}>Livrer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}

        {/* Products Management */}
        <View style={styles.productsHeader}>
          <Text style={styles.sectionTitle}>Mes Produits</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddProduct(true)}
          >
            <Plus size={20} color={COLORS.surface} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        {products.map(product => (
          <View key={product.id} style={styles.productCard}>
            <View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price} FCFA</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={showAddProduct}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau Produit</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nom du produit"
              value={newProduct.name}
              onChangeText={t => setNewProduct({...newProduct, name: t})}
            />
            <TextInput
              style={styles.input}
              placeholder="Prix (FCFA)"
              keyboardType="numeric"
              value={newProduct.price}
              onChangeText={t => setNewProduct({...newProduct, price: t})}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newProduct.description}
              onChangeText={t => setNewProduct({...newProduct, description: t})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddProduct(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddProduct}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.m,
  },
  header: {
    marginBottom: SPACING.l,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  emptyText: {
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: SPACING.l,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.m,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  orderId: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  orderItemText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.m,
    paddingTop: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  orderTotal: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  actionButton: {
    paddingHorizontal: SPACING.m,
    paddingVertical: 6,
    borderRadius: 16,
  },
  acceptButton: {
    backgroundColor: COLORS.secondary,
  },
  deliverButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    color: COLORS.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.l,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginTop: SPACING.m,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: COLORS.text,
  },
});
