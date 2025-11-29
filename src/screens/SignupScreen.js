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
import { User, Mail, Phone, Lock, UserPlus, ArrowLeft } from 'lucide-react-native';
import CustomModal from '../components/CustomModal';

export default function SignupScreen({ navigation }) {
  const { signup } = useData();
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
  
  // Restaurant fields for managers
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');

  const roles = [
    { id: 'client', label: 'Client', emoji: '👤' },
    { id: 'manager', label: 'Gérant', emoji: '👔' },
    { id: 'driver', label: 'Livreur', emoji: '🛵' },
  ];

  const handleSignup = async () => {
    if (!name || !email || !password || !phone) {
      setModal({
        visible: true,
        type: 'warning',
        title: 'Champs requis',
        message: 'Veuillez remplir tous les champs',
      });
      return;
    }

    if (role === 'manager' && !restaurantName) {
      setModal({
        visible: true,
        type: 'warning',
        title: 'Nom du restaurant requis',
        message: 'Veuillez entrer le nom de votre restaurant',
      });
      return;
    }

    setIsLoading(true);
    try {
      const signupData = {
        username: email.split('@')[0],
        email,
        password,
        password_confirm: password,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || '',
        phone,
        role,
      };
      
      if (role === 'manager') {
        signupData.restaurant_name = restaurantName;
        signupData.restaurant_address = restaurantAddress || 'Cotonou, Bénin';
        signupData.restaurant_phone = phone;
      }
      
      console.log('Signup data:', JSON.stringify(signupData));
      await signup(signupData);
    } catch (error) {
      setModal({
        visible: true,
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Échec de l\'inscription',
      });
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
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez BeninEats aujourd'hui</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Role Selection */}
            <Text style={styles.label}>Je suis :</Text>
            <View style={styles.roleContainer}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.roleButton, role === r.id && styles.roleButtonActive]}
                  onPress={() => setRole(r.id)}
                >
                  <Text style={styles.roleEmoji}>{r.emoji}</Text>
                  <Text style={[styles.roleText, role === r.id && styles.roleTextActive]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={20} color={COLORS.textLight} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Kendou Ola"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Mail size={20} color={COLORS.textLight} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="kendouola@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone size={20} color={COLORS.textLight} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="+229 00 00 00 00"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Password Input */}
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

            {/* Restaurant Fields for Managers */}
            {role === 'manager' && (
              <>
                <Text style={styles.sectionLabel}>Informations du restaurant</Text>
                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <User size={20} color={COLORS.textLight} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Nom du restaurant"
                    placeholderTextColor="#666"
                    value={restaurantName}
                    onChangeText={setRestaurantName}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <Mail size={20} color={COLORS.textLight} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Adresse du restaurant"
                    placeholderTextColor="#666"
                    value={restaurantAddress}
                    onChangeText={setRestaurantAddress}
                  />
                </View>
              </>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
              onPress={handleSignup}
              disabled={isLoading}
            >
              <UserPlus size={20} color="#fff" />
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={modal.visible}
        onClose={() => setModal({ ...modal, visible: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
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
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
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
  label: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#0f3460',
    borderWidth: 2,
    borderColor: '#1a4a7a',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  roleEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  roleText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: '#888',
  },
  roleTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
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
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: FONTS.regular,
    color: '#888',
  },
  linkText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
