import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { hScale, vScale } from '../../styles/Scale.styles';
import { Colors } from '../../styles/Color.styles';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  height?: number;
}
const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  height = hScale(194),
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity, height]);

  const handleBackdropPress = () => {
    onClose();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        lastGestureDy.current = 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentValue = (slideAnim as any)._value;
        const newValue = Math.max(0, currentValue + gestureState.dy - lastGestureDy.current);
        slideAnim.setValue(newValue);
        lastGestureDy.current = gestureState.dy;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const currentValue = (slideAnim as any)._value;
        const velocity = gestureState.vy;
        
        // 빠르게 아래로 드래그하거나 절반 이상 내려갔으면 닫기
        if (velocity > 0.5 || currentValue > height / 2) {
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          // 원래 위치로 돌아가기
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                {
                  height,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
             
              {/* Handle Bar */}
              <View style={styles.handleBar} {...panResponder.panHandlers} />
              
              {/* Header */}
              {title && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity> */}
                </View>
              )}
              
              {/* Content */}
              <View style={styles.content}>
                {children}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: hScale(16),
    borderTopRightRadius: hScale(16),
    paddingTop: vScale(16),
    paddingHorizontal: hScale(16),
    paddingBottom: vScale(20),
    width: hScale(360),
    height: vScale(194),
  },
  handleBar: {
    width: hScale(64),
    height: vScale(4),
    backgroundColor: Colors.outlineVariant,
    borderRadius: hScale(2),
    alignSelf: 'center',
    marginBottom: vScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vScale(20),
  },
  title: {
    fontSize: hScale(18),
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButton: {
    width: hScale(24),
    height: vScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: hScale(16),
    color: Colors.outline,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});

export default BottomSheet;
