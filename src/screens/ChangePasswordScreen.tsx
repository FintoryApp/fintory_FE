import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/ChangePasswordScreen.styles.ts';
import { hScale } from '../styles/ChangePasswordScreen.styles.ts';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.wholeContainer}>
        <View style={styles.topContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftButtonConainer}>
                <Image source={require('../../assets/icons/left.png')} style={styles.leftButton}/>
            </TouchableOpacity>
                
            <Text style={styles.topTitle}>로그인</Text>
        </View>

        
            <View style={styles.idConatiner}>
                <Text style={styles.idTitle}>새로운 비밀번호</Text>
                <TextInput 
                    style={styles.idInput}
                    placeholder="변경할 비밀번호를 입력하세요"
                    placeholderTextColor="#AEAEAE"
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
            </View>

            <View style={styles.passwordContainer}>
                <Text style={styles.passwordTitle}>새로운 비밀번호 확인</Text>
                <TextInput 
                    style={styles.passwordInput}
                    placeholder="변경할 비밀번호를 입력하세요"
                    placeholderTextColor="#AEAEAE"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

        <View style={styles.bottomContainer}>
            
                <TouchableOpacity style={styles.logInButton}>
                    <Text style={styles.logInButtonText}>비밀번호 변경하기</Text>
                </TouchableOpacity>
        </View>
      
    </View> //wholeContainer끝
  );
} 