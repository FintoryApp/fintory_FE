import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/FirstScreen.styles';

export default function FirstScreen() {
  const navigation = useNavigation();
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

        <View style={styles.loginContainer}>
            <TouchableOpacity style={styles.startButton}>
               <Text style={styles.startButtonText}>시작하기</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login' as never)}>
                <Text style={styles.loginButtonText}>로그인 하기</Text>
            </TouchableOpacity>

            <View style={styles.snsLoginContainer}>
                <TouchableOpacity style={styles.kakaoLoginButton}>
                    <View style={styles.kakaoLoginButtonContainer}>
                        <View style={styles.kakaoImageContainer}>
                        <Image source={require('../../assets/icons/kakaoLogo.png')} style={styles.kakaoLoginButtonImage} />
                        </View>
                        <Text style={styles.kakaoLoginButtonText}>카카오 로그인</Text>
                    </View>
                    
                    
                        
                </TouchableOpacity>

                <TouchableOpacity style={styles.googleLoginButton}>
                        <View style={styles.googleImageContainer}>
                            <Image source={require('../../assets/icons/googleLogo.png')} style={styles.googleLoginButtonImage} />
                        </View>
                        <Image source={require('../../assets/icons/SignInWithGoogle.png')} style={styles.googleLoginButtonText} />
                </TouchableOpacity>

            </View>
        </View>

    </View> //wholeContainer끝
  );
}
