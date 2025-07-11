/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function ReportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 탭에서 처음 보이는 화면 */}
      <Stack.Screen name="ReportMain" component={ReportScreen} />
      {/* ReportScreen → navigation.navigate('DetailReport') 로 이동 */}
      <Stack.Screen name="DetailReport" component={DetailReportScreen} />
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Report" component={ReportScreen} />
       <Stack.Screen name="DetailReport" component={DetailReportScreen} />
         <Stack.Screen name="Stock" component={StockMainScreen}/>
         <Stack.Screen name="First" component={FirstScreen} />
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
  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
}
