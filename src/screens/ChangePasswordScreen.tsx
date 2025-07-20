import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/ChangePasswordScreen.styles.ts';
import { hScale,vScale } from '../styles/Scale.styles.ts';
import { Colors } from '../styles/Color.styles.ts';
import TopBar from '../components/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PasswordModal from '../components/PasswordModal.tsx';

export default function ChangePasswordScreen() {
    const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const message = '비밀번호 변경이\n완료되었습니다.';

  const handleModalClose = () => {
    setShowModal(false);
    // Navigate to LoginScreen after modal closes
    navigation.navigate('Login' as never);
  };

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        <TopBar title='비밀번호 변경하기' />

        
        <View style={{...styles.middleContainer,marginTop:vScale(22)+top}}>
            <View style={styles.idContainer}>
                <Text style={styles.idTitle}>새로운 비밀번호</Text>
                <TextInput 
                    style={styles.idInput}
                    placeholder="변경할 비밀번호를 입력하세요"
                    placeholderTextColor={Colors.outline}
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
            </View>

            <View style={{...styles.idContainer,marginTop:vScale(16)}}>
                <Text style={styles.idTitle}>새로운 비밀번호 확인</Text>
                <TextInput 
                    style={styles.idInput}
                    placeholder="변경할 비밀번호를 입력하세요"
                    placeholderTextColor={Colors.outline}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                {newPassword !== confirmPassword && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
                    </View>
                )}
            </View>
            </View>
            
                <TouchableOpacity style={styles.bottomContainer} onPress={()=>{
                    if(newPassword === confirmPassword){
                        setShowModal(true);
                    }
                }}>
                    <Text style={styles.logInButtonText}>비밀번호 변경하기</Text>
                </TouchableOpacity>

        <PasswordModal
            isVisible={showModal}
            onClose={handleModalClose}
            message={message}
        />
      
    </View> //wholeContainer끝
  );
} 