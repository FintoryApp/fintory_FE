import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';

import { Colors } from '../styles/Color.styles';

interface BuyStockModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
}

const BuyStockModal: React.FC<BuyStockModalProps> = ({
  isVisible,
  onClose,
  message = '구매가 완료되었습니다!',
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // 2초 후 자동 닫기

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [isVisible, onClose]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
        
            <Text style={styles.message}>{message}</Text>
            
          
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
    height: vScale(120),
    backgroundColor: '#94D585',
    borderRadius: hScale(16),
    paddingHorizontal: hScale(86),
    paddingVertical: vScale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    fontSize: hScale(16),
    color: Colors.primaryDark,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default BuyStockModal; 