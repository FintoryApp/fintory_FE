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

  // 이메일 입력값이 변경될 때 이메일 검증 상태 리셋
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text !== email) {
      setIsEmailVerified(false);
      setEmailCheck('');
    }
  };

  // 닉네임 입력값이 변경될 때 닉네임 검증 상태 리셋
  const handleNicknameChange = (text: string) => {
    setNickname(text);
    // 닉네임이 5-10자 범위를 벗어나면 검증 실패
    if (text.length < 5 || text.length > 10) {
      // 닉네임 검증 실패 시 시작하기 버튼 비활성화를 위해 별도 상태 관리
      // 여기서는 단순히 닉네임 길이만 체크
    }
  };

  // 비밀번호 입력값이 변경될 때 비밀번호 확인 상태 리셋
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // 비밀번호가 변경되면 비밀번호 확인도 다시 검증해야 함
    if (confirmPassword !== '') {
      if (text === confirmPassword && text !== '') {
        setIsPasswordVerified(true);
        setPasswordVerificationMessage('비밀번호가 일치합니다');
      } else {
        setIsPasswordVerified(false);
        setPasswordVerificationMessage('비밀번호가 일치하지 않습니다.');
      }
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
        // 닉네임과 포인트를 AsyncStorage에 저장
        try {
          await AsyncStorage.setItem('nickname', nickname);
          await AsyncStorage.setItem('points', '0');
        } catch (error) {
          console.error('Error saving user data:', error);
        }
        
        Alert.alert('성공', result.message || '회원가입이 완료되었습니다. 자동으로 로그인됩니다.', [
          {
            text: '확인',
            onPress: () =>
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Main' }],
              }),
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
            isCheckTextSuccess={isPasswordVerified}
        />

        <LoginInput 
                titleText="이메일" 
                placeholderText="이메일을 입력하세요" 
                value={email} 
                onChangeText={handleEmailChange} 
                checkText={emailCheck}        
                showVerificationButton={true}
                onVerificationPress={handleEmailDuplicationCheck}
                verificationButtonText='중복 확인'
                isCheckTextSuccess={isEmailVerified} />
            
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
        

      
    </View>
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