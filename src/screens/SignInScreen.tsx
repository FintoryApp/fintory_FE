import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FindIdModal from '../components/FindIdModal.tsx';
import Colors from '../styles/Color.styles.ts';
import TopBar from '../components/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginInput from '../components/LoginInput.tsx';
import BigButton from '../components/BigButton.tsx';
import { hScale, vScale } from '../styles/Scale.styles.ts';


export default function SignInScreen() {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [idCheck, setIdCheck] = useState('');
  const idList = ['babominseo', 'babominseo2', 'babominseo3'];
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('1234'); // 실제로는 서버에서 받아온 코드
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordVerificationMessage, setPasswordVerificationMessage] = useState('');
  const [isIdVerified, setIsIdVerified] = useState(false);
  
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text === password && text !== '') {
      setIsPasswordVerified(true);
      setPasswordVerificationMessage('비밀번호가 일치합니다');
    } else if (text !== '') {
      setIsPasswordVerified(false);
      setPasswordVerificationMessage('비밀번호가 일치하지 않습니다.');
    } else {
      setIsPasswordVerified(false);
      setPasswordVerificationMessage('');
    }
  };

  const handleCodeVerification = () => {
    if (code === verificationCode && verificationCode !== '') {
      setIsCodeVerified(true);
      setVerificationMessage('인증번호가 일치합니다');
    } else {
      setIsCodeVerified(false);
      setVerificationMessage('인증번호가 일치하지 않습니다.');
    }
  };

  const handleIdDuplicationCheck = () => {
    console.log('아이디 중복 체크');
    if (idList.includes(id)) {
        setIdCheck('중복된 아이디입니다.');
        setIsIdVerified(false);
    } else {
        setIdCheck('사용 가능한 아이디입니다.');
        setIsIdVerified(true);
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
                titleText="아이디" 
                placeholderText="아이디를 입력하세요" 
                value={id} 
                onChangeText={setId} 
                checkText={idCheck}        
                showVerificationButton={true}
                onVerificationPress={handleIdDuplicationCheck}
                verificationButtonText='중복 확인' />
            
            <LoginInput 
                titleText="닉네임" 
                placeholderText="닉네임 입력하세요" 
                value={nickname} 
                onChangeText={setNickname} 
                checkText=''
                />


        <LoginInput 
                titleText="비밀번호" 
                placeholderText="비밀번호 입력하세요" 
                value={password} 
                onChangeText={setPassword} 
                checkText=''
                secureTextEntry={true}
                />
        <LoginInput
            titleText="비밀번호 확인"
            placeholderText="비밀번호를 입력하세요"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            checkText={passwordVerificationMessage}
            secureTextEntry={true}
        />

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
            top:vScale(650)+top,
            alignItems: 'center',
            alignSelf:'center',
        }}>

        <BigButton
            title='시작하기'
            onPress={()=>{
                if(isIdVerified && isCodeVerified && isPasswordVerified){
                    // 회원가입 로직 실행

                }
            }}
            buttonColor={(isIdVerified && isCodeVerified && isPasswordVerified) ? Colors.primary : Colors.primaryDim}
            textColor={Colors.white}
            disabled={!(isIdVerified && isCodeVerified && isPasswordVerified)}
        />
        </View>
        

      
    </View> //wholeContainer끝
  );
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    middleContainer: {
        width: hScale(360),
        height: 'auto',
        alignContent:'center',
        alignItems:'center',
    },
});