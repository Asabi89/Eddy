import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <Image
        source={{ uri: restaurant.image }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        
        <View style={styles.row}>
           <MaterialIcons name="star" size={12} color="#eab308" />
           <Text style={styles.rating}>{restaurant.rating}</Text>
           <Text style={styles.dot}>•</Text>
           <Text style={styles.time}>{restaurant.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.s,
  },
  image: {
    width: '100%',
    height: 100, // Reduced height for mini card
  },
  content: {
    padding: SPACING.s,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 2,
  },
  dot: {
    color: COLORS.textLight,
    fontSize: 12,
    marginHorizontal: 4,
  },
  time: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
});
