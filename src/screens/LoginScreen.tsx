import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/LoginScreen.styles.ts';
import { hScale,vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles.ts';
import TopBar from '../components/TopBar.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        <TopBar title='로그인' />

        <View style={{...styles.middleContainer,marginTop:vScale(64)+top}}>
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
                    style={styles.idInput}
                    placeholder="비밀번호를 입력하세요"
                    placeholderTextColor="#AEAEAE"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
        </View>

        <View style={{...styles.bottomContainer,top:vScale(440)+top}}>
            
                <TouchableOpacity style={styles.logInContainer}>
                    <Text style={styles.logInButtonText}>로그인</Text>
                </TouchableOpacity>

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
      
    </View> //wholeContainer끝
  );
} 