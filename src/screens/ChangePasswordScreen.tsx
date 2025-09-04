import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/ChangePasswordScreen.styles.ts';
import { hScale,vScale } from '../styles/Scale.styles.ts';
import { Colors } from '../styles/Color.styles.ts';
import TopBar from '../components/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PasswordModal from '../components/PasswordModal.tsx';
import LoginInput from '../components/LoginInput.tsx';
import BigButton from '../components/BigButton.tsx';

export default function ChangePasswordScreen() {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');


  // 비밀번호 확인 입력값이 변경될 때마다 확인
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text === newPassword && text !== '') {
      setIsPasswordVerified(true);
      setVerificationMessage('비밀번호가 일치합니다');
    } else if (text !== '') {
      setIsPasswordVerified(false);
      setVerificationMessage('비밀번호가 일치하지 않습니다.');
    } else {
      setIsPasswordVerified(false);
      setVerificationMessage('');
    }
  };

  const message = '비밀번호 변경이\n완료되었습니다.';

  const handleModalClose = () => {
    setShowModal(false);
    // Navigate to LoginScreen after modal closes
    navigation.navigate('Login' as never);
  };

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface,alignItems:'center',}}>
        <TopBar title='비밀번호 변경하기' />

        <View style={{...styles.middleContainer,marginTop:top}}>
        <LoginInput
            titleText="새로운 비밀번호"
            placeholderText="새로운 비밀번호를 입력하세요"
            value={newPassword}
            onChangeText={setNewPassword}
            checkText=''
            secureTextEntry={true}
        />

        <LoginInput
            titleText="새로운 비밀번호 확인"
            placeholderText="새로운 비밀번호를 입력하세요"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            checkText={verificationMessage}
            secureTextEntry={true}
        />
        </View>

        <View style={{
            position: 'absolute',
            top:vScale(370)+top,
            alignItems: 'center',
            alignSelf:'center',
        }}>

        <BigButton
            title='비밀번호 변경하기'
            onPress={()=>{
                if(newPassword === confirmPassword && newPassword !== ''){
                    setShowModal(true);
                }
            }}
            buttonColor={isPasswordVerified ? Colors.primary : Colors.primaryDim}
            textColor={Colors.white}
            disabled={!isPasswordVerified}
        />
        </View>
         
         
        
        <PasswordModal
            isVisible={showModal}
            onClose={handleModalClose}
            message={message}
        />
      
    </View> //wholeContainer끝
  );
}