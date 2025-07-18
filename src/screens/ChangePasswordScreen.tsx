import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/ChangePasswordScreen.styles.ts';
import { hScale,vScale } from '../styles/Scale.styles.ts';
import { Colors } from '../styles/Color.styles.ts';
import TopBar from '../components/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChangePasswordScreen() {
    const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        <TopBar title='비밀번호 변경하기' />

        
        <View style={{...styles.middleContainer,marginTop:vScale(64)+top}}></View>
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