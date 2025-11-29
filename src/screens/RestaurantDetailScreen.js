import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SectionList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomModal from '../components/CustomModal';

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params || {};
  const { products, addToCart } = useData();
  const insets = useSafeAreaInsets();
  const [modal, setModal] = useState({ visible: false, title: '', message: '' });

  // Guard clause
  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  // Filter products by restaurantId if available, else show all for demo
  // In a real app, products would have restaurantId
  const restaurantProducts = products.filter(p => p.restaurantId === restaurant.id || !p.restaurantId);

  const groupedMenu = restaurantProducts.reduce((acc, item) => {
    const category = item.category_name || item.category || 'Autres';
    const section = acc.find((s) => s.title === category);
    if (section) {
      section.data.push(item);
    } else {
      acc.push({ title: category, data: [item] });
    }
    return acc;
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setModal({
      visible: true,
      type: 'success',
      title: 'Ajouté au panier ! 🛒',
      message: `${item.name} a été ajouté à votre panier.`,
    });
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>{item.price.toLocaleString()} FCFA</Text>
        <TouchableOpacity
          onPress={() => handleAddToCart(item)}
          style={styles.addButton}
        >
          <Plus size={16} color={COLORS.textWhite} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.menuItemImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
        {/* Restaurant Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={() => navigation.goBack()}
          >
             <MaterialIcons name="arrow-back" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={14} color="#eab308" />
                <Text style={styles.rating}>{restaurant.rating}</Text>
              </View>
            </View>

            <Text style={styles.cuisine}>
              {restaurant.cuisine} • {restaurant.priceRange}
            </Text>

            <View style={styles.infoRow}>
              <MaterialIcons name="schedule" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Livraison : {restaurant.deliveryTime} • {restaurant.distance} •{' '}
                {restaurant.deliveryFee} FCFA
              </Text>
            </View>
          </View>
        </View>

        <SectionList
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
          sections={groupedMenu}
          keyExtractor={(item, idx) => (item.id || idx).toString()}
          renderItem={renderMenuItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
        />

        <CustomModal
          visible={modal.visible}
          onClose={() => setModal({ ...modal, visible: false })}
          type={modal.type}
          title={modal.title}
          message={modal.message}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 32,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerImage: {
    width: '100%',
    height: 220,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  headerContent: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  restaurantName: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: COLORS.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rating: {
    marginLeft: 4,
    fontFamily: FONTS.bold,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cuisine: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.s,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
  },
  listContent: {
    padding: SPACING.m,
  },
  sectionHeader: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: SPACING.m,
    color: COLORS.text,
    backgroundColor: COLORS.background, // Sticky header bg matches main bg
    paddingVertical: SPACING.s,
  },
  menuItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.m,
  },
  menuItemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.text,
  },
  menuItemDesc: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
    lineHeight: 18,
  },
  menuItemPrice: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 12,
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
});
