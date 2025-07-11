import React,{useEffect, useMemo, useState} from 'react';
import { View, Text, StyleSheet,ScrollView, Image, TouchableOpacity, ImageBackground, ActivityIndicator  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../styles/DetailReportScreen.styles';
import CustomCalendar from '../components/Calendar';
import CircleGraph from '../components/CircleGrapgh';
import CharacterContainer from '../components/CharacterContainer';
import TopBar from '../components/TopBar';
import { hScale,vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getReport } from '../api/report';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStackParamList';

type DetailRouteProp = RouteProp<RootStackParamList, 'DetailReport'>;

export default function DetailReportScreen() {
    const navigation = useNavigation();
    const {top} = useSafeAreaInsets();
    const route = useRoute<DetailRouteProp>();
    const {selectedYear,selectedMonth, report} = route.params;

    const pieData = useMemo(
        () => report?.data?.investmentArea?.map((a:any) => a.percentage) ?? [],
        [report]
    );
    const pieColors = ['#00C900', '#AEAEAE', '#FFD100'];
    const pieLabels = useMemo(
        () => report?.data?.investmentArea?.map((a:any) => a.category) ?? [],
        [report]
      );
    
    const topStock=useMemo(()=>report?.data?.topStock?.stockName ?? [],[report]);
    const bottomStock=useMemo(()=>report?.data?.bottomStock?.stockName ?? [],[report]);

     
      if (!report) {
        return <Text>데이터가 없습니다.</Text>;
      }
  

    const userName='김나무'

  const investStyle=[
    {title:'거침 없는 공격형',
      characteristic :'공격형',
      description:'빠른 판단과 도전을 즐기지만 \n가끔은 신중함이 필요할 수 있어요.\n좋은 도전을 이어가면서,\n다음엔 다양한 산업군에도 투자해보세요!',
      image:require('../../assets/characters/fire_character.png'),
      leftColor:'#FFEFEF',
      rightColor:'#FFD6D6',
    },
    {title:'안정적인 중립형',
      characteristic :'중립형',
      description:'균형 잡힌 선택이 돋보여요.\n상황에 맞춰 판단하는 유연함이 강점이에요.\n지금처럼 나만의 리듬을 지키며,\n한 걸음 더 나아가보세요!',
      image:require('../../assets/characters/stone_character.png'),
      leftColor:'#F1F1F1',
      rightColor:'#DCDCDC',
    },
    {title:'굳건한 방어형',
      characteristic :'방어형',
      description:'안정적인 선택과 꾸준함이\n당신의 투자에 힘을 더해요.\n때로는 작은 도전도 새로운 기회를 열 수 있어요.\n조금씩 범위를 넓혀보는 건 어떨까요?',
      image:require('../../assets/characters/water_character.png'),
      leftColor:'#E4F2FF',
      rightColor:'#C6E3FF',
    }
  ]

  const investmentStyle=report?.data?.investmentStyle?.investmentStyle ??'';

  const found = useMemo(
    () => investStyle.find((i) => i.characteristic === investmentStyle) || null,
    [investmentStyle],
  );

  

  return (
    <View style={{flex:1}}>
    <TopBar title="현황 리포트"/>
    <ScrollView style={{
        flex:1,
        marginTop:top,
    }} showsVerticalScrollIndicator={false}>
    <View style={{...styles.wholeContainer}}>
    
    <CharacterContainer 
      userName={userName} 
      userStyle={found??{
        title:'',
        characteristic:'',
        description:'',
        leftColor:'',
        rightColor:'',
        image:null,
      }} />


    <View style={styles.secondContainer}>
        <View style={styles.investAreaContainer}>
            <Text style={styles.investAreaTitle}>{selectedYear}년 {String(selectedMonth).padStart(2, '0')}월 투자</Text>
            <View style={styles.summaryContainer}>
        <View style={styles.investNum}>
                <Text style={styles.summaryTitleText}>전체 수익률</Text>
                <Text style={styles.summaryText}>
                    {report?.data?.investmentSummary?.totalReturnRate > 0 ? '+' : '-'}{report?.data?.investmentSummary?.totalReturnRate}%</Text>
            </View>
            <View style={{width:hScale(16)}}/>
            <View style={styles.investNum}>
                <Text style={styles.summaryTitleText}>투자 횟수</Text>
                <Text style={styles.summaryText}>{report?.data?.investmentSummary?.totalInvestmentsCount}회</Text>
            </View>
            
        </View>
            <View style={styles.investAreaGraphContainer}>
                <Text style={styles.graphTitle}>주로 투자한 현황</Text>
                <View style={styles.graphContainer}>
                    <CircleGraph data={pieData} colors={pieColors} labels={pieLabels}/>
                </View>
            </View>
        </View>
        
        <View style={styles.returnRateContainer}>
                <Text style={{
                    fontSize:hScale(24),
                    fontWeight:'bold',
                    marginBottom:vScale(16),
                }}>수익/손실 요약</Text>
                <View style={styles.plusMinusContainer}>
                        <View style={[styles.plusMinusBox]}>
                            <Image source={require('../../assets/icons/upward_red.png')} />
                        <View style={{width:hScale(4)}}/>
                            
                            <View style={styles.ratioConatiner}>
                            <Text style={{
                                textAlign:'left',
                                fontSize:hScale(16),
                                textAlignVertical:'center',
                            }}>{topStock}</Text>
                                <Text style={{
                                    textAlign:'right',
                                    fontSize:hScale(24),
                                    fontWeight:'bold',
                                    color:Colors.red,
                                    textAlignVertical:'center',
                                }}>+{report?.data?.topStock?.returnRate}%</Text>
                                
                            </View>
                            
                        </View>
                        <View style={{height:vScale(16)}}/>

                        <View style={[styles.plusMinusBox]}>
                        <Image source={require('../../assets/icons/downward_blue.png')} />
                        <View style={{width:hScale(4)}}/>
                            <View style={styles.ratioConatiner}>
                            <Text style={{
                                textAlign:'left',
                                fontSize:hScale(16),
                                textAlignVertical:'center',
                            }}>{bottomStock}</Text>
                                <Text style={{
                                    textAlign:'right',
                                    fontSize:hScale(24),
                                    fontWeight:'bold',
                                    color:Colors.blue,
                                    textAlignVertical:'center',
                                }}>-{report?.data?.bottomStock?.returnRate}%</Text>
                            </View>
                        </View>
                </View>
        </View>
        <View style={styles.recommendContainer}>
            <Text style={{
                fontSize:hScale(24),
                fontWeight:'bold',
            }}>성장 추천</Text>
            <Text style={{
                fontSize:hScale(16),
                marginTop:vScale(16),
            }}>좋은 도전을 이어가면서, 다음엔 다양한 산업군에도 투자해보세요!</Text>
        </View>
    </View>
    </View>
    </ScrollView>
    </View>
    
  );
}

