/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './src/navigation/NavigationService';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider} from 'react-native-safe-area-context';


//홈화면
import HomeScreen from './src/screens/Home/HomeScreen';

//report관련 화면
import ReportScreen from './src/screens/Report/ReportScreen';
import DetailReportScreen from './src/screens/Report/DetailReportScreen';
import NoReportScreen from './src/screens/Report/NoReportScreen';

//stock관련 화면
import StockMainScreen from './src/screens/Stock/StockMainScreen';
import BuyStockScreen from './src/screens/Stock/BuyStockScreen';
import SellStockScreen from './src/screens/Stock/SellStockScreen';
import WantPriceScreen from './src/screens/Stock/WantPriceScreen';

//study관련 화면
import EconomyStudyScreen from './src/screens/Study/EconomyStudyScreen';
import EconomyWordScreen from './src/screens/Study/EconomyWordScreen';
import WordDetailScreen from './src/screens/Study/WordDetailScreen';
import EconomyNewsDetailScreen from './src/screens/Study/EconomyNewsDetailScreen';

//mypage관련 화면
// import ProfileScreen from './src/screens/Profile/ProfileScreen';
import MyPageScreen from './src/screens/Profile/MyPageScreen';
import VirtualAccountScreen from './src/screens/Profile/VirtualAccountSreen';
import PointScreen from './src/screens/Profile/PointScreen';

//챌린지관련 화면
import PrizeScreen from './src/screens/Prize/PrizeScreen';

//로그인 관련 화면
import FirstScreen from './src/screens/Login/FirstScreen';
import LoginScreen from './src/screens/Login/LoginScreen';
import FindPasswordScreen from './src/screens/Login/FindPasswordScreen';
import ChangePasswordScreen from './src/screens/Login/ChangePasswordScreen';
import FindIdScreen from './src/screens/Login/FindIdScreen';
import SignInScreen from './src/screens/Login/SignInScreen';

//UI
import BottomTabBar from './src/components/BottomTabBar';

//Types
import type {RootStackParamList } from './src/navigation/RootStackParamList';
import type { ReportStackParamList } from './src/navigation/RootStackParamList';
import type { StockStackParamList } from './src/navigation/RootStackParamList';
import type { HomeStackParamList } from './src/navigation/RootStackParamList';
import type { EconomyStudyStackParamList } from './src/navigation/RootStackParamList';
import type { ProfileStackParamList } from './src/navigation/RootStackParamList';


const RootStack = createNativeStackNavigator<RootStackParamList>();
const ReportStackNav = createNativeStackNavigator<ReportStackParamList>();
const StockStackNav = createNativeStackNavigator<StockStackParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const EconomyStudyStackNav = createNativeStackNavigator<EconomyStudyStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="Home" component={HomeScreen} />
      <HomeStackNav.Screen name="Report" component={ReportStack}/>
    </HomeStackNav.Navigator>
  );
}


function ReportStack() {
  return (
    <ReportStackNav.Navigator screenOptions={{ headerShown: false }}>
      {/* 탭에서 처음 보이는 화면 */}
      <ReportStackNav.Screen name="ReportMain" component={ReportScreen} />
      <ReportStackNav.Screen name="DetailReport" component={DetailReportScreen} />
      <ReportStackNav.Screen name="NoReport" component={NoReportScreen} />
    </ReportStackNav.Navigator>
  );
}

function StockStack() {
  return (
    <StockStackNav.Navigator screenOptions={{ headerShown: false }}>
      <StockStackNav.Screen name="StockMain" component={StockMainScreen} />
      
    </StockStackNav.Navigator>
  );
}

function EconomyStudyStack() {
  return (
    <EconomyStudyStackNav.Navigator screenOptions={{ headerShown: false }}>
      <EconomyStudyStackNav.Screen name="EconomyStudy" component={EconomyStudyScreen} />
      <EconomyStudyStackNav.Screen name="EconomyWordScreen" component={EconomyWordScreen} />
      <EconomyStudyStackNav.Screen name="WordDetailScreen" component={WordDetailScreen} />
      <EconomyStudyStackNav.Screen name="EconomyNewsDetailScreen" component={EconomyNewsDetailScreen} />
    </EconomyStudyStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      {/* <ProfileStackNav.Screen name="Profile" component={ProfileScreen} /> */}
      <ProfileStackNav.Screen name="MyPage" component={MyPageScreen} />
      <ProfileStackNav.Screen name="VirtualAccount" component={VirtualAccountScreen} />
      <ProfileStackNav.Screen name="Point" component={PointScreen} />
    </ProfileStackNav.Navigator>
  );
}

function MainTabs(){
  return(
    <Tab.Navigator
      tabBar={(props: any)=> <BottomTabBar {...props}/>}
      screenOptions={{headerShown:false}}
    >
      <Tab.Screen name="Home" component={HomeStack}/>
      <Tab.Screen name="Stock" component={StockStack}/>
      <Tab.Screen name="Prize" component={PrizeScreen}/>
      <Tab.Screen name="EconomyStudy" component={EconomyStudyStack}/>
      <Tab.Screen name="Profile" component={ProfileStack}/>
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
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="First" component={FirstScreen} />
        <RootStack.Screen name="BuyStock" component={BuyStockScreen}/>
        <RootStack.Screen name="WantPrice" component={WantPriceScreen}/>
        <RootStack.Screen name="SellStock" component={SellStockScreen}/>
        <RootStack.Screen name="Study" component={EconomyStudyStack}/>
        
        <RootStack.Screen name="Main" component={MainTabs} />
        
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="SignIn" component={SignInScreen} />
        <RootStack.Screen name="FindPassword" component={FindPasswordScreen} />
        <RootStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <RootStack.Screen name="FindId" component={FindIdScreen} />
        
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
}
