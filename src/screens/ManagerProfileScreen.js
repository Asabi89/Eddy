import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { User, Mail, Phone, LogOut, Store, Package, TrendingUp, Settings, Users, BarChart2, Edit2, MapPin, Clock } from 'lucide-react-native';
import CustomModal from '../components/CustomModal';
import ImagePickerButton from '../components/ImagePickerButton';

export default function ManagerProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout, orders, products, updateProfile, restaurant, updateRestaurant, toggleRestaurantOpen, teamMembers, addTeamMember, deleteTeamMember } = useData();
  const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showRestaurantSettings, setShowRestaurantSettings] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  
  const [editData, setEditData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [restaurantData, setRestaurantData] = useState({
    name: restaurant?.name || 'Mon Restaurant',
    address: restaurant?.address || 'Cotonou, Bénin',
    phone: restaurant?.phone || '+229 97 00 00 00',
    deliveryTime: restaurant?.deliveryTime || '30-45 min',
    deliveryFee: restaurant?.deliveryFee || 500,
  });

  const [newMember, setNewMember] = useState({ name: '', role: '', phone: '' });

  // Sync local state with context when restaurant changes
  useEffect(() => {
    if (restaurant) {
      setRestaurantData({
        name: restaurant.name || 'Mon Restaurant',
        address: restaurant.address || 'Cotonou, Bénin',
        phone: restaurant.phone || '+229 97 00 00 00',
        deliveryTime: restaurant.deliveryTime || '30-45 min',
        deliveryFee: restaurant.deliveryFee || 500,
      });
      setIsRestaurantOpen(restaurant.isOpen ?? true);
    }
  }, [restaurant]);

  const handleLogout = () => {
    setModal({
      visible: true,
      type: 'confirm',
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      onConfirm: () => logout(),
    });
  };

  const handleSaveProfile = async () => {
    await updateProfile(editData);
    setShowEditProfile(false);
    setModal({
      visible: true,
      type: 'success',
      title: 'Profil mis à jour',
      message: 'Vos informations ont été enregistrées',
    });
  };

  const handleSaveRestaurant = async () => {
    await updateRestaurant(restaurantData);
    setShowRestaurantSettings(false);
    setModal({
      visible: true,
      type: 'success',
      title: 'Restaurant mis à jour',
      message: 'Les paramètres du restaurant ont été enregistrés',
    });
  };

  const handleToggleOpen = async () => {
    await toggleRestaurantOpen();
    setIsRestaurantOpen(!isRestaurantOpen);
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

  const todayOrders = orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.created_at || o.date).toDateString() === today;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const stats = [
    { icon: Package, label: 'Commandes', value: orders.length.toString(), color: COLORS.primary },
    { icon: TrendingUp, label: 'Aujourd\'hui', value: todayOrders.length.toString(), color: '#10b981' },
    { icon: Store, label: 'Produits', value: products.length.toString(), color: '#f59e0b' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Store size={40} color={COLORS.primary} />
            </View>
          )}
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={() => setShowEditProfile(true)}
          >
            <Edit2 size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Gestionnaire</Text>
          </View>
        </View>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantCard}>
        <View style={styles.restaurantHeader}>
          <Store size={24} color={COLORS.primary} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurantData.name}</Text>
            <Text style={styles.restaurantAddress}>📍 {restaurantData.address}</Text>
          </View>
        </View>
        
        <View style={styles.restaurantStatus}>
          <Text style={styles.statusLabel}>Statut du restaurant</Text>
          <View style={styles.statusToggle}>
            <Text style={[styles.statusText, !isRestaurantOpen && styles.statusTextInactive]}>
              {isRestaurantOpen ? '🟢 Ouvert' : '🔴 Fermé'}
            </Text>
            <Switch
              value={isRestaurantOpen}
              onValueChange={handleToggleOpen}
              trackColor={{ false: '#ccc', true: COLORS.primaryLight }}
              thumbColor={isRestaurantOpen ? COLORS.primary : '#999'}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editRestaurantButton}
          onPress={() => setShowRestaurantSettings(true)}
        >
          <Settings size={16} color={COLORS.primary} />
          <Text style={styles.editRestaurantText}>Paramètres restaurant</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <stat.icon size={24} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Revenue Card */}
      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Revenu total</Text>
        <Text style={styles.revenueValue}>{totalRevenue.toLocaleString()} FCFA</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations du compte</Text>
        <View style={styles.infoItem}>
          <Mail size={18} color={COLORS.textLight} />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Phone size={18} color={COLORS.textLight} />
          <Text style={styles.infoText}>{user?.phone || '+229 00 00 00 00'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editInfoButton}
          onPress={() => setShowEditProfile(true)}
        >
          <Edit2 size={14} color={COLORS.primary} />
          <Text style={styles.editInfoText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('ManagerDashboard')}
        >
          <View style={styles.menuItemLeft}>
            <BarChart2 size={20} color={COLORS.text} />
            <Text style={styles.menuItemText}>Tableau de bord</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('ManagerDashboard')}
        >
          <View style={styles.menuItemLeft}>
            <Package size={20} color={COLORS.text} />
            <Text style={styles.menuItemText}>Gérer les produits</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setShowTeamModal(true)}
        >
          <View style={styles.menuItemLeft}>
            <Users size={20} color={COLORS.text} />
            <Text style={styles.menuItemText}>Gérer l'équipe</Text>
          </View>
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{teamMembers.length}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setShowRestaurantSettings(true)}
        >
          <View style={styles.menuItemLeft}>
            <Settings size={20} color={COLORS.text} />
            <Text style={styles.menuItemText}>Paramètres restaurant</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* Edit Profile Modal */}
      <CustomModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Modifier le profil"
        type="info"
      >
        <View style={styles.formContent}>
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor={COLORS.textLight}
            value={editData.first_name}
            onChangeText={t => setEditData({...editData, first_name: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor={COLORS.textLight}
            value={editData.last_name}
            onChangeText={t => setEditData({...editData, last_name: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor={COLORS.textLight}
            keyboardType="phone-pad"
            value={editData.phone}
            onChangeText={t => setEditData({...editData, phone: t})}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowEditProfile(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* Restaurant Settings Modal */}
      <CustomModal
        visible={showRestaurantSettings}
        onClose={() => setShowRestaurantSettings(false)}
        title="Paramètres restaurant"
        type="info"
      >
        <View style={styles.formContent}>
          <TextInput
            style={styles.input}
            placeholder="Nom du restaurant"
            placeholderTextColor={COLORS.textLight}
            value={restaurantData.name}
            onChangeText={t => setRestaurantData({...restaurantData, name: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            placeholderTextColor={COLORS.textLight}
            value={restaurantData.address}
            onChangeText={t => setRestaurantData({...restaurantData, address: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor={COLORS.textLight}
            keyboardType="phone-pad"
            value={restaurantData.phone}
            onChangeText={t => setRestaurantData({...restaurantData, phone: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Temps de livraison (ex: 30-45 min)"
            placeholderTextColor={COLORS.textLight}
            value={restaurantData.deliveryTime}
            onChangeText={t => setRestaurantData({...restaurantData, deliveryTime: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Frais de livraison (FCFA)"
            placeholderTextColor={COLORS.textLight}
            keyboardType="numeric"
            value={String(restaurantData.deliveryFee)}
            onChangeText={t => setRestaurantData({...restaurantData, deliveryFee: parseInt(t) || 0})}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowRestaurantSettings(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveRestaurant}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* Team Modal */}
      <CustomModal
        visible={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title="Mon équipe"
        type="info"
      >
        <View style={styles.teamList}>
          {teamMembers?.map(member => (
            <View key={member.id} style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <User size={20} color={COLORS.primary} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
              <TouchableOpacity 
                style={styles.memberDeleteBtn}
                onPress={() => handleDeleteMember(member)}
              >
                <Text style={styles.memberDeleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <View style={styles.addMemberForm}>
            <TextInput
              style={styles.memberInput}
              placeholder="Nom"
              placeholderTextColor={COLORS.textLight}
              value={newMember.name}
              onChangeText={t => setNewMember({...newMember, name: t})}
            />
            <TextInput
              style={styles.memberInput}
              placeholder="Rôle"
              placeholderTextColor={COLORS.textLight}
              value={newMember.role}
              onChangeText={t => setNewMember({...newMember, role: t})}
            />
            <TextInput
              style={styles.memberInput}
              placeholder="Téléphone"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
              value={newMember.phone}
              onChangeText={t => setNewMember({...newMember, phone: t})}
            />
            <TouchableOpacity style={styles.addMemberButton} onPress={handleAddMember}>
              <Text style={styles.addMemberButtonText}>Ajouter membre</Text>
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
        confirmText={modal.type === 'confirm' ? 'Oui' : 'OK'}
      />
    </ScrollView>
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
    padding: SPACING.l,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: SPACING.m,
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  userEmail: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: SPACING.s,
  },
  roleText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: '#333',
  },
  restaurantCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.m,
    padding: SPACING.m,
    borderRadius: 12,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    marginBottom: SPACING.m,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  restaurantAddress: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  restaurantStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  statusLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.primary,
  },
  statusTextInactive: {
    color: COLORS.textLight,
  },
  editRestaurantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    marginTop: SPACING.m,
    paddingVertical: SPACING.s,
  },
  editRestaurantText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.m,
    gap: SPACING.m,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    marginTop: SPACING.s,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  revenueCard: {
    backgroundColor: COLORS.primary,
    margin: SPACING.m,
    padding: SPACING.l,
    borderRadius: 12,
    alignItems: 'center',
  },
  revenueLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  revenueValue: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: '#fff',
    marginTop: SPACING.s,
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    marginHorizontal: SPACING.m,
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    gap: SPACING.m,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  editInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    marginTop: SPACING.m,
    paddingVertical: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  editInfoText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
  menuSection: {
    backgroundColor: COLORS.surface,
    marginTop: SPACING.m,
    marginHorizontal: SPACING.m,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  menuItemText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  menuBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  menuBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.m,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.m,
    marginHorizontal: SPACING.m,
    padding: SPACING.m,
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.error,
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
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  teamList: {
    width: '100%',
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
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
  memberDeleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberDeleteText: {
    fontSize: 20,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  addMemberForm: {
    marginTop: SPACING.m,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  memberInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.s,
    marginBottom: SPACING.s,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  addMemberButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.s,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  addMemberButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#fff',
  },
});
