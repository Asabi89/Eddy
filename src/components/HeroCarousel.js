import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - (SPACING.m * 2);

const HERO_SLIDES = [
  {
    id: 1,
    title: "Vos plats préférés, livrés rapidement",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    buttonText: "Commander"
  },
  {
    id: 2,
    title: "Découvrez les meilleurs restaurants",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    buttonText: "Explorer"
  },
  {
    id: 3,
    title: "Cuisine locale et authentique",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800",
    buttonText: "Voir Menu"
  }
];

export default function HeroCarousel({ onAction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < HERO_SLIDES.length - 1) {
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        setCurrentIndex(currentIndex + 1);
      } else {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={HERO_SLIDES}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
          setCurrentIndex(index);
        }}
      />
      <View style={styles.dotsContainer}>
        {HERO_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    margin: SPACING.m,
    borderRadius: 16,
    overflow: 'hidden',
  },
  slide: {
    width: SLIDE_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: SLIDE_WIDTH,
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay for text readability
  },
  content: {
    position: 'absolute',
    bottom: SPACING.l,
    left: SPACING.m,
    right: SPACING.m,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textWhite,
    marginBottom: SPACING.s,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: SPACING.s,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
