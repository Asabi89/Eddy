// screens/RestaurantsScreen.js - Écran liste des restaurants
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SCREENS, categories } from '../constants';
import { restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';

export default function RestaurantsScreen({ setCurrentScreen, setSelectedRestaurant }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRestaurants =
    selectedCategory === 'all'
      ? restaurants
      : restaurants.filter((r) => r.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.filter)}
              style={[
                styles.filterButton,
                selectedCategory === cat.filter && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === cat.filter && styles.filterButtonTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Restaurants List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Restaurants à Cotonou</Text>
        <FlatList
          scrollEnabled={false}
          numColumns={2}
          data={filteredRestaurants}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  filterBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  columnWrapper: {
    gap: 16,
  },
});
