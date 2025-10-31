import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
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
    image: require('../../../assets/characters/공격형.gif'),
  },
  {
    title: '중립형',
    description: '중립형',
    image: require('../../../assets/characters/중립형.gif'),
  },
  {
    title: '안정형',
    description: '안정형',
    image: require('../../../assets/characters/안정형.gif'),
  },
  {
    title: '레포트 없음',
    description: '레포트 없음',
    image: require('../../../assets/characters/fire_character.png'),
  },
];

const todayAdvice = [
  {
    advice : '이번에는 조금 더\n다양한 산업군에\n투자해보세요!'
  },
  {
    advice : '이번에는\n자신 있는 종목에\n과감히 투자해보세요!'
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
  const [investmentStyle, setInvestmentStyle] = useState('레포트 없음');
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
      
      // res.data가 null이거나 undefined인 경우 체크
      if (res.data && res.data.investmentStyle && res.data.investmentStyle.investmentStyle) {
        setInvestmentStyle(res.data.investmentStyle.investmentStyle);
      } else {
        setInvestmentStyle('레포트 없음'); // 데이터가 없을 때 기본값
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setInvestmentStyle('레포트 없음'); // 에러 시 기본값
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
        <Image source={require('../../../assets/icons/account_circle.png')} style={styles.userInfoImage} />
        <View style={styles.userInfoTextContainer}>
        <Text style={styles.userInfoText}>{nickname} 님</Text>
        <Text style={styles.userPointText}>{totalPoint} P</Text>
        </View>
        <View style={styles.smallCircle}></View>
        <View style={styles.bigCircle}></View>
        <FastImage
          source={getCharacterImage(investmentStyle)}
          style={styles.userCharacterImage}
          resizeMode={FastImage.resizeMode.contain}
        />

        <View style={styles.adviceTextContainer}>
        <Text style={styles.todayAdviceText}>오늘의 투자 조언</Text>
      
        <Text style={styles.adviceText}>{todayAdvice[1].advice}</Text>
        </View>
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
      <TouchableOpacity style={styles.smallButton} onPress={() => {
        if (report) {
          navigation.navigate('Report');
        } else {
          navigation.navigate('NoReport');
        }
      }}>
        <Text style={styles.smallButtonText}>AI 투자 리포트</Text>
        <Image source={require('../../../assets/icons/aiReport.png')} style={styles.aiReportImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('StudyStack')}>
        <Text style={styles.smallButtonText}>경제 용어 & 뉴스</Text>
        <Image source={require('../../../assets/icons/chart.png')} style={styles.aiReportImage} />
      </TouchableOpacity>
      </View>


    </View>






    </LinearGradient>
  );
};

export default HomeScreen;