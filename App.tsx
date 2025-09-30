/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/NavigationService';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
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
import StockChartScreen from './src/screens/StockChart';
import BuyStockScreen from './src/screens/BuyStockScreen';
import SellStockScreen from './src/screens/SellStockScreen';
import WantPriceScreen from './src/screens/WantPriceScreen';

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
      <Stack.Screen name="Stock" component={StockMainScreen} />
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
      <Tab.Screen name="Stock" component={StockMainScreen}/>
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
        <Stack.Screen name="Main" component={MainTabNavigator} />

        <Stack.Screen name="BuyStock" component={BuyStockScreen}/>
        <Stack.Screen name="SellStock" component={SellStockScreen}/>
        
        <Stack.Screen name="WantPrice" component={WantPriceScreen}/>
        
        

        <Stack.Screen name="StockChart" component={StockChartScreen}/>
        
        
        
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
         
         
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
         <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
         <Stack.Screen name="FindId" component={FindIdScreen} />
        </Stack.Navigator>
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
