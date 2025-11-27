import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { MapPin, CheckCircle, Phone } from 'lucide-react-native';

export default function DriverDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus } = useData();
  const currentDriverId = 'd1'; // Mocked logged-in driver

  // Filter orders assigned to this driver or available for pickup if we had a pool
  const myMissions = orders.filter(o => o.driverId === currentDriverId || (o.driverId === null && o.status === 'ready'));

  const handleUpdateStatus = (orderId, currentStatus) => {
    let nextStatus = '';
    let actionLabel = '';

    if (currentStatus === 'assigned') {
      nextStatus = 'picked_up';
      actionLabel = 'Confirmer récupération ?';
    } else if (currentStatus === 'picked_up') {
      nextStatus = 'delivering';
      actionLabel = 'Commencer la livraison ?';
    } else if (currentStatus === 'delivering') {
      nextStatus = 'delivered';
      actionLabel = 'Confirmer la livraison ?';
    }

    if (nextStatus) {
      Alert.alert(
        'Mise à jour statut',
        actionLabel,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Confirmer', onPress: () => updateOrderStatus(orderId, nextStatus) }
        ]
      );
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'assigned': return 'Nouvelle mission';
      case 'picked_up': return 'Commande récupérée';
      case 'delivering': return 'En route vers client';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.m }]}>
        <Text style={styles.headerTitle}>Espace Livreur</Text>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>En ligne</Text>
        </View>
      </View>

      <FlatList
        data={myMissions.filter(o => o.status !== 'delivered')}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune mission en cours</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <Text style={styles.missionId}>Mission #{item.id.slice(-4)}</Text>
              <Text style={styles.missionStatus}>{getStatusLabel(item.status)}</Text>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <MapPin size={16} color={COLORS.primary} />
                <Text style={styles.routeText}>Restaurant: Chez Aïcha</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <MapPin size={16} color={COLORS.secondary} />
                <Text style={styles.routeText}>Client: {item.customer?.address || 'Cotonou'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{item.items.length} articles</Text>
              <Text style={styles.infoText}>•</Text>
              <Text style={styles.infoText}>Total: {item.total} FCFA</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.callButton}>
                <Phone size={20} color={COLORS.text} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleUpdateStatus(item.id, item.status)}
              >
                <Text style={styles.actionButtonText}>
                  {item.status === 'assigned' ? 'Récupérer' : 
                   item.status === 'picked_up' ? 'Partir' : 
                   'Livrer'}
                </Text>
              </TouchableOpacity>
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
  header: {
    padding: SPACING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.success,
  },
  content: {
    padding: SPACING.m,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: SPACING.xl,
    fontFamily: FONTS.regular,
  },
  missionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  missionId: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 16,
  },
  missionStatus: {
    fontFamily: FONTS.bold,
    color: COLORS.secondary,
    fontSize: 14,
  },
  routeContainer: {
    marginBottom: SPACING.m,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  routeText: {
    fontFamily: FONTS.regular,
    color: COLORS.text,
    fontSize: 14,
  },
  routeLine: {
    height: 12,
    width: 1,
    backgroundColor: COLORS.border,
    marginLeft: 7,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.m,
  },
  infoText: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  callButton: {
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 14,
  },
});
