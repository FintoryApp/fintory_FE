import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import MiddleButton from './MiddleButton';


interface SimpleModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  id: string;
  message2: string;
  confirmText?: string;
  onConfirm?: () => void;
  onNavigateToFirst?: () => void;
}

const FindIdModal: React.FC<SimpleModalProps> = ({
  isVisible,
  onClose,
  message = '회원님의 아이디는',
  message2 = '입니다',
  confirmText = '확인',
  id,
  onConfirm,
  onNavigateToFirst,
}) => {
  const handleConfirm = () => {
    onClose();
    if (onNavigateToFirst) {
      onNavigateToFirst();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.id}>{id}</Text>
            <Text style={styles.message2}>{message2}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <MiddleButton 
              title={confirmText} 
              onPress={handleConfirm}
              buttonColor="#00C900"
              textColor="white"
            />
          </View>
        </View>
      </View>
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
    height: vScale(216),
    backgroundColor: 'white',
    borderRadius: hScale(12),
    padding: hScale(16),
  },
  modalContent: {
    alignItems: 'center',
    width: hScale(296),
    height: vScale(115),
    position: 'absolute',
    left: hScale(16),
    top: vScale(16),
  },
  
  message: {
    fontSize: hScale(24),
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
  },
  id: {
    fontSize: hScale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    top: vScale(41),
    position: 'absolute',
    color: '#00C900',
  },
  message2: {
    fontSize: hScale(24),
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    top: vScale(82),
    position: 'absolute',
  },

  confirmButton: {
    backgroundColor: '#00C900',
    paddingHorizontal: hScale(20),
    borderRadius: hScale(12),
    alignItems: 'center',
    top: vScale(152),
    position: 'absolute',
    width: hScale(296),
    height: vScale(48),
    left: hScale(16),
  },
  
  confirmButtonText: {
    fontSize: hScale(24),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: vScale(48),
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: vScale(147),
    alignSelf:'center',
    position: 'absolute',
  },
});

export default FindIdModal; 