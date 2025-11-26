// components/Footer.js - Composant Footer
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.column}>
          <Text style={styles.title}>BeninEats</Text>
          <Text style={styles.description}>
            La meilleure façon de commander vos plats préférés au Bénin.
          </Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.subtitle}>Liens rapides</Text>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Accueil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Restaurants</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Devenir partenaire</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Aide</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          <Text style={styles.subtitle}>Contact</Text>
          <Text style={styles.contactInfo}>📞 +229 61 23 45 67</Text>
          <Text style={styles.contactInfo}>✉️ contact@benineats.bj</Text>
          <Text style={styles.contactInfo}>📍 Cotonou, Bénin</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.subtitle}>Téléchargez l'app</Text>
          <TouchableOpacity style={styles.appButton}>
            <Text style={styles.appButtonEmoji}>🍎</Text>
            <View>
              <Text style={styles.appButtonSmall}>Télécharger sur</Text>
              <Text style={styles.appButtonBold}>App Store</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appButton}>
            <Text style={styles.appButtonEmoji}>📱</Text>
            <View>
              <Text style={styles.appButtonSmall}>Disponible sur</Text>
              <Text style={styles.appButtonBold}>Google Play</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 BeninEats. Tous droits réservés.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    marginBottom: 32,
  },
  column: {
    flex: 1,
    minWidth: 150,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
  },
  link: {
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  contactInfo: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  appButton: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appButtonEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  appButtonSmall: {
    fontSize: 12,
    color: '#fff',
  },
  appButtonBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    marginBottom: 32,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
