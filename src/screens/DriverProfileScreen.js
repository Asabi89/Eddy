import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { User, Mail, Phone, MapPin, LogOut, Truck, Calendar, Clock, Star, TrendingUp, Package } from 'lucide-react-native';
import CustomModal from '../components/CustomModal';

export default function DriverProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout, driverAvailability, toggleDriverAvailability, loadProfile } = useData();
  const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    setModal({
      visible: true,
      type: 'confirm',
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      onConfirm: () => logout(),
    });
  };

  const stats = [
    { icon: Package, label: 'Livraisons', value: String(user?.deliveries || 0), color: COLORS.primary },
    { icon: Star, label: 'Note', value: String(user?.rating || 0), color: '#f59e0b' },
    { icon: TrendingUp, label: 'Ce mois', value: String(user?.thisMonth || 0), color: '#10b981' },
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
              <Truck size={40} color={COLORS.primary} />
            </View>
          )}
          <View style={[styles.statusDot, driverAvailability ? styles.online : styles.offline]} />
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Livreur</Text>
          </View>
        </View>
      </View>

      {/* Availability Toggle */}
      <View style={styles.availabilityCard}>
        <View style={styles.availabilityInfo}>
          <Text style={styles.availabilityLabel}>Disponibilité</Text>
          <Text style={styles.availabilityStatus}>
            {driverAvailability ? '🟢 En ligne' : '🔴 Hors ligne'}
          </Text>
        </View>
        <Switch
          value={driverAvailability}
          onValueChange={toggleDriverAvailability}
          trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
          thumbColor={driverAvailability ? COLORS.primary : COLORS.textLight}
        />
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

      {/* Contact Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoItem}>
          <Mail size={18} color={COLORS.textLight} />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Phone size={18} color={COLORS.textLight} />
          <Text style={styles.infoText}>{user?.phone || '+229 00000000'}</Text>
        </View>
        <View style={styles.infoItem}>
          <MapPin size={18} color={COLORS.textLight} />
          <Text style={styles.infoText}>Cotonou, Bénin</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('DriverSchedule')}
        >
          <View style={styles.menuItemLeft}>
            <Calendar size={20} color={COLORS.text} />
            <Text style={styles.menuItemText}>Horaires de travail</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setModal({ visible: true, type: 'info', title: 'Historique', message: 'Fonctionnalité à venir prochainement!' })}
        >
          <View style={styles.menuItemLeft}>
            <Clock size={20} color={COLORS.text} />
            <Text style={styles.menuItemText}>Historique des livraisons</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setModal({ visible: true, type: 'info', title: 'Mes gains', message: 'Fonctionnalité à venir prochainement!' })}
        >
          <View style={styles.menuItemLeft}>
            <TrendingUp size={20} color={COLORS.text} />
            <Text style={styles.menuItemText}>Mes gains</Text>
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
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  online: {
    backgroundColor: '#10b981',
  },
  offline: {
    backgroundColor: COLORS.textLight,
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
    backgroundColor: '#17a2b8',
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
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    margin: SPACING.m,
    padding: SPACING.m,
    borderRadius: 12,
  },
  availabilityInfo: {},
  availabilityLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  availabilityStatus: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginTop: 4,
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
  infoSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    marginTop: SPACING.m,
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
