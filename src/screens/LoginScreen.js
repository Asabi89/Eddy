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

export default function LoginScreen({ navigation }) {
  const { login } = useData();
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Signup UI modes visually if needed, but we have separate screens now. 
  // Actually, based on AppNavigator, we have separate Login and Signup screens.
  // So this screen should focus on Login.

  const [email, setEmail] = useState('client@test.com'); // Pre-filled for demo
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    // Simple mock logic to determine role based on email for demo purposes
    let role = 'client';
    if (email.includes('manager')) role = 'manager';
    else if (email.includes('driver')) role = 'driver';
    else if (email.includes('admin')) role = 'admin';

    await login(email, password, role);
    // Navigation is automatic via AppNavigator state change
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Bienvenue sur BeninEats</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

            <View style={styles.formContainer}>
              {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@exemple.com"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
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

              <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
                <Text style={styles.submitButtonText}>Se connecter</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Pas encore de compte ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.linkText}>S'inscrire</Text>
                </TouchableOpacity>
              </View>
              
              {/* Demo Hints */}
              <View style={styles.demoHints}>
                <Text style={styles.demoTitle}>Comptes de démo :</Text>
                <Text style={styles.demoText}>• client@test.com</Text>
                <Text style={styles.demoText}>• manager@test.com</Text>
                <Text style={styles.demoText}>• driver@test.com</Text>
                <Text style={styles.demoText}>• admin@test.com</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  innerContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.textLight,
    marginBottom: 24,
  },
  formContainer: {
    // padding removed as card has padding
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: COLORS.error,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  linkText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  demoHints: {
    marginTop: 32,
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  demoTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.textLight,
    marginBottom: 8,
    fontSize: 12,
  },
  demoText: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontSize: 12,
    marginBottom: 4,
  },
});
