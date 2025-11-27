import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { COLORS, SPACING, FONTS } from '../theme';
import { useData } from '../context/DataContext';

export default function SignupScreen({ navigation }) {
  const { signup } = useData();
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    await signup({
      name,
      email,
      phone,
      role,
    });
    // Navigation logic will be handled by AppNavigator based on isAuthenticated
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Créer un compte</Text>

          <View style={styles.roleContainer}>
            <Text style={styles.label}>Je suis :</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'client' && styles.roleButtonActive]}
                onPress={() => setRole('client')}
              >
                <Text style={[styles.roleButtonText, role === 'client' && styles.activeText]}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'manager' && styles.roleButtonActive]}
                onPress={() => setRole('manager')}
              >
                <Text style={[styles.roleButtonText, role === 'manager' && styles.activeText]}>Gestionnaire</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'driver' && styles.roleButtonActive]}
                onPress={() => setRole('driver')}
              >
                <Text style={[styles.roleButtonText, role === 'driver' && styles.activeText]}>Livreur</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={COLORS.textLight}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="+229 00000000"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
            <Text style={styles.submitButtonText}>S'inscrire</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.m,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: SPACING.l,
    textAlign: 'center',
  },
  roleContainer: {
    marginBottom: SPACING.m,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginTop: SPACING.s,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleButtonText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  activeText: {
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  formGroup: {
    marginBottom: SPACING.m,
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  submitButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.l,
  },
  footerText: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  linkText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
