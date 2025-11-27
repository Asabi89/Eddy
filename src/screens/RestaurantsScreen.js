import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import RestaurantCard from '../components/RestaurantCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function RestaurantsScreen({ navigation, route }) {
  const { companies, categories } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params]);

  const filteredRestaurants =
    selectedCategory === 'all'
      ? companies
      : companies.filter((r) => r.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurants</Text>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
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
      <FlatList
        style={styles.content}
        showsVerticalScrollIndicator={false}
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.title}>
          {selectedCategory === 'all' ? 'Tous les restaurants' : categories.find(c => c.filter === selectedCategory)?.name} à Cotonou
        </Text>}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onClick={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginRight: SPACING.s,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  filterBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.s,
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.s,
  },
  filterButton: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.text,
  },
  filterButtonTextActive: {
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.l,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
