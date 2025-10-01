import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/FindIdScreen.styles.ts';
import FindIdModal from '../../components/login/FindIdModal.tsx';
import Colors from '../../styles/Color.styles.ts';
import TopBar from '../../components/ui/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginInput from '../../components/login/LoginInput.tsx';
import BigButton from '../../components/button/BigButton.tsx';


export default function FindIdScreen() {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('1234'); // 실제로는 서버에서 받아온 코드
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCodeVerification = () => {
    if (code === verificationCode) {
      setIsCodeVerified(true);
      setVerificationMessage('인증번호가 일치합니다');
    } else {
      setIsCodeVerified(false);
      setVerificationMessage('인증번호가 일치하지 않습니다.');
    }
  };

  const handleNavigateToFirst = () => {
    navigation.navigate('First' as never);
  };

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        <TopBar title='아이디 찾기' />  

        <View style={{...styles.middleContainer,marginTop:top}}>
            
            
            <LoginInput 
                titleText="이메일 인증" 
                placeholderText="이메일을 입력하세요" 
                value={email} 
                onChangeText={setEmail} 
                checkText=''        
                showVerificationButton={true}
                onVerificationPress={handleCodeVerification}
                verificationButtonText='인증번호 받기' />
            
            <LoginInput 
                titleText="인증번호" 
                placeholderText="인증번호를 입력하세요" 
                value={code} 
                onChangeText={setCode} 
                checkText={verificationMessage}
                showVerificationButton={true}
                onVerificationPress={handleCodeVerification}
                verificationButtonText='인증번호 확인' 
                />
            
        </View>

        <View style={styles.bottomContainer}>
            <BigButton
                title='아이디 찾기'
                onPress={() => setIsModalVisible(true)}
            />
            <FindIdModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                id="babominseo"
                message="회원님의 아이디는"
                message2="입니다"
                onNavigateToFirst={handleNavigateToFirst}
            />
        </View>

      
    </View>
  );
} 