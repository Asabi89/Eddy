// screens/LoginScreen.js - Écran de connexion/inscription
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
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[0-9]{8,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleLogin = () => {
    setError('');
    if (!loginEmail.trim()) {
      setError('Email ou téléphone requis');
      return;
    }
    if (!loginPassword.trim()) {
      setError('Mot de passe requis');
      return;
    }
    if (loginPassword.length < 6) {
      setError('Mot de passe doit contenir au moins 6 caractères');
      return;
    }
    // Success
    setError('');
    alert('Connexion réussie!');
  };

  const handleSignup = () => {
    setError('');
    if (!signupFirstName.trim()) {
      setError('Prénom requis');
      return;
    }
    if (!signupLastName.trim()) {
      setError('Nom requis');
      return;
    }
    if (!signupEmail.trim() || !validateEmail(signupEmail)) {
      setError('Email invalide');
      return;
    }
    if (!signupPhone.trim() || !validatePhone(signupPhone)) {
      setError('Téléphone invalide (minimum 8 chiffres)');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    // Success
    setError('');
    alert('Inscription réussie!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setIsLogin(true)}
                style={[styles.tab, isLogin && styles.tabActive]}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                  Connexion
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsLogin(false)}
                style={[styles.tab, !isLogin && styles.tabActive]}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                  Inscription
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Form */}
            {isLogin ? (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Connectez-vous à votre compte</Text>

                {error && <Text style={styles.errorMessage}>{error}</Text>}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email ou téléphone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="email@exemple.com"
                    placeholderTextColor="#999"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                </View>

                <View style={styles.rememberContainer}>
                  <TouchableOpacity style={styles.checkbox}>
                    <MaterialIcons name="check-box" size={20} color="#16a34a" />
                  </TouchableOpacity>
                  <Text style={styles.rememberText}>Se souvenir de moi</Text>
                  <TouchableOpacity style={{ marginLeft: 'auto' }}>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
                  <Text style={styles.submitButtonText}>Se connecter</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Ou connectez-vous avec</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Text style={styles.socialButtonText}>f</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Text style={styles.socialButtonText}>G</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Signup Form */
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Créez votre compte</Text>

                {error && <Text style={styles.errorMessage}>{error}</Text>}

                <View style={styles.nameRow}>
                  <View style={[styles.formGroup, styles.nameField]}>
                    <Text style={styles.label}>Prénom</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Prénom"
                      placeholderTextColor="#999"
                      value={signupFirstName}
                      onChangeText={setSignupFirstName}
                    />
                  </View>
                  <View style={[styles.formGroup, styles.nameField]}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nom"
                      placeholderTextColor="#999"
                      value={signupLastName}
                      onChangeText={setSignupLastName}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="email@exemple.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    value={signupEmail}
                    onChangeText={setSignupEmail}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Téléphone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+229 XX XX XX XX"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={signupPhone}
                    onChangeText={setSignupPhone}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Confirmer le mot de passe</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={signupConfirmPassword}
                    onChangeText={setSignupConfirmPassword}
                  />
                </View>

                <View style={styles.agreeContainer}>
                  <TouchableOpacity style={styles.checkbox}>
                    <MaterialIcons name="check-box" size={20} color="#16a34a" />
                  </TouchableOpacity>
                  <Text style={styles.agreeText}>
                    J'accepte les{' '}
                    <Text style={styles.agreeLink}>conditions d'utilisation</Text>
                  </Text>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
                  <Text style={styles.submitButtonText}>S'inscrire</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16a34a',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#16a34a',
    borderBottomColor: '#16a34a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tabTextActive: {
    color: '#fff',
  },
  formContainer: {
    padding: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 13,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 13,
    color: '#374151',
  },
  forgotText: {
    fontSize: 13,
    color: '#16a34a',
  },
  agreeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  agreeText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  agreeLink: {
    color: '#16a34a',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    fontSize: 12,
    color: '#666',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
