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
} from 'react-native';
import { COLORS, SPACING, FONTS } from '../theme';
import { useData } from '../context/DataContext';
import { Mail, Lock, LogIn } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const { login } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      // Parse error message from server
      let errorMessage = 'Email ou mot de passe incorrect';
      if (err.message) {
        if (err.message.includes('Invalid credentials') || err.message.includes('non_field_errors')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.message.includes('disabled')) {
          errorMessage = 'Ce compte a été désactivé';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Logo/Brand Section */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🍽️</Text>
            </View>
            <Text style={styles.brandName}>BeninEats</Text>
            <Text style={styles.brandTagline}>Savourez le Bénin, livré chez vous</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            <Text style={styles.title}>Connexion</Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Mail size={20} color={COLORS.textLight} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="kendouola@email.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Lock size={20} color={COLORS.textLight} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LogIn size={20} color="#fff" />
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.signupButton}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupButtonText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 36,
  },
  brandName: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  brandTagline: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#888',
  },
  formSection: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: 13,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f3460',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a4a7a',
  },
  inputIcon: {
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: '#1a4a7a',
  },
  input: {
    flex: 1,
    padding: 14,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1a4a7a',
  },
  dividerText: {
    color: '#666',
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginHorizontal: 16,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
});
