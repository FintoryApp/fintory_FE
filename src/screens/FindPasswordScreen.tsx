import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles, hScale } from '../styles/FindPassword.styles.ts';


export default function FindPasswordScreen() {
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [phoneNum1, setPhoneNum1] = useState('');
  const [phoneNum2, setPhoneNum2] = useState('');
  const [phoneNum3, setPhoneNum3] = useState('');
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
    <View style={styles.wholeContainer}>
        <View style={styles.topContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftButtonConainer}>
                <Image source={require('../../assets/icons/left.png')} style={styles.leftButton}/>
            </TouchableOpacity>
                
            <Text style={styles.topTitle}>비밀번호 변경하기</Text>
        </View>

        <View style={styles.middleContainer}>
            <View style={styles.idConatiner}>
                <Text style={styles.idTitle}>아이디</Text>
                <TextInput 
                    style={styles.idInput}
                    placeholder="아이디를 입력하세요"
                    placeholderTextColor="#AEAEAE"
                    value={id}
                    onChangeText={setId}
                />
            </View>
            <View style={styles.phoneNumContainer}>
                <View style={styles.phoneNumTitleContainer}>    
                    <Text style={styles.phoneNumTitle}>전화번호 인증</Text>
                    <TouchableOpacity style={styles.getCodeButton}>
                        <Text style={styles.getCodeButtonText}>인증번호 받기</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.phoneNumInputContainer}>
                <TextInput 
                    style={styles.phoneNumInput1}
                    placeholder="010"
                    placeholderTextColor="#AEAEAE"
                    value={phoneNum1}
                    onChangeText={setPhoneNum1}
                    />
                    <TextInput 
                    style={styles.phoneNumInput2}
                    placeholderTextColor="#AEAEAE"
                    value={phoneNum2}
                    onChangeText={setPhoneNum2}
                    
                    />
                    <TextInput 
                    style={styles.phoneNumInput3}
                    placeholderTextColor="#AEAEAE"
                    value={phoneNum3}
                    onChangeText={setPhoneNum3}
                    />
                </View>

            </View>
            <View style={styles.codeContainer}>
                <View style={styles.codeInputContainer}>
                    <View style={styles.codeInputTitleContainer}>
                        <Text style={styles.codeInputTitle}>인증번호</Text>
                        <TouchableOpacity style={styles.codeCheckContainer} onPress={handleCodeVerification}>
                            <Text style={styles.codeCheckText}>인증번호 확인</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput 
                        style={styles.codeInput}
                        placeholder="인증번호를 입력하세요"
                        placeholderTextColor="#AEAEAE"
                        value={code}
                        onChangeText={setCode}
                    /> 
                </View>
                <View style={styles.verificationMessageContainer}>
                    {verificationMessage !== '' && (
                        <Text style={[
                            styles.verificationMessage,
                            isCodeVerified ? styles.verificationSuccess : styles.verificationError
                        ]}>
                                {verificationMessage}
                            </Text>
                        )}
                    </View>
            </View>
        </View>

        <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.logInButton} onPress={() => {
                if(isCodeVerified) {
                    navigation.navigate('ChangePassword' as never);
                }
            }}>
                <Text style={styles.logInButtonText}>인증 완료하기</Text>
            </TouchableOpacity>
        </View>

      
    </View> //wholeContainer끝
  );
} 