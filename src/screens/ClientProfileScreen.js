import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Check, X, ShoppingBag, Heart, Bell, HelpCircle } from 'lucide-react-native';
import CustomModal from '../components/CustomModal';

export default function ClientProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout, userLocation } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
  const [editData, setEditData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleLogout = () => {
    setModal({
      visible: true,
      type: 'confirm',
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      onConfirm: () => logout(),
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    setModal({ visible: true, type: 'success', title: 'Succès', message: 'Profil mis à jour avec succès !' });
  };

  const menuItems = [
    { icon: ShoppingBag, label: 'Mes commandes', onPress: () => navigation.navigate('Commandes') },
    { icon: Heart, label: 'Mes favoris', onPress: () => setModal({ visible: true, type: 'info', title: 'Bientôt', message: 'Cette fonctionnalité arrive bientôt!' }) },
    { icon: MapPin, label: 'Mes adresses', onPress: () => setModal({ visible: true, type: 'info', title: 'Bientôt', message: 'Cette fonctionnalité arrive bientôt!' }) },
    { icon: Bell, label: 'Notifications', onPress: () => setModal({ visible: true, type: 'info', title: 'Bientôt', message: 'Cette fonctionnalité arrive bientôt!' }) },
    { icon: HelpCircle, label: 'Aide & Support', onPress: () => setModal({ visible: true, type: 'info', title: 'Support', message: 'Contactez-nous:\nsupport@benineats.com\n+229 00 00 00 00' }) },
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
              <User size={40} color={COLORS.primary} />
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Client</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <X size={20} color={COLORS.text} />
          ) : (
            <Edit2 size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Edit Form */}
      {isEditing && (
        <View style={styles.editSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={editData.first_name}
              onChangeText={(t) => setEditData({...editData, first_name: t})}
              placeholder="Prénom"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              value={editData.last_name}
              onChangeText={(t) => setEditData({...editData, last_name: t})}
              placeholder="Nom"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={editData.phone}
              onChangeText={(t) => setEditData({...editData, phone: t})}
              placeholder="+229 00000000"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={editData.address}
              onChangeText={(t) => setEditData({...editData, address: t})}
              placeholder="Votre adresse"
              placeholderTextColor={COLORS.textLight}
              multiline
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Check size={20} color={COLORS.textWhite} />
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contact Info */}
      {!isEditing && (
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Mail size={18} color={COLORS.textLight} />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Phone size={18} color={COLORS.textLight} />
            <Text style={styles.infoText}>{user?.phone || 'Non renseigné'}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={18} color={COLORS.textLight} />
            <Text style={styles.infoText}>{userLocation?.address || 'Position non disponible'}</Text>
          </View>
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <item.icon size={20} color={COLORS.text} />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* Custom Modal */}
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: SPACING.s,
  },
  roleText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.textWhite,
  },
  editButton: {
    padding: 8,
  },
  editSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    marginTop: SPACING.m,
    marginHorizontal: SPACING.m,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: SPACING.m,
  },
  inputLabel: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    marginTop: SPACING.m,
    marginHorizontal: SPACING.m,
    borderRadius: 12,
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
});
