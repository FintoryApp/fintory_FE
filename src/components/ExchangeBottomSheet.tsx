import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles';
import BottomSheet from './ui/BottomSheet';
import BigButton from './button/BigButton';
import { exchangePoint } from '../api/exchangePoint';

interface ExchangeBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  totalPoint: number;
  onExchange: (amount: number) => void;
}

const ExchangeBottomSheet: React.FC<ExchangeBottomSheetProps> = ({
  visible,
  onClose,
  totalPoint,
  onExchange,
}) => {
  const [exchangeAmount, setExchangeAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setExchangeAmount(amount.toString());
  };

  const handleQuickAmountPress = (amount: string) => {
    let amountToAdd = 0;
    
    if (amount === '전액') {
      amountToAdd = totalPoint;
    } else {
      // "+1,000 P" 형태에서 숫자만 추출
      const numericPart = amount.replace(/[^0-9]/g, '');
      amountToAdd = parseInt(numericPart, 10);
    }
    
    const currentAmount = parseInt(exchangeAmount, 10) || 0;
    const newAmount = currentAmount + amountToAdd;
    
    // 총 포인트를 초과하지 않도록 제한
    const finalAmount = Math.min(newAmount, totalPoint);
    setExchangeAmount(finalAmount.toString());
  };

  const handleExchange = async () => {
    const amount = parseInt(exchangeAmount, 10);
    
    if (!amount || amount <= 0) {
      Alert.alert('알림', '환전할 금액을 입력해주세요.');
      return;
    }
    
    if (amount > totalPoint) {
      Alert.alert('알림', '보유 포인트보다 많은 금액을 환전할 수 없습니다.');
      return;
    }
    
    if (amount < 100) {
      Alert.alert('알림', '최소 환전 금액은 100P입니다.');
      return;
    }

    Alert.alert(
      '환전 확인',
      `${amount.toLocaleString()}P를 가상머니로 환전하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '환전',
          onPress: async () => {
            try {
              // API 호출
              const response = await exchangePoint(amount);
              
              if (response.resultCode === 'SUCCESS') {
                Alert.alert('성공', '포인트가 성공적으로 환전되었습니다.');
                onExchange(amount);
                onClose();
              } else {
                Alert.alert('오류', response.message || '환전에 실패했습니다.');
              }
            } catch (error) {
              console.error('환전 API 호출 실패:', error);
              Alert.alert('오류', '환전 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
          },
        },
      ]
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={hScale(194)}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
        <TextInput 
          style={styles.placeHolderStyle} 
          placeholder='얼마를 환전할까요?' 
          placeholderTextColor={Colors.outlineVariant}
          value={exchangeAmount}
          onChangeText={setExchangeAmount}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
            <QuickAmountButton amount={'+1,000 P'} width={hScale(71)} onPress={() => handleQuickAmountPress('+1,000 P')} />
            <QuickAmountButton amount={'+5,000 P'} width={hScale(71)} onPress={() => handleQuickAmountPress('+5,000 P')} />
            <QuickAmountButton amount={'+10,000 P'} width={hScale(81)} onPress={() => handleQuickAmountPress('+10,000 P')} />
            <QuickAmountButton amount={'전액'} width={hScale(55)} onPress={() => handleQuickAmountPress('전액')} />
        </View>
        </View>
        
      </View>
      <BigButton title='환전하기' buttonColor={Colors.primary} textColor={Colors.white} onPress={handleExchange} height={hScale(48)} />
    </BottomSheet>
  );
};


const QuickAmountButton = ({amount,width,onPress}: {amount: string,width: number,onPress: () => void}) => {
  return (
    <TouchableOpacity style={[styles.quickAmountButton,{width:width}]} onPress={onPress}>
      <Text style={styles.quickAmountButtonText}>{amount}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: hScale(328),
    height: vScale(82),
    marginBottom: vScale(16),
  },
  inputContainer: {
    width: hScale(328),
    height: vScale(62),
  },
  placeHolderStyle: {
    fontSize: hScale(16),
    fontWeight: 'bold',
    color: Colors.black,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: hScale(328),
    height: vScale(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickAmountButton: {
    height: vScale(24),
    backgroundColor: Colors.outlineVariant,
    borderRadius:999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAmountButtonText: {
    fontSize: hScale(12),
    fontWeight: 'bold',
    color: Colors.middleGray,
  },
});

export default ExchangeBottomSheet;
