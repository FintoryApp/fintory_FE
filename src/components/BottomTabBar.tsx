import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet,Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';

// Import your screens here
// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const HomeIcon = require('../../assets/icons/home.png');
const HomeIconActive = require('../../assets/icons/home_active.png');
const ProfileIcon = require('../../assets/icons/profile.png');
const ProfileIconActive = require('../../assets/icons/profile_active.png');
const StockIcon = require('../../assets/icons/stock.png');
const StockIconActive = require('../../assets/icons/stock_active.png');
const ReportIcon = require('../../assets/icons/report.png');
const ReportIconActive = require('../../assets/icons/report_active.png');

const Tab = createBottomTabNavigator();

// Temporary placeholder screens
// const HomeScreen = () => (
//   <View style={styles.screen}>
//     <Text>Home Screen</Text>
//   </View>
// );

const StockScreen = () => (
  <View style={styles.screen}>
    <Text>Stock Screen</Text>
  </View>
);

const ReportScreen = () => (
  <View style={styles.screen}>
    <Text>Report Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text>Profile Screen</Text>
  </View>
);

const BottomTabBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource=focused? HomeIconActive:HomeIcon;
          } else if (route.name === 'Stock') {
            iconSource=focused? StockIconActive:StockIcon;
          } else if (route.name === 'Report') {
            iconSource=focused? ReportIconActive:ReportIcon;
          } else if (route.name === 'Profile') {
            iconSource=focused? ProfileIconActive:ProfileIcon;
          }

          return <Image source={iconSource} style={{ width: size, height: size, marginTop:15 }} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabBar; 