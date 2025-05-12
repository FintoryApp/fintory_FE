// BottomTabBar.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, PixelRatio,Dimensions } from 'react-native';

const HomeIcon = require('../../assets/icons/home.png');
const HomeIconActive = require('../../assets/icons/home_active.png');
const ProfileIcon = require('../../assets/icons/profile.png');
const ProfileIconActive = require('../../assets/icons/profile_active.png');
const StockIcon = require('../../assets/icons/stock.png');
const StockIconActive = require('../../assets/icons/stock_active.png');
const ReportIcon = require('../../assets/icons/report.png');
const ReportIconActive = require('../../assets/icons/report_active.png');



const { width: W, height: H } = Dimensions.get('window');

const guidelineW = 360;
const guidelineH = 740;

const hScale = (s: number) => {
    const newSize = (W / guidelineW) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };
  
  const vScale = (s: number) => {
    const newSize = (H / guidelineH) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };
  
const BottomTabBar = ({ state, descriptors, navigation }:any) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route:any, index:any) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconSource;
        if (route.name === 'Home') {
          iconSource = isFocused ? HomeIconActive : HomeIcon;
        } else if (route.name === 'Stock') {
          iconSource = isFocused ? StockIconActive : StockIcon;
        } else if (route.name === 'Report') {
          iconSource = isFocused ? ReportIconActive : ReportIcon;
        } else if (route.name === 'Profile') {
          iconSource = isFocused ? ProfileIconActive : ProfileIcon;
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Image 
              source={iconSource}
            />
          </TouchableOpacity>
        );
      })}
      <View style={styles.bottomSafeArea}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 88,
    //borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:44,
    height:44,
    top:vScale(16),
  },
  bottomSafeArea:{
    height:24,
  }
});

export default BottomTabBar;