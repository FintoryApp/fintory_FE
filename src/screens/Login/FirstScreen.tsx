import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { styles } from '../../styles/FirstScreen.styles';  
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vScale } from '../../styles/Scale.styles';
import HugeButton from '../../components/button/HugeButton';
import { Colors } from '../../styles/Color.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '@react-native-seoul/kakao-login';
import api from '../../api/index';
import { API_CONFIG } from '../../api/config';
import { getCurrentUser } from '../../api/auth';
import { handleAttendanceCheck } from '../../utils/attendance';

export default function FirstScreen() {
    const {top} = useSafeAreaInsets();
    const navigation = useNavigation();

    // Google Sign-In 설정
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.GOOGLE_WEB_CLIENT_ID
        });
    }, []);

    // JWT 토큰 저장 함수 (공통 저장)
    const saveTokens = async (accessToken: string, refreshToken: string) => {
        try {
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
        } catch (error) {
            console.error('Error saving tokens:', error);
        }
    };

    // 카카오 로그인 처리 함수
    const handleKakaoLogin = async () => {
        try {
            // 카카오 로그인 실행
            const token = await login();
            
            if (token && token.accessToken) {
                // 서버로 토큰 전송
                await sendKakaoTokenToServer(token.accessToken);
            } else {
                console.error('토큰이 올바르지 않습니다:', token);
                Alert.alert('로그인 오류', '카카오 토큰을 받지 못했습니다.');
            }
        } catch (error) {
            console.error('Kakao Login Error:', error);
            Alert.alert('로그인 오류', '카카오 로그인 중 오류가 발생했습니다.');
        }
    };

    // 카카오 토큰을 서버로 전송하는 함수
    const sendKakaoTokenToServer = async (accessToken: string) => {
        try {
            const { data: responseData } = await api.post(`${API_CONFIG.ENDPOINTS.SOCIAL_LOGIN_KAKAO}`, { accessToken });
            if (responseData.resultCode === 'SUCCESS' && responseData.data?.accessToken && responseData.data?.refreshToken) {
                console.log('Kakao login - Received AT:', responseData.data.accessToken);
                console.log('Kakao login - Received RT:', responseData.data.refreshToken);
                await saveTokens(responseData.data.accessToken, responseData.data.refreshToken);
                
                // 저장 확인
                const savedAT = await AsyncStorage.getItem('accessToken');
                const savedRT = await AsyncStorage.getItem('refreshToken');
                console.log('Kakao login - Saved AT:', savedAT);
                console.log('Kakao login - Saved RT:', savedRT);
                
                // 출석체크 처리
                await handleSocialLoginAttendance();
            } else {
                console.error('Invalid response structure');
                Alert.alert('로그인 오류', '서버 응답이 올바르지 않습니다.');
            }
        } catch (error: any) {
            console.error('Kakao login failed - Full error:', error);
            console.error('Kakao login failed - Status:', error?.response?.status);
            console.error('Kakao login failed - Data:', error?.response?.data);
            console.error('Kakao login failed - Message:', error?.message);
            console.error('Kakao login failed - Code:', error?.code);
            Alert.alert('로그인 실패', '로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 소셜 로그인 출석체크 공통 함수
    const handleSocialLoginAttendance = async () => {
        try {
            // 사용자 정보 가져오기
            const userResult = await getCurrentUser();
            if (userResult.resultCode === 'SUCCESS' && userResult.data?.email) {
                const userEmail = userResult.data.email;
                
                // 출석체크 처리
                const attendanceResult = await handleAttendanceCheck(userEmail);
                
                let message = '로그인이 완료되었습니다.';
                if (attendanceResult.success) {
                    if (attendanceResult.alreadyChecked) {
                        message += `\n${attendanceResult.message}`;
                    } else {
                        message += `\n${attendanceResult.message}`;
                    }
                } else {
                    message += `\n${attendanceResult.message}`;
                }
                
                Alert.alert('성공', message, [
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
                // 사용자 정보를 가져올 수 없는 경우 기본 메시지
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
            }
        } catch (error) {
            console.error('출석체크 처리 오류:', error);
            // 출석체크 실패해도 로그인은 성공으로 처리
            Alert.alert('성공', '로그인이 완료되었습니다.\n(출석체크는 잠시 후 다시 시도해주세요)', [
                {
                    text: '확인',
                    onPress: () =>
                        (navigation as any).reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        }),
                },
            ]);
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

            try {
                const { data: responseData } = await api.post(`${API_CONFIG.ENDPOINTS.SOCIAL_LOGIN_GOOGLE}`, { idToken });
                if (responseData.resultCode === 'SUCCESS' && responseData.data?.accessToken && responseData.data?.refreshToken) {
                    await saveTokens(responseData.data.accessToken, responseData.data.refreshToken);
                    
                    // 출석체크 처리
                    await handleSocialLoginAttendance();
                } else {
                    console.error('Invalid response structure');
                    Alert.alert('로그인 오류', '서버 응답이 올바르지 않습니다.');
                }
            } catch (error: any) {
                console.error('Google login failed - Full error:', error);
                console.error('Google login failed - Status:', error?.response?.status);
                console.error('Google login failed - Data:', error?.response?.data);
                console.error('Google login failed - Message:', error?.message);
                console.error('Google login failed - Code:', error?.code);
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
                    source={require('../../../assets/icons/logo.gif')}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
            <View style={styles.nameContainer}>
                <Image source={require('../../../assets/icons/name.png')} style={styles.name} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.text}>Create your own Finance Story!</Text>
            </View>  

            <View style={[styles.loginContainer, {top:top+vScale(460)}]}> 
                <HugeButton title="시작하기" onPress={() => navigation.navigate('SignIn' as never)}   
                        backgroundColor={Colors.white}
                        textColor={Colors.primary}/>

                <View style={styles.buttonGap}/>

                <HugeButton title="로그인 하기" onPress={() => navigation.navigate('Login' as never)}   
                        backgroundColor={Colors.primaryDark}
                        textColor={Colors.white}/>

                <View style={styles.snsLoginContainer}>
                    <TouchableOpacity style={styles.kakaoLoginButton} onPress={handleKakaoLogin}>
                        <View style={styles.kakaoLoginButtonContainer}>
                            <View style={styles.kakaoImageContainer}>
                            <Image source={require('../../../assets/icons/kakaoLogo.png')} />
                            </View>
                            <Text style={styles.kakaoLoginButtonText}>카카오 로그인</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.googleLoginButton} onPress={handleGoogleLogin}>
                        <View style={styles.googleImageContainer}>
                            <Image source={require('../../../assets/icons/googleLogo.png')} />
                        </View>
                        <Image source={require('../../../assets/icons/SignInWithGoogle.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
