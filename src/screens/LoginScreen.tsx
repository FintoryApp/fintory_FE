import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/LoginScreen.styles.ts';
import { hScale } from '../styles/LoginScreen.styles.ts';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.wholeContainer}>
        <View style={styles.topContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftButtonConainer}>
                <Image source={require('../../assets/icons/left.png')} style={styles.leftButton}/>
            </TouchableOpacity>
                
            <Text style={styles.topTitle}>로그인</Text>
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
            <View style={styles.passwordContainer}>
                <Text style={styles.passwordTitle}>비밀번호</Text>
                <TextInput 
                    style={styles.passwordInput}
                    placeholder="비밀번호를 입력하세요"
                    placeholderTextColor="#AEAEAE"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
        </View>

        <View style={styles.bottomContainer}>
            <View style={styles.logInContainer}>
                <TouchableOpacity style={styles.logInButton}>
                    <Text style={styles.logInButtonText}>로그인</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.findContainer}>
                <TouchableOpacity style={styles.findButton}>
                    <View>
                        <Text style={styles.findButtonText}>아이디 찾기</Text>
                        <View style={styles.underline} />
                    </View>
                </TouchableOpacity>
                <View style={{ width: hScale(64) }} />
                <TouchableOpacity style={styles.findButton}>
                    <View>
                        <Text style={styles.findButtonText}>비밀번호 찾기</Text>
                        <View style={styles.underline} />
                    </View>
                </TouchableOpacity>
            </View>


        </View>
      
    </View> //wholeContainer끝
  );
} 