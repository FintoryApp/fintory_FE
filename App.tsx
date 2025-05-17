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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DetailReportScreen from './src/screens/DetailReportScreen';

const Stack = createNativeStackNavigator();
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

function MainTabNavigator(){
  return(
    <Tab.Navigator
      tabBar={(props: any)=> <BottomTabBar {...props}/>}
      screenOptions={{headerShown:false}}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Stock" component={StockScreen}/>
      <Tab.Screen name="Report" component={ReportStack}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;
