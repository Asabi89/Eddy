import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search, MapPin, RefreshCw } from 'lucide-react-native';
import { COLORS, SPACING, FONTS } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';

export default function Header({ showSearch = true }) {
  const insets = useSafeAreaInsets();
  const { userLocation, locationLoading, refreshLocation } = useData();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>BeninEats</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.locationContainer}
          onPress={refreshLocation}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <MapPin size={14} color={COLORS.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {userLocation?.city || 'Localisation...'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <Search size={18} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor={COLORS.textLight}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
    backgroundColor: COLORS.background, // Match background to remove border visually
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.s, 
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8, // Slightly less rounded for modern look
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 14,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.text,
    maxWidth: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.m,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.s,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
});
