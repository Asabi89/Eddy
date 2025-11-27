import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import RestaurantCard from '../components/RestaurantCard';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import { ShoppingBag, Zap, Shield } from 'lucide-react-native';

export default function HomeScreen({ navigation }) {
  const { categories, companies } = useData();

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Carousel */}
        <HeroCarousel onAction={() => navigation.navigate('Restaurants')} />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item, idx) => idx.toString()}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Restaurants', { category: item.filter })}
                style={styles.categoryCard}
              >
                <Text style={styles.categoryEmoji}>{item.emoji || '🍽️'}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Popular Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Populaires</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Restaurants')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            numColumns={2}
            data={companies.slice(0, 6)}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <RestaurantCard
                restaurant={item}
                onClick={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  heroSection: {
    margin: SPACING.m,
    backgroundColor: COLORS.primary, // Keep green accent for Hero
    borderRadius: 16,
    padding: SPACING.l,
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textWhite,
    marginBottom: SPACING.m,
    width: '80%',
  },
  heroButtons: {
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  buttonPrimaryText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 14,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.s,
  },
  seeAll: {
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    fontSize: 14,
  },
  categoriesList: {
    paddingHorizontal: SPACING.m,
    gap: SPACING.m,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 4,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryName: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.m,
    justifyContent: 'space-between',
  },
});
