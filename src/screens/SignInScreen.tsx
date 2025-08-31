import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FindIdModal from '../components/FindIdModal.tsx';
import Colors from '../styles/Color.styles.ts';
import TopBar from '../components/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginInput from '../components/LoginInput.tsx';
import BigButton from '../components/BigButton.tsx';
import { hScale, vScale } from '../styles/Scale.styles.ts';
import { 
  signup, 
  checkEmailDuplication
} from '../api/auth.ts';

export default function SignInScreen() {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailCheck, setEmailCheck] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordVerificationMessage, setPasswordVerificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

  // 이메일 중복 확인
  const handleEmailDuplicationCheck = async () => {
    if (!email) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkEmailDuplication(email);
      if (result.resultCode === 'SUCCESS' && result.data !== undefined) {
        // 백엔드 응답: data가 false면 사용 가능, true면 이미 사용 중
        if (result.data === false) {
          setEmailCheck('사용 가능한 이메일입니다.');
          setIsEmailVerified(true);
        } else {
          setEmailCheck('이미 사용 중인 이메일입니다.');
          setIsEmailVerified(false);
        }
      } else {
        setEmailCheck(result.message || '이메일 중복 확인 실패');
        setIsEmailVerified(false);
      }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      setEmailCheck('이메일 중복 확인 중 오류가 발생했습니다.');
      setIsEmailVerified(false);
      
      // AsyncStorage 관련 오류인지 확인
      if (error instanceof Error && error.message.includes('AsyncStorage')) {
        Alert.alert('오류', '앱 초기화 중입니다. 잠시 후 다시 시도해주세요.');
      } else {
        Alert.alert('오류', '이메일 중복 확인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 처리
  const handleSignup = async () => {
    if (!isEmailVerified || !isPasswordVerified) {
      Alert.alert('알림', '모든 인증을 완료해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup({
        nickname,
        password,
        email,
      });

      // 디버깅: API 응답 로그
      console.log('회원가입 API 응답:', result);

      if (result.resultCode === 'SUCCESS' && result.data) {
        Alert.alert('성공', result.message || '회원가입이 완료되었습니다. 자동으로 로그인됩니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home' as never), // 자동 로그인으로 Home으로 이동
          },
        ]);
      } else {
        Alert.alert('실패', result.message || '알 수 없는 오류');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToFirst = () => {
    navigation.navigate('First' as never);
  };

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        <TopBar title='회원가입' />  

        <View style={{...styles.middleContainer,marginTop:top}}>
            
            <LoginInput 
                titleText="닉네임" 
                placeholderText="닉네임을 입력하세요 (5~10자)" 
                value={nickname} 
                onChangeText={setNickname} 
                checkText=''
                />


        <LoginInput 
                titleText="비밀번호" 
                placeholderText="6~12자 영문 대 소문자, 숫자를 사용하세요" 
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
                titleText="이메일" 
                placeholderText="이메일을 입력하세요" 
                value={email} 
                onChangeText={setEmail} 
                checkText={emailCheck}        
                showVerificationButton={true}
                onVerificationPress={handleEmailDuplicationCheck}
                verificationButtonText='중복 확인' />
            
        </View>

        <View style={{
            position: 'absolute',
            top:vScale(650)+top,
            alignItems: 'center',
            alignSelf:'center',
        }}>

        <BigButton
            title='시작하기'
            onPress={handleSignup}
            buttonColor={(isEmailVerified && isPasswordVerified) ? Colors.primary : Colors.primaryDim}
            textColor={Colors.white}
            disabled={!(isEmailVerified && isPasswordVerified) || isLoading}
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