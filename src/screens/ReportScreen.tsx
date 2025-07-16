import React,{useEffect, useState,useMemo} from 'react';
import { View, Text, StyleSheet,ScrollView, Image, TouchableOpacity, ImageBackground  } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../styles/ReportScreen.styles';
import CustomCalendar from '../components/Calendar';
import TopBar from '../components/TopBar';
import { hScale,vScale } from '../styles/Scale.styles';
import {Colors} from '../styles/Color.styles';
import CharacterContainer from '../components/CharacterContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getReport } from '../api/report';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ReportNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Report'>;
type ReportRouteProp = RouteProp<RootStackParamList, 'Report'>;
export default function ReportScreen() {
  
  const navigation = useNavigation<ReportNavigationProp>();
  const route = useRoute<ReportRouteProp>();
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [report,setReport] = useState<any>(null);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{
    (async()=>{
        try{
          const month = String(selectedMonth).padStart(2, '0');  // "02"
            const res = await getReport(`${selectedYear}-${month}`);
            setReport(res);
        }catch(error){
            // console.error('Error fetching report:',error);
            navigation.navigate('NoReport');
        }finally{
            setLoading(false);
        }
    })();
   },[selectedYear,selectedMonth]);

   const investmentStyle=report?.data?.investmentStyle?.investmentStyle ??'';

  // 캘린더 표시 함수
  const showCalendar = () => {
    setCalendarVisible(true);
  };
  
  // 캘린더 닫기 함수
  const hideCalendar = () => {
    setCalendarVisible(false);
  };
  
  // 날짜 선택 처리 함수
  const handleDateSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };
  
  // 선택된 날짜 포맷팅

  const userName='김나무'
  const investStyle=[
    {title:'거침 없는 공격형',
      characteristic :'공격형',
      description:'빠른 판단과 도전을 즐기지만 \n가끔은 신중함이 필요할 수 있어요.\n좋은 도전을 이어가면서,\n다음엔 다양한 산업군에도 투자해보세요!',
      image:require('../../assets/characters/fire_character.png'),
      leftColor:'#FFEFEF',
      rightColor:'#FFD6D6',
      background:require('../../assets/icons/fire_background.png'),
      textColor:Colors.red,
    },
    {title:'안정적인 중립형',
      characteristic :'중립형',
      description:'균형 잡힌 선택이 돋보여요.\n상황에 맞춰 판단하는 유연함이 강점이에요.\n지금처럼 나만의 리듬을 지키며,\n한 걸음 더 나아가보세요!',
      image:require('../../assets/characters/stone_character.png'),
      leftColor:'#F1F1F1',
      rightColor:'#DCDCDC',
      background:require('../../assets/icons/rock_background.png'),
      textColor:Colors.outline,
    },
    {title:'굳건한 방어형',
      characteristic :'방어형',
      description:'안정적인 선택과 꾸준함이\n당신의 투자에 힘을 더해요.\n때로는 작은 도전도 새로운 기회를 열 수 있어요.\n조금씩 범위를 넓혀보는 건 어떨까요?',
      image:require('../../assets/characters/water_character.png'),
      leftColor:'#E4F2FF',
      rightColor:'#C6E3FF',
      background:require('../../assets/icons/water_background.png'),
      textColor:Colors.blue,
    }
  ]
  const month = String(selectedMonth).padStart(2, '0');  // "02"
  const found = useMemo(
    () => investStyle.find((i) => i.characteristic === investmentStyle) || null,
    [investmentStyle],
  );

  const {top} = useSafeAreaInsets();

  return (
    <View>
      
      <TopBar title="현황 리포트"/>
      <View style={{...styles.wholeContainer,marginTop:top}}>
      <CharacterContainer 
      userName={userName} 
      userStyle={found ?? {
        title:'',
        characteristic:'',
        description:'',
        leftColor:'',
        rightColor:'',
        image:null,
        background:null,
        textColor:'',
      }} />

      <View style={styles.styleExplainContainer}> 
        <Text style={{
          fontSize:hScale(16),
          textAlign:'center',
          top:vScale(16),
          fontWeight:'bold',
        }}>
          {found?.characteristic} 투자 성향
        </Text>
        <Text style={{
          fontSize:hScale(12),
          color:'#000000',
          textAlign:'center',
          top:vScale(46),
          position:'absolute',
          }}>
            {found?.description}
        </Text>
        <TouchableOpacity style={styles.styleExplainButton} 
        onPress={() =>
          navigation.navigate('DetailReport', {
            selectedYear:selectedYear,
            selectedMonth:selectedMonth,
            report:report
          })
        }>
          <Text style={{
            fontSize:hScale(12),
            color:Colors.outline,
            textAlign:'center',
            top:vScale(10),
          }}>
            투자분석 전체보기 
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthSearchContainer}>
        <View style={styles.monthSearchTextContainer}>
          <Text style={{
            fontSize:hScale(16),
            color:Colors.primaryDark,
          }}>
            {selectedYear}년 {month}월
          </Text>
          <View style={{width:hScale(4)}}></View>
          <Text style={{
            fontSize:hScale(16),
            color:'#000000',
          }}>
            투자 분석 조회하기
          </Text>
        </View>

        <TouchableOpacity style={{
          left:hScale(272),
          top:vScale(8),
          position:'absolute',
        }} onPress={showCalendar}>
          <Image source={require('../../assets/icons/calendar.png')} style={{width:hScale(44),height:vScale(44)}}/>
        </TouchableOpacity>
      </View>

      <CustomCalendar
        isVisible={isCalendarVisible}
        onClose={hideCalendar}
        onSelectDate={handleDateSelect}
        initialYear={selectedYear}
        initialMonth={selectedMonth}
      />
</View>
    </View>
  );
}