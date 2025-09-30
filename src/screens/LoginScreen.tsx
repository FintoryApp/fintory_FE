import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/LoginScreen.styles.ts';
import { hScale,vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles.ts';
import TopBar from '../components/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginInput from '../components/LoginInput.tsx';
import BigButton from '../components/BigButton.tsx';
import { login } from '../api/auth.ts';

export default function LoginScreen() {
    const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
        const result = await login(email, password);
      if (result.resultCode === 'SUCCESS' && result.data) {
        console.log('로그인 성공');
        Alert.alert('성공', '로그인이 완료되었습니다.', [
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
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        <TopBar title='로그인' />

        <View style={{...styles.middleContainer,marginTop:vScale(64)+top}}>
            
                <LoginInput 
                titleText="이메일" 
                placeholderText="이메일을 입력하세요" 
                value={email} 
                onChangeText={setEmail} 
                checkText='' />

                <LoginInput 
                titleText="비밀번호" 
                placeholderText="비밀번호를 입력하세요" 
                value={password} 
                onChangeText={setPassword} 
                checkText=''
                secureTextEntry={true} />
            
        </View>

        <View style={{...styles.bottomContainer,top:vScale(440)+top}}>
            
                <BigButton
                    title='로그인'
                    onPress={handleLogin}
                    buttonColor={Colors.primary}
                    textColor={Colors.white}
                    disabled={isLoading}
                />

            <View style={styles.findContainer}>
                <TouchableOpacity style={styles.findButton} onPress={()=> navigation.navigate('FindId' as never)}>
                    <View>
                        <Text style={styles.findButtonText}>아이디 찾기</Text>
                        <View style={styles.underline} />
                    </View>
                </TouchableOpacity>
                <View style={{ width: hScale(64) }} />
                <TouchableOpacity style={styles.findButton} onPress={() => navigation.navigate('FindPassword' as never)}>
                    <View>
                        <Text style={styles.findButtonText}>비밀번호 찾기</Text>
                        <View style={styles.underline} />
                    </View>
                </TouchableOpacity>
            </View>


        </View>
      
    </View>
  );
} 