import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { styles } from '../styles/FirstScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vScale } from '../styles/Scale.styles';
import HugeButton from '../components/HugeButton';
import { Colors } from '../styles/Color.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FirstScreen() {
    const {top} = useSafeAreaInsets();
    const navigation = useNavigation();

    // Google Sign-In 설정
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.GOOGLE_WEB_CLIENT_ID
        });
    }, []);

    // JWT 토큰 저장 함수
    const saveTokens = async (accessToken: string, refreshToken: string) => {
        try {
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
        } catch (error) {
            console.error('Error saving tokens:', error);
        }
    };

    // Google 로그인 처리 함수  
    const handleGoogleLogin = async () => {  
        try {  
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });  
            const userInfo = await GoogleSignin.signIn();  
            
            if (!userInfo.data) {
                throw new Error('Google Sign-In failed: No user data received');
            }
            
            const idToken = userInfo.data.idToken;  
            
            console.log('Google Sign-In Success!');

            const response = await fetch(`${process.env.API_BASE_URL}/api/auth/social-login/google`, {  
                method: 'POST',  
                headers: { 'Content-Type': 'application/json' },  
                body: JSON.stringify({ idToken }),  
            });  

            if (response.ok) {
                const responseData = await response.json();
                
                // ApiResponse 구조에 맞게 처리
                if (responseData.resultCode === 'SUCCESS' && responseData.data) {
                    const tokenData = responseData.data;
                    
                    // accessToken과 refreshToken이 있는지 확인
                    if (tokenData.accessToken && tokenData.refreshToken) {
                        await saveTokens(tokenData.accessToken, tokenData.refreshToken);
                        
                        // 로그인 성공 시 메인 화면으로 이동
                        navigation.navigate('Main' as never);
                    } else {
                        console.error('Token data not found in response');
                        Alert.alert('로그인 오류', '서버에서 토큰을 받지 못했습니다.');
                    }
                } else {
                    console.error('Invalid response structure');
                    Alert.alert('로그인 오류', '서버 응답이 올바르지 않습니다.');
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Google login failed:', response.status, errorData);
                Alert.alert('로그인 실패', '로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {  
            console.error('Google Login Error:', error);
            Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다.');
        }  
    };  

    return (
        <View style={styles.wholeContainer}>
            <View style={styles.logoContainer}>
                <FastImage
                    style={styles.logo}
                    source={require('../../assets/icons/logo.gif')}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
            <View style={styles.nameContainer}>
                <Image source={require('../../assets/icons/name.png')} style={styles.name} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.text}>Create your own Finance Story!</Text>
            </View>  

            <View style={[styles.loginContainer, {top:top+vScale(440)}]}> 
                <HugeButton title="시작하기" onPress={() => navigation.navigate('SignIn' as never)}   
                        backgroundColor={Colors.white}
                        textColor={Colors.primary}/>

                <View style={styles.buttonGap}/>

                <HugeButton title="로그인 하기" onPress={() => navigation.navigate('Login' as never)}   
                        backgroundColor={Colors.primaryDark}
                        textColor={Colors.white}/>

                <View style={styles.snsLoginContainer}>
                    <TouchableOpacity style={styles.kakaoLoginButton}>
                        <View style={styles.kakaoLoginButtonContainer}>
                            <View style={styles.kakaoImageContainer}>
                            <Image source={require('../../assets/icons/kakaoLogo.png')} />
                            </View>
                            <Text style={styles.kakaoLoginButtonText}>카카오 로그인</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.googleLoginButton} onPress={handleGoogleLogin}>
                        <View style={styles.googleImageContainer}>
                            <Image source={require('../../assets/icons/googleLogo.png')} />
                        </View>
                        <Image source={require('../../assets/icons/SignInWithGoogle.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
