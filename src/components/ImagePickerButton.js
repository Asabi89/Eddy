import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { COLORS, SPACING, FONTS } from '../theme';

export default function ImagePickerButton({ 
  imageUri, 
  onImageSelected, 
  size = 120,
  placeholder = 'Ajouter une image',
  style 
}) {
  
  const pickImage = async () => {
    Alert.alert(
      'Sélectionner une image',
      'Choisissez une source',
      [
        { 
          text: 'Appareil photo', 
          onPress: () => openCamera() 
        },
        { 
          text: 'Galerie', 
          onPress: () => openGallery() 
        },
        { 
          text: 'Annuler', 
          style: 'cancel' 
        },
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à la caméra');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à la galerie');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { width: size, height: size }, style]} 
      onPress={pickImage}
    >
      {imageUri ? (
        <Image 
          source={{ uri: imageUri }} 
          style={[styles.image, { width: size, height: size }]} 
        />
      ) : (
        <View style={styles.placeholder}>
          <ImageIcon size={32} color={COLORS.textLight} />
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      )}
      <View style={styles.cameraIcon}>
        <Camera size={16} color={COLORS.textWhite} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.s,
  },
  placeholderText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    padding: 6,
    borderRadius: 20,
  },
});
