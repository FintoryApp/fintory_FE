import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/FindPassword.styles.ts';  
import { vScale } from '../../styles/Scale.styles.ts';
import { Colors } from '../../styles/Color.styles.ts';
import TopBar from '../../components/ui/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginInput from '../../components/login/LoginInput.tsx';
import BigButton from '../../components/button/BigButton.tsx';


export default function FindPasswordScreen() {
    const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('1234'); // 실제로는 서버에서 받아온 코드
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleCodeVerification = () => {
    if (code === verificationCode) {
      setIsCodeVerified(true);
      setVerificationMessage('인증번호가 일치합니다');
    } else {
      setIsCodeVerified(false);
      setVerificationMessage('인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        <TopBar title='비밀번호 변경하기' />

        <View style={{...styles.middleContainer,marginTop:top}}>
            
                <LoginInput 
                titleText="아이디" 
                placeholderText="아이디를 입력하세요" 
                value={id} 
                onChangeText={setId} 
                checkText='' />

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

        <View style={{
            position: 'absolute',
            top:vScale(370)+top,
            alignItems: 'center',
            alignSelf:'center',
        }}>
            <BigButton
                title='인증 완료하기'
                onPress={() => {
                    if(isCodeVerified) {
                        navigation.navigate('ChangePassword' as never);
                    }
                }}
                buttonColor={isCodeVerified ? Colors.primary : Colors.primaryDim}
                textColor={Colors.white}
                disabled={!isCodeVerified}
            />
        </View>

      
    </View>
  );
} 