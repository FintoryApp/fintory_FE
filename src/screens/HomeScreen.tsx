import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../styles/HomeScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigationProp>();
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

    <View style={styles.content}> 
      <TouchableOpacity onPress={() => navigation.navigate('Stock' as never)}>
        <LinearGradient
          colors={['#FFFFFF', '#94D585']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.investStartButton}
        >
          <Text style={styles.investStartButtonText}>모의 주식 투자 {'\n'}시작하기</Text>
          <Image source={require('../../assets/icons/mainStart.png')} style={styles.startImage} />
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.smallButtonContainer}>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Report' as never)}>
        <Text style={styles.smallButtonText}>AI 투자 리포트</Text>
        <Image source={require('../../assets/icons/aiReport.png')} style={styles.aiReportImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('EconomyStudy' as never)}>
        <Text style={styles.smallButtonText}>경제 용어 & 뉴스</Text>
        <Image source={require('../../assets/icons/chart.png')} style={styles.aiReportImage} />
      </TouchableOpacity>
      </View>


    </View>






    </View>
  );
};

export default HomeScreen;