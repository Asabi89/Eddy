import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { Plus, Package, User, Check, Truck, X } from 'lucide-react-native';

export default function ManagerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus, drivers, products, addProduct } = useData();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Plats principaux',
    image: ''
  });

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const handleAssignDriver = (driverId) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, 'assigned', driverId);
      setShowDriverModal(false);
      setSelectedOrder(null);
      Alert.alert('Succès', 'Commande assignée au livreur');
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert('Erreur', 'Nom et prix requis');
      return;
    }
    addProduct({
      ...newProduct,
      price: parseInt(newProduct.price),
      restaurantId: 1
    });
    setShowAddProduct(false);
    setNewProduct({ name: '', price: '', description: '', category: 'Plats principaux', image: '' });
    Alert.alert('Succès', 'Produit ajouté au catalogue');
  };

  const getStatusBadge = (status) => {
    let color = COLORS.textLight;
    let label = status;
    switch (status) {
      case 'pending': color = COLORS.secondary; label = 'En attente'; break;
      case 'accepted': color = COLORS.primary; label = 'Acceptée'; break;
      case 'assigned': color = COLORS.primaryDark; label = 'Assignée'; break;
      case 'picked_up': color = '#8b5cf6'; label = 'Récupérée'; break;
      case 'delivering': color = '#3b82f6'; label = 'En route'; break;
    }
    return (
      <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.statusText, { color }]}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.m }]}>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
          <Text style={styles.headerSubtitle}>Gestionnaire Restaurant</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Cmds</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeOrders.length}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Produits</Text>
          </View>
        </View>

        {/* Active Orders */}
        <Text style={styles.sectionTitle}>Commandes en cours</Text>
        {activeOrders.length === 0 ? (
          <Text style={styles.emptyText}>Aucune commande active</Text>
        ) : (
          activeOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id.slice(-4)}</Text>
                {getStatusBadge(order.status)}
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
                      style={[styles.actionButton, styles.assignButton]}
                      onPress={() => {
                        setSelectedOrder(order);
                        setShowDriverModal(true);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Assigner Livreur</Text>
                    </TouchableOpacity>
                  )}

                  {order.status !== 'pending' && order.status !== 'accepted' && (
                    <Text style={styles.assignedText}>
                      Livreur: {drivers.find(d => d.id === order.driverId)?.name || 'Inconnu'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))
        )}

        {/* Products Management */}
        <View style={styles.productsHeader}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddProduct(true)}
          >
            <Plus size={20} color={COLORS.textWhite} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        {products.map(product => (
          <View key={product.id} style={styles.productCard}>
            {product.image && (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            )}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price} FCFA</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Driver Modal */}
      <Modal visible={showDriverModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir un livreur</Text>
            <FlatList 
              data={drivers}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.driverItem}
                  onPress={() => handleAssignDriver(item.id)}
                >
                  <View style={styles.driverInfo}>
                    <User size={24} color={COLORS.text} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.driverName}>{item.name}</Text>
                      <Text style={styles.driverStatus}>
                        {item.status === 'available' ? 'Disponible' : 'Occupé'}
                      </Text>
                    </View>
                  </View>
                  <Check size={20} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowDriverModal(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Product Modal */}
      <Modal visible={showAddProduct} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau Produit</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nom du produit"
              placeholderTextColor={COLORS.textLight}
              value={newProduct.name}
              onChangeText={t => setNewProduct({...newProduct, name: t})}
            />
            <TextInput
              style={styles.input}
              placeholder="Prix (FCFA)"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              value={newProduct.price}
              onChangeText={t => setNewProduct({...newProduct, price: t})}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={COLORS.textLight}
              value={newProduct.description}
              onChangeText={t => setNewProduct({...newProduct, description: t})}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de l'image"
              placeholderTextColor={COLORS.textLight}
              value={newProduct.image}
              onChangeText={t => setNewProduct({...newProduct, image: t})}
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
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
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
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  emptyText: {
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
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
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  orderItemText: {
    fontFamily: FONTS.regular,
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
    fontFamily: FONTS.bold,
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
    backgroundColor: COLORS.primary,
  },
  assignButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  assignedText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
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
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: SPACING.m,
    backgroundColor: COLORS.background,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  productPrice: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.l,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: SPACING.l,
    textAlign: 'center',
    color: COLORS.text,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 16,
  },
  driverStatus: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    color: COLORS.text,
    fontFamily: FONTS.regular,
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
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
});
