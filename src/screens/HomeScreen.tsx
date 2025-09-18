import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/HomeScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={{...styles.container,marginTop:top}}>
      <View style={styles.header}>
        <Image 
        source={require('../../assets/icons/name.png')} 
        style={styles.headerIcon}
        resizeMode='contain'
        />

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
          <Image source={require('../../assets/icons/setting.png')} style={styles.iconImage} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton}>
          <Image source={require('../../assets/icons/notifications.png')} style={styles.iconImage} />
          </TouchableOpacity>
        </View>



      </View>


    </View>
  );
};

export default HomeScreen;