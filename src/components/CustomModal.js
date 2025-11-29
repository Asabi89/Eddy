import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { COLORS, SPACING, FONTS } from '../theme';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react-native';

export default function CustomModal({
  visible,
  onClose,
  title,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info', 'confirm'
  confirmText = 'OK',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  children,
}) {
  const getIcon = () => {
    const iconSize = 48;
    switch (type) {
      case 'success':
        return <CheckCircle size={iconSize} color="#10b981" />;
      case 'error':
        return <AlertCircle size={iconSize} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={iconSize} color="#f59e0b" />;
      default:
        return <Info size={iconSize} color={COLORS.primary} />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'success':
        return '#10b98120';
      case 'error':
        return '#ef444420';
      case 'warning':
        return '#f59e0b20';
      default:
        return COLORS.primaryLight;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
            {getIcon()}
          </View>

          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Message */}
          {message && <Text style={styles.message}>{message}</Text>}

          {/* Custom Content */}
          {children}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {type === 'confirm' && (
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[
                styles.confirmButton, 
                type === 'confirm' && styles.confirmButtonHalf,
                type === 'error' && styles.errorButton,
              ]} 
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Alert helper function
export const showAlert = (setModalState) => ({
  success: (title, message) => setModalState({ visible: true, type: 'success', title, message }),
  error: (title, message) => setModalState({ visible: true, type: 'error', title, message }),
  warning: (title, message) => setModalState({ visible: true, type: 'warning', title, message }),
  info: (title, message) => setModalState({ visible: true, type: 'info', title, message }),
  confirm: (title, message, onConfirm, onCancel) => 
    setModalState({ visible: true, type: 'confirm', title, message, onConfirm, onCancel }),
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.m,
    right: SPACING.m,
    padding: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.l,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.m,
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonHalf: {
    flex: 1,
  },
  errorButton: {
    backgroundColor: '#ef4444',
  },
  confirmButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textWhite,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
  },
});
