import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Image, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { Plus, Package, User, Check, Truck, Edit2, Trash2, Clock, DollarSign, Image as ImageIcon, Users } from 'lucide-react-native';
import ImagePickerButton from '../components/ImagePickerButton';
import CustomModal from '../components/CustomModal';

export default function ManagerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { 
    orders, 
    updateOrderStatus, 
    drivers, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    refreshData, 
    user,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    teamMembers,
    addTeamMember,
    deleteTeamMember,
  } = useData();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Plats principaux',
    image: ''
  });

  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    image: '',
  });

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    phone: '',
  });

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const todayOrders = orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.created_at || o.date).toDateString() === today;
  });
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleAssignDriver = (driver) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, 'assigned', driver.id);
      setShowDriverModal(false);
      setSelectedOrder(null);
      setModal({
        visible: true,
        type: 'success',
        title: 'Livreur assigné',
        message: `La commande a été assignée à ${driver.name}`,
      });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      setModal({
        visible: true,
        type: 'warning',
        title: 'Champs requis',
        message: 'Le nom et le prix sont obligatoires',
      });
      return;
    }
    
    await addProduct({
      ...newProduct,
      price: parseInt(newProduct.price),
      restaurantId: 1,
      image: newProduct.image || `https://picsum.photos/seed/${Date.now()}/300/300`,
    });
    
    setShowAddProduct(false);
    setNewProduct({ name: '', price: '', description: '', category: 'Plats principaux', image: '' });
    setModal({
      visible: true,
      type: 'success',
      title: 'Produit ajouté',
      message: `${newProduct.name} a été ajouté au catalogue`,
    });
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    await updateProduct(selectedProduct.id, {
      name: selectedProduct.name,
      price: parseInt(selectedProduct.price),
      description: selectedProduct.description,
      image: selectedProduct.image,
    });
    
    setShowEditProduct(false);
    setSelectedProduct(null);
    setModal({
      visible: true,
      type: 'success',
      title: 'Produit modifié',
      message: 'Les modifications ont été enregistrées',
    });
  };

  const handleDeleteProduct = (product) => {
    setModal({
      visible: true,
      type: 'confirm',
      title: 'Supprimer le produit ?',
      message: `Voulez-vous vraiment supprimer "${product.name}" ?`,
      onConfirm: async () => {
        await deleteProduct(product.id);
      },
    });
  };

  const handleAddBanner = async () => {
    if (!newBanner.title || !newBanner.image) {
      setModal({
        visible: true,
        type: 'warning',
        title: 'Champs requis',
        message: 'Le titre et l\'image sont obligatoires',
      });
      return;
    }
    
    await addBanner(newBanner);
    setShowAddBanner(false);
    setNewBanner({ title: '', subtitle: '', image: '' });
    setModal({
      visible: true,
      type: 'success',
      title: 'Bannière ajoutée',
      message: 'La bannière a été ajoutée avec succès',
    });
  };

  const handleDeleteBanner = (banner) => {
    setModal({
      visible: true,
      type: 'confirm',
      title: 'Supprimer la bannière ?',
      message: `Voulez-vous vraiment supprimer "${banner.title}" ?`,
      onConfirm: async () => {
        await deleteBanner(banner.id);
      },
    });
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) {
      setModal({
        visible: true,
        type: 'warning',
        title: 'Champs requis',
        message: 'Le nom et le rôle sont obligatoires',
      });
      return;
    }
    
    await addTeamMember(newMember);
    setShowAddMember(false);
    setNewMember({ name: '', role: '', phone: '' });
    setModal({
      visible: true,
      type: 'success',
      title: 'Membre ajouté',
      message: `${newMember.name} a été ajouté à l'équipe`,
    });
  };

  const handleDeleteMember = (member) => {
    setModal({
      visible: true,
      type: 'confirm',
      title: 'Supprimer le membre ?',
      message: `Voulez-vous vraiment retirer "${member.name}" de l'équipe ?`,
      onConfirm: async () => {
        await deleteTeamMember(member.id);
      },
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: COLORS.secondary, label: 'En attente' },
      accepted: { color: COLORS.primary, label: 'Acceptée' },
      preparing: { color: '#8b5cf6', label: 'En préparation' },
      ready: { color: '#10b981', label: 'Prête' },
      assigned: { color: '#3b82f6', label: 'Assignée' },
      picked_up: { color: '#6366f1', label: 'Récupérée' },
      delivering: { color: '#f59e0b', label: 'En route' },
    };
    const { color, label } = statusMap[status] || { color: COLORS.textLight, label: status };
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.statusText, { color }]}>{label}</Text>
      </View>
    );
  };

  const tabs = [
    { id: 'orders', label: 'Commandes', count: activeOrders.length },
    { id: 'products', label: 'Produits', count: products.length },
    { id: 'banners', label: 'Bannières', count: banners.length },
    { id: 'team', label: 'Équipe', count: teamMembers?.length || 0 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <View style={[styles.header, { paddingTop: insets.top + SPACING.m }]}>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
          <Text style={styles.headerSubtitle}>Bienvenue, {user?.first_name || 'Gestionnaire'}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#e0f2fe' }]}>
            <Package size={24} color="#0284c7" />
            <Text style={[styles.statValue, { color: '#0284c7' }]}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Cmds</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <Clock size={24} color="#d97706" />
            <Text style={[styles.statValue, { color: '#d97706' }]}>{activeOrders.length}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#d1fae5' }]}>
            <DollarSign size={24} color="#059669" />
            <Text style={[styles.statValue, { color: '#059669' }]}>{(todayRevenue / 1000).toFixed(0)}K</Text>
            <Text style={styles.statLabel}>Aujourd'hui</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
              <View style={[styles.tabBadge, activeTab === tab.id && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === tab.id && styles.tabBadgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {activeOrders.length === 0 ? (
              <View style={styles.emptyCard}>
                <Package size={40} color={COLORS.textLight} />
                <Text style={styles.emptyText}>Aucune commande active</Text>
              </View>
            ) : (
              activeOrders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>#{String(order.id).slice(-6)}</Text>
                    {getStatusBadge(order.status)}
                  </View>
                  
                  <View style={styles.orderItems}>
                    {order.items?.map((item, idx) => (
                      <Text key={idx} style={styles.orderItemText}>
                        {item.quantity}x {item.product_name || item.name}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.orderMeta}>
                    <Text style={styles.orderCustomer}>📍 {order.customer_name || 'Client'}</Text>
                    <Text style={styles.orderTime}>
                      {new Date(order.created_at || order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>{(order.total || 0).toLocaleString()} FCFA</Text>
                    <View style={styles.actionButtons}>
                      {order.status === 'pending' && (
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.acceptButton]}
                          onPress={() => updateOrderStatus(order.id, 'accepted')}
                        >
                          <Check size={14} color="#fff" />
                          <Text style={styles.actionButtonText}>Accepter</Text>
                        </TouchableOpacity>
                      )}
                      
                      {order.status === 'accepted' && (
                        <>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.prepareButton]}
                            onPress={() => updateOrderStatus(order.id, 'preparing')}
                          >
                            <Text style={styles.actionButtonText}>Préparer</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.assignButton]}
                            onPress={() => {
                              setSelectedOrder(order);
                              setShowDriverModal(true);
                            }}
                          >
                            <Truck size={14} color="#fff" />
                          </TouchableOpacity>
                        </>
                      )}

                      {order.status === 'preparing' && (
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.readyButton]}
                          onPress={() => updateOrderStatus(order.id, 'ready')}
                        >
                          <Text style={styles.actionButtonText}>Prêt</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <View style={styles.tabHeader}>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowAddProduct(true)}>
                <Plus size={18} color="#fff" />
                <Text style={styles.addButtonText}>Ajouter produit</Text>
              </TouchableOpacity>
            </View>
            
            {products.map(product => (
              <View key={product.id} style={styles.productCard}>
                <Image 
                  source={{ uri: product.image || product.image_url || `https://picsum.photos/seed/${product.id}/100/100` }} 
                  style={styles.productImage} 
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category_name || product.category || 'Plat'}</Text>
                  <Text style={styles.productPrice}>{(product.price || 0).toLocaleString()} FCFA</Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {
                      setSelectedProduct({ ...product });
                      setShowEditProduct(true);
                    }}
                  >
                    <Edit2 size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProduct(product)}
                  >
                    <Trash2 size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <>
            <View style={styles.tabHeader}>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowAddBanner(true)}>
                <Plus size={18} color="#fff" />
                <Text style={styles.addButtonText}>Ajouter bannière</Text>
              </TouchableOpacity>
            </View>
            
            {banners.length === 0 ? (
              <View style={styles.emptyCard}>
                <ImageIcon size={40} color={COLORS.textLight} />
                <Text style={styles.emptyText}>Aucune bannière</Text>
              </View>
            ) : (
              banners.map(banner => (
                <View key={banner.id} style={styles.bannerCard}>
                  <Image 
                    source={{ uri: banner.image || banner.image_url || `https://picsum.photos/seed/${banner.id}/400/200` }} 
                    style={styles.bannerImage} 
                  />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    {banner.subtitle && <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>}
                  </View>
                  <TouchableOpacity 
                    style={styles.bannerDeleteButton}
                    onPress={() => handleDeleteBanner(banner)}
                  >
                    <Trash2 size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <>
            <View style={styles.tabHeader}>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowAddMember(true)}>
                <Plus size={18} color="#fff" />
                <Text style={styles.addButtonText}>Ajouter membre</Text>
              </TouchableOpacity>
            </View>
            
            {(!teamMembers || teamMembers.length === 0) ? (
              <View style={styles.emptyCard}>
                <Users size={40} color={COLORS.textLight} />
                <Text style={styles.emptyText}>Aucun membre dans l'équipe</Text>
              </View>
            ) : (
              teamMembers.map(member => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberAvatar}>
                    <User size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                    {member.phone && <Text style={styles.memberPhone}>{member.phone}</Text>}
                  </View>
                  <View style={styles.memberActions}>
                    <View style={[styles.memberStatus, member.status === 'active' && styles.memberStatusActive]}>
                      <Text style={styles.memberStatusText}>
                        {member.status === 'active' ? 'Actif' : 'Inactif'}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMember(member)}
                    >
                      <Trash2 size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Driver Selection Modal */}
      <CustomModal
        visible={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        title="Choisir un livreur"
        type="info"
      >
        <View style={styles.driverList}>
          {drivers.map(driver => (
            <TouchableOpacity 
              key={driver.id}
              style={styles.driverItem}
              onPress={() => handleAssignDriver(driver)}
            >
              <View style={styles.driverInfo}>
                <View style={[styles.driverAvatar, driver.status === 'available' && styles.driverAvatarAvailable]}>
                  <User size={20} color={driver.status === 'available' ? COLORS.primary : COLORS.textLight} />
                </View>
                <View>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={[styles.driverStatus, driver.status === 'available' && styles.driverStatusAvailable]}>
                    {driver.status === 'available' ? '🟢 Disponible' : '🔴 Occupé'}
                  </Text>
                </View>
              </View>
              <Check size={20} color={COLORS.primary} />
            </TouchableOpacity>
          ))}
        </View>
      </CustomModal>

      {/* Add Product Modal */}
      <CustomModal
        visible={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        title="Nouveau Produit"
        type="info"
      >
        <View style={styles.formContent}>
          <ImagePickerButton
            imageUri={newProduct.image}
            onImageSelected={(uri) => setNewProduct({...newProduct, image: uri})}
            size={100}
            placeholder="📷"
            style={{ alignSelf: 'center', marginBottom: SPACING.m }}
          />
          
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
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor={COLORS.textLight}
            multiline
            value={newProduct.description}
            onChangeText={t => setNewProduct({...newProduct, description: t})}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAddProduct(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddProduct}>
              <Text style={styles.saveButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* Edit Product Modal */}
      <CustomModal
        visible={showEditProduct}
        onClose={() => setShowEditProduct(false)}
        title="Modifier le produit"
        type="info"
      >
        {selectedProduct && (
          <View style={styles.formContent}>
            <ImagePickerButton
              imageUri={selectedProduct.image || selectedProduct.image_url}
              onImageSelected={(uri) => setSelectedProduct({...selectedProduct, image: uri})}
              size={100}
              placeholder="📷"
              style={{ alignSelf: 'center', marginBottom: SPACING.m }}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Nom du produit"
              placeholderTextColor={COLORS.textLight}
              value={selectedProduct.name}
              onChangeText={t => setSelectedProduct({...selectedProduct, name: t})}
            />
            <TextInput
              style={styles.input}
              placeholder="Prix (FCFA)"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              value={String(selectedProduct.price || '')}
              onChangeText={t => setSelectedProduct({...selectedProduct, price: t})}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor={COLORS.textLight}
              multiline
              value={selectedProduct.description}
              onChangeText={t => setSelectedProduct({...selectedProduct, description: t})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowEditProduct(false)}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleEditProduct}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </CustomModal>

      {/* Add Banner Modal */}
      <CustomModal
        visible={showAddBanner}
        onClose={() => setShowAddBanner(false)}
        title="Nouvelle Bannière"
        type="info"
      >
        <View style={styles.formContent}>
          <ImagePickerButton
            imageUri={newBanner.image}
            onImageSelected={(uri) => setNewBanner({...newBanner, image: uri})}
            size={120}
            placeholder="📷 Image bannière"
            style={{ alignSelf: 'center', marginBottom: SPACING.m, width: '100%', height: 120 }}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Titre de la bannière"
            placeholderTextColor={COLORS.textLight}
            value={newBanner.title}
            onChangeText={t => setNewBanner({...newBanner, title: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Sous-titre (optionnel)"
            placeholderTextColor={COLORS.textLight}
            value={newBanner.subtitle}
            onChangeText={t => setNewBanner({...newBanner, subtitle: t})}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAddBanner(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddBanner}>
              <Text style={styles.saveButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* Add Member Modal */}
      <CustomModal
        visible={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Nouveau Membre"
        type="info"
      >
        <View style={styles.formContent}>
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            placeholderTextColor={COLORS.textLight}
            value={newMember.name}
            onChangeText={t => setNewMember({...newMember, name: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Rôle (ex: Cuisinier, Serveur)"
            placeholderTextColor={COLORS.textLight}
            value={newMember.role}
            onChangeText={t => setNewMember({...newMember, role: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor={COLORS.textLight}
            keyboardType="phone-pad"
            value={newMember.phone}
            onChangeText={t => setNewMember({...newMember, phone: t})}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAddMember(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddMember}>
              <Text style={styles.saveButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* Alert Modal */}
      <CustomModal
        visible={modal.visible}
        onClose={() => setModal({ ...modal, visible: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        confirmText={modal.type === 'confirm' ? 'Supprimer' : 'OK'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: SPACING.m,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  statCard: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    marginTop: SPACING.s,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.s,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 4,
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  tabTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  tabBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: COLORS.primary,
  },
  tabBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.textLight,
  },
  tabBadgeTextActive: {
    color: '#fff',
  },
  tabHeader: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.m,
    padding: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
    marginTop: SPACING.m,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    padding: SPACING.m,
    borderRadius: 12,
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
    fontSize: 16,
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  orderItems: {
    marginBottom: SPACING.s,
  },
  orderItemText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  orderCustomer: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
  },
  orderTime: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.s,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  prepareButton: {
    backgroundColor: '#8b5cf6',
  },
  assignButton: {
    backgroundColor: '#3b82f6',
  },
  readyButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.s,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  productDetails: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  productName: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.text,
  },
  productCategory: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  productPrice: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  productActions: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  editButton: {
    padding: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  bannerCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.background,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.m,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bannerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: '#fff',
  },
  bannerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  bannerDeleteButton: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    backgroundColor: 'rgba(239,68,68,0.9)',
    padding: 8,
    borderRadius: 20,
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.s,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  memberName: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.text,
  },
  memberRole: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  memberPhone: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  memberActions: {
    alignItems: 'flex-end',
    gap: SPACING.s,
  },
  memberStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
  },
  memberStatusActive: {
    backgroundColor: '#d1fae5',
  },
  memberStatusText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.text,
  },
  driverList: {
    width: '100%',
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
    gap: SPACING.m,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverAvatarAvailable: {
    backgroundColor: COLORS.primaryLight,
  },
  driverName: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 15,
  },
  driverStatus: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 2,
  },
  driverStatusAvailable: {
    color: COLORS.primary,
  },
  formContent: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 15,
    backgroundColor: COLORS.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginTop: SPACING.s,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
});
