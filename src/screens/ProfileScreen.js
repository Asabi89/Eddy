import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { User, Store, LogOut, Settings, Shield, Truck, LayoutDashboard } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {
  const { userMode, setUserRole, logout, user } = useData();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: () => logout(), style: 'destructive' }
      ]
    );
  };

  const handleRoleSwitch = (role) => {
    setUserRole(role);
    Alert.alert('Rôle changé', `Vous êtes maintenant : ${getRoleLabel(role)}`);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'client': return 'Client';
      case 'manager': return 'Gestionnaire';
      case 'driver': return 'Livreur';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.userName}>{user?.first_name || user?.username || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@local.device'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{getRoleLabel(userMode)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tableau de bord</Text>
        
        {userMode === 'manager' && (
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('ManagerDashboard')}
          >
            <Store size={20} color={COLORS.primary} />
            <Text style={[styles.menuText, styles.activeText]}>Gestion Restaurant</Text>
          </TouchableOpacity>
        )}

        {userMode === 'driver' && (
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('DriverDashboard')}
          >
            <Truck size={20} color={COLORS.primary} />
            <Text style={[styles.menuText, styles.activeText]}>Espace Livreur</Text>
          </TouchableOpacity>
        )}

        {userMode === 'admin' && (
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('AdminDashboard')}
          >
            <LayoutDashboard size={20} color={COLORS.primary} />
            <Text style={[styles.menuText, styles.activeText]}>Administration</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Changer de rôle (Démo)</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => handleRoleSwitch('client')}>
          <User size={20} color={userMode === 'client' ? COLORS.primary : COLORS.text} />
          <Text style={[styles.menuText, userMode === 'client' && styles.activeText]}>Client</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleRoleSwitch('manager')}>
          <Store size={20} color={userMode === 'manager' ? COLORS.primary : COLORS.text} />
          <Text style={[styles.menuText, userMode === 'manager' && styles.activeText]}>Gestionnaire</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleRoleSwitch('driver')}>
          <Truck size={20} color={userMode === 'driver' ? COLORS.primary : COLORS.text} />
          <Text style={[styles.menuText, userMode === 'driver' && styles.activeText]}>Livreur</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleRoleSwitch('admin')}>
          <Shield size={20} color={userMode === 'admin' ? COLORS.primary : COLORS.text} />
          <Text style={[styles.menuText, userMode === 'admin' && styles.activeText]}>Admin</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <LogOut size={20} color={COLORS.error} />
          <Text style={[styles.menuText, styles.logoutText]}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userEmail: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: SPACING.s,
  },
  roleText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.textWhite,
  },
  section: {
    marginTop: SPACING.l,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    padding: SPACING.m,
    paddingBottom: SPACING.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  menuText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.m,
  },
  activeText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: '600',
  },
  logoutButton: {
    borderTopWidth: 0,
  },
  logoutText: {
    fontFamily: FONTS.regular,
    color: COLORS.error,
  },
});
