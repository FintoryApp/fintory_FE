// BottomTabBar.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, PixelRatio,Dimensions } from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const HomeIcon = require('../../assets/icons/home.png');
const ProfileIcon = require('../../assets/icons/profile.png');
const StockIcon = require('../../assets/icons/stock.png');
const PrizeIcon = require('../../assets/icons/prize.png');
const QuizIcon = require('../../assets/icons/study.png');



  
const BottomTabBar = ({ state, descriptors, navigation }:any) => {
  const { bottom } = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { marginBottom: bottom }]}>
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
        let tintColor = isFocused ? Colors.primary : Colors.middleGray; // 선택된 상태: 파란색, 비선택: 회색
        
        if (route.name === 'Home') {
          iconSource = HomeIcon;
        } else if (route.name === 'Stock') {
          iconSource = StockIcon;
        } else if (route.name === 'Prize') {
          iconSource = PrizeIcon;
        } else if (route.name === 'EconomyStudy') {
          iconSource = QuizIcon;
        } else if (route.name === 'Profile') {
          iconSource = ProfileIcon;
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Image 
              source={iconSource}
              style={{ tintColor }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: vScale(60),
    //borderWidth: 1,
    borderTopColor: '#ECECEC',
    borderTopRightRadius: hScale(16),
    borderTopLeftRadius: hScale(16),
    paddingHorizontal: hScale(30),
    paddingVertical: vScale(16),

  },
  tabButton: {
    flex: 1,
    
    alignItems: 'center',
    width:hScale(44),
    height:hScale(44),
    
  },
});

export default BottomTabBar;