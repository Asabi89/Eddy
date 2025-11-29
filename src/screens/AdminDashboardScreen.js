import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { orders = [], products = [], companies = [] } = useData();

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.m }]}>
        <Text style={styles.headerTitle}>Administration</Text>
        <Text style={styles.headerSubtitle}>Vue d'ensemble</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          <StatCard 
            title="Chiffre d'affaires" 
            value={`${totalRevenue.toLocaleString()} F`} 
            icon={DollarSign} 
            color={COLORS.success} 
          />
          <StatCard 
            title="Commandes Total" 
            value={orders.length} 
            icon={ShoppingBag} 
            color={COLORS.primary} 
          />
          <StatCard 
            title="Restaurants" 
            value={companies.length} 
            icon={Users} 
            color={COLORS.secondary} 
          />
          <StatCard 
            title="Croissance" 
            value="+12%" 
            icon={TrendingUp} 
            color="#8b5cf6" 
          />
        </View>

        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Commandes Livrées</Text>
            <Text style={styles.rowValue}>{deliveredOrders}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>En attente</Text>
            <Text style={styles.rowValue}>{pendingOrders}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Produits catalogue</Text>
            <Text style={styles.rowValue}>{products.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Activités Récentes</Text>
        {orders.slice(0, 5).map(order => (
          <View key={order.id} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View>
              <Text style={styles.activityText}>
                Nouvelle commande de {order.total} FCFA
              </Text>
              <Text style={styles.activityTime}>
                {new Date(order.created_at || order.date).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  },
  content: {
    padding: SPACING.m,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 16, // Reduced font size to fit revenue
    color: COLORS.text,
  },
  statTitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.l,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
  },
  rowLabel: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontSize: 14,
  },
  rowValue: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
    gap: SPACING.m,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  activityText: {
    fontFamily: FONTS.regular,
    color: COLORS.text,
    fontSize: 14,
  },
  activityTime: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontSize: 12,
  },
});
