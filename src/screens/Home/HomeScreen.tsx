import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/HomeScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useUserData } from '../../hooks/useUserData';
import {getTotalPoint} from '../../api/totalPoint';
import {getReport} from '../../api/report';

const characterStyle = [
  {
    title: '공격형',
    description: '공격형',
    image: require('../../../assets/characters/fire_character.png'),
  },
  {
    title: '중립형',
    description: '중립형',
    image: require('../../../assets/characters/stone_character.png'),
  },
  {
    title: '안정형',
    description: '안정형',
    image: require('../../../assets/characters/water_character.png'),
  },
];

// investmentStyle에 따른 캐릭터 이미지 가져오기 함수
const getCharacterImage = (style: string) => {
  const character = characterStyle.find((char) => char.title === style);
  return character ? character.image : characterStyle[1].image; // 기본값은 중립형
};
const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const { nickname } = useUserData();
  const [totalPoint, setTotalPoint] = useState(0);
  const [report, setReport] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [investmentStyle, setInvestmentStyle] = useState('중립형');
  useEffect(() => {
    const fetchTotalPoint = async () => {
      const res = await getTotalPoint();
      setTotalPoint(res.data);
    };
    fetchTotalPoint();
}, []);
useEffect(() => {
  const fetchReport = async () => {
    try {
      const res = await getReport(`${year}-${month}`);
      setReport(res.data);
      setInvestmentStyle(res.data.investmentStyle.investmentStyle || '중립형'); // 기본값 설정
    } catch (error) {
      console.error('Error fetching report:', error);
      setInvestmentStyle('중립형'); // 에러 시 기본값
    }
  };
  fetchReport();
}, [year, month]);
    return (
      <LinearGradient colors={['#E9F9E5', '#94D585']} style={{...styles.container,marginTop:top}}>
      <View style={styles.header}>
        <Image 
        source={require('../../../assets/icons/name.png')} 
        style={styles.headerIcon}
        resizeMode='contain'
        />

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('SettingMain' as never)}>
          <Image source={require('../../../assets/icons/setting.png')} style={styles.iconImage} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton}>
          <Image source={require('../../../assets/icons/notifications.png')} style={styles.iconImage} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.userInfoContainer}>
        <Image source={require('../../../assets/icons/red_circle.png')} style={styles.userInfoImage} />
        <View style={styles.userInfoTextContainer}>
        <Text style={styles.userInfoText}>{nickname} 님</Text>
        <Text style={styles.userPointText}>{totalPoint} P</Text>
        </View>
        <Image source={getCharacterImage(investmentStyle)} style={styles.userCharacterImage} />
      </View>

    <View style={styles.content}> 
      <TouchableOpacity onPress={() => navigation.navigate('Stock')}>
        <LinearGradient
          colors={['#FFFFFF', '#94D585']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.investStartButton}
        >
          <Text style={styles.investStartButtonText}>모의 주식 투자{'\n'}시작하기</Text>
          <Image source={require('../../../assets/icons/mainStart.png')} style={styles.startImage} />
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.smallButtonContainer}>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Report')}>
        <Text style={styles.smallButtonText}>AI 투자 리포트</Text>
        <Image source={require('../../../assets/icons/aiReport.png')} style={styles.aiReportImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('EconomyStudy')}>
        <Text style={styles.smallButtonText}>경제 용어 & 뉴스</Text>
        <Image source={require('../../../assets/icons/chart.png')} style={styles.aiReportImage} />
      </TouchableOpacity>
      </View>


    </View>






    </LinearGradient>
  );
};

export default HomeScreen;