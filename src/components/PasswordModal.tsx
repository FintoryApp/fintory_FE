import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

interface PasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  duration?: number; 
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isVisible,
  onClose,
  message,
  duration = 3000,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Show animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Message */}
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: hScale(328),
    height: vScale(138),
    backgroundColor: Colors.primary,
    borderRadius: hScale(16),
    paddingHorizontal: hScale(16),
    paddingVertical: vScale(36),
    alignItems: 'center',
  },
  message: {
    fontSize: hScale(24),
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
});

export default PasswordModal; 