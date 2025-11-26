// screens/HomeScreen.js - Écran d'accueil
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SCREENS } from '../constants';
import { restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';

export default function HomeScreen({ setCurrentScreen, setSelectedRestaurant }) {
  const categories = [
    { emoji: '🍗', name: 'Plats Locaux' },
    { emoji: '🍔', name: 'Fast Food' },
    { emoji: '🐟', name: 'Poissons' },
    { emoji: '🍰', name: 'Desserts' },
    { emoji: '🍷', name: 'Boissons' },
    { emoji: '🥚', name: 'Petit-déj' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Commandez vos plats préférés au Bénin</Text>
        <Text style={styles.heroSubtitle}>
          Livraison rapide de plats locaux et internationaux
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity
            onPress={() => setCurrentScreen(SCREENS.RESTAURANTS)}
            style={styles.buttonPrimary}
          >
            <Text style={styles.buttonPrimaryText}>Commander maintenant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentScreen(SCREENS.RESTAURANTS)}
            style={styles.buttonSecondary}
          >
            <Text style={styles.buttonSecondaryText}>Voir les restaurants</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Catégories populaires</Text>
        <FlatList
          scrollEnabled={false}
          numColumns={3}
          data={categories}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCurrentScreen(SCREENS.RESTAURANTS)}
              style={styles.categoryCard}
            >
              <Text style={styles.categoryEmoji}>{item.emoji}</Text>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Popular Restaurants */}
      <View style={styles.restaurantsSection}>
        <Text style={styles.sectionTitle}>Restaurants populaires à Cotonou</Text>
        <FlatList
          scrollEnabled={false}
          numColumns={2}
          data={restaurants.slice(0, 4)}
          keyExtractor={(item) => item.id.toString()}
          gap={16}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onClick={() => {
                setSelectedRestaurant(item);
                setCurrentScreen(SCREENS.RESTAURANT_DETAIL);
              }}
            />
          )}
        />
      </View>

      {/* Benefits */}
      <View style={styles.benefitsSection}>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitEmoji}>⚡</Text>
          <Text style={styles.benefitTitle}>Livraison Rapide</Text>
          <Text style={styles.benefitText}>
            Livraison en moins de 30 minutes dans Cotonou
          </Text>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitEmoji}>🛡️</Text>
          <Text style={styles.benefitTitle}>Paiement Sécurisé</Text>
          <Text style={styles.benefitText}>
            Paiement par carte, Mobile Money ou cash
          </Text>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitEmoji}>🍽️</Text>
          <Text style={styles.benefitTitle}>Meilleurs Restaurants</Text>
          <Text style={styles.benefitText}>
            Découvrez les restaurants les mieux notés
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  heroSection: {
    backgroundColor: '#16a34a',
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  heroButtons: {
    width: '100%',
    gap: 12,
  },
  buttonPrimary: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#15803d',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  categoriesSection: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  categoryCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    margin: 8,
    borderRadius: 8,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  restaurantsSection: {
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  columnWrapper: {
    gap: 16,
  },
  benefitsSection: {
    backgroundColor: '#16a34a',
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 24,
  },
  benefitItem: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  benefitEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});
