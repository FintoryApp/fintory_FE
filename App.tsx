/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/NavigationService';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { registerFcmToken } from './src/api/user';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BottomTabBar from './src/components/BottomTabBar';
import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';
import StockScreen from './src/screens/StockScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FirstScreen from './src/screens/FirstScreen';
import LoginScreen from './src/screens/LoginScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DetailReportScreen from './src/screens/DetailReportScreen';
import FindPasswordScreen from './src/screens/FindPasswordScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import FindIdScreen from './src/screens/FindIdScreen';
import FindIdModal from './src/components/FindIdModal';
import StockMainScreen from './src/screens/StockMainScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp,useRoute } from '@react-navigation/native';
import type { RootStackParamList } from './src/navigation/RootStackParamList';
import NoReportScreen from './src/screens/NoReportScreen';
import EconomyStudyScreen from './src/screens/EconomyStudyScreen';
import EconomyWordScreen from './src/screens/EconomyWordScreen';
import WordDetailScreen from './src/screens/WordDetailScreen';
import EconomyNewsDetailScreen from './src/screens/EconomyNewsDetailScreen';
import SignInScreen from './src/screens/SignInScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import VirtualAccountScreen from './src/screens/VirtualAccountSreen';
import PointScreen from './src/screens/PointScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function ReportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 탭에서 처음 보이는 화면 */}
      <Stack.Screen name="ReportMain" component={ReportScreen} />
      {/* ReportScreen → navigation.navigate('DetailReport') 로 이동 */}
      <Stack.Screen name="DetailReport" component={DetailReportScreen} />
      <Stack.Screen name="NoReport" component={NoReportScreen} />
    </Stack.Navigator>
  );
}

function StockStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 탭에서 처음 보이는 화면 */}
      <Stack.Screen name="StockMain" component={StockMainScreen} />
      {/* ReportScreen → navigation.navigate('DetailReport') 로 이동 */}
    </Stack.Navigator>
  );
}
function EconomyStudyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EconomyStudy" component={EconomyStudyScreen} />
    </Stack.Navigator>
  );
}

function MainTabNavigator(){
  return(
    <Tab.Navigator
      tabBar={(props: any)=> <BottomTabBar {...props}/>}
      screenOptions={{headerShown:false}}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Stock" component={StockStack}/>
      <Tab.Screen name="Report" component={ReportStack}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  );
}



function RootNavigation(  ) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      {/* ① StatusBar : 투명 + translucent */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* ② 실제 네비게이션 트리 */}
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="First" component={FirstScreen} />
          <Stack.Screen name="MyPage" component={MyPageScreen} />
          <Stack.Screen name="VirtualAccount" component={VirtualAccountScreen} />
          <Stack.Screen name="Point" component={PointScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="EconomyStudy" component={EconomyStudyScreen} />
        <Stack.Screen name="EconomyWordScreen" component={EconomyWordScreen} />
          <Stack.Screen name="EconomyWordDetailScreen" component={WordDetailScreen} />
          <Stack.Screen name="EconomyNewsDetailScreen" component={EconomyNewsDetailScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="NoReport" component={NoReportScreen} />
          <Stack.Screen name="DetailReport" component={DetailReportScreen} />
         <Stack.Screen name="Stock" component={StockMainScreen}/>
         
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="Main" component={MainTabNavigator} />
         <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="Profile" component={ProfileScreen} />
         <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
         <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
         <Stack.Screen name="FindId" component={FindIdScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App(): React.JSX.Element {
  useEffect(() => {
    async function initNotifications() {
      if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }
      await messaging().requestPermission();
      const token = await messaging().getToken();
      console.log('FCM TOKEN:', token);
      try {
        await registerFcmToken(token);
      } catch {}

      const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        console.log('FCM Foreground Message:', remoteMessage?.messageId);
      });

      // 백그라운드에서 알림을 탭해 앱이 열렸을 때
      const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened from background:', remoteMessage?.messageId);
        // 알림 탭 시 FirstScreen으로 이동
        // 네비게이터 접근을 위해 간단히 이벤트를 사용하거나, 글로벌 내비게이터를 구성하는 것이 일반적이나
        // 여기서는 FirstScreen을 초기 라우트로 두었으므로 열림 시 초기 화면 유지
      });

      // 앱이 종료된 상태에서 알림으로 시작했는지 확인
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log('Notification opened from quit state:', remoteMessage?.messageId);
            // 종료 상태에서 알림으로 시작한 경우에도 FirstScreen 유지
          }
        });

      // 토큰 갱신 시 서버에 업데이트
      messaging().onTokenRefresh(async refreshedToken => {
        console.log('FCM TOKEN refreshed:', refreshedToken);
        try {
          await registerFcmToken(refreshedToken);
        } catch {}
      });
    }
    initNotifications().then(() => {
      // no-op
    });
    return () => {
      // listeners are cleaned up by RN Firebase when app unmounts
    };
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
}
