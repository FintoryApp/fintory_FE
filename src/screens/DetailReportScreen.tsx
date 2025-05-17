import React,{useState} from 'react';
import { View, Text, StyleSheet,ScrollView, Image, TouchableOpacity, ImageBackground  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/DetailReportScreen.styles';
import CustomCalendar from '../components/Calendar';
import CircleGraph from '../components/CircleGrapgh';

export default function DetailReportScreen() {
    const navigation = useNavigation();

    const pieData=[60,25,15];
    const pieColors=['#00C900','#AEAEAE','#FFD100'];
    const pieLabels=['IT','에너지','기타'];
  

  return (
    <View style={styles.wholeContainer}>
        <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={require('../../assets/icons/left.png')} style={styles.leftButton}/>
      </TouchableOpacity>

      <Text style={styles.topTitle}>현황 리포트</Text>
      <Image source={require('../../assets/icons/setting.png')} style={styles.settingButton}/>
      </View>


    <ScrollView>
    <View style={styles.middleContainer}>
    <View style={styles.investStyleContainer}>
          <Text style={styles.titleText}>나의 투자 성향</Text>
          
          <Image source={require('../../assets/characters/fire_character.png')} style={styles.characterImage}/>

          <Text style={styles.mainText}>김나무님의 투자는 {"\n"}<Text style={styles.boldText}>공격형</Text>입니다!</Text>

          <Text style={styles.explainText}>
            빠른 판단과 도전을 즐기지만, {"\n"}
            가끔은 신중함이 필요할 수 있어요.</Text>
            </View>
    </View>


    <View style={styles.secondContainer}>
        <View style={styles.investAreaContainer}>
            <Text style={styles.investAreaTitle}>2025년 5월 투자</Text>
            <View style={styles.investAreaGraphContainer}>
                <Text style={styles.graphTitle}>주로 투자한 현황</Text>
                <View style={styles.graphContainer}>
                    <CircleGraph data={pieData} colors={pieColors} labels={pieLabels}/>
                </View>
            </View>
        </View>
        <View style={styles.summaryContainer}>
            <View style={styles.investNum}>
                <Text style={styles.summaryTitleText}>투자 횟수</Text>
                <Text style={styles.summaryText}>12회</Text>
            </View>
            <View style={styles.investNum}>
                <Text style={styles.summaryTitleText}>전체 수익률</Text>
                <Text style={styles.summaryText}>+5.2%</Text>
            </View>
        </View>
        <View style={styles.returnRateContainer}>
                <Text style={styles.returnTitleText}>수익/손실 요약</Text>
                <View style={styles.plusMinusContainer}>
                        <View style={[styles.plusMinusBox, styles.plusColor]}>
                            <Text style={styles.plusMinusTitleText}>수익 TOP 1</Text>
                            <View style={styles.ratioConatiner}>
                                <Text style={[styles.ratioText, styles.plusTextColor]}>+8.0%</Text>
                                <Text style={[styles.ratioNameText, styles.plusTextColor]}>삼성전자</Text>
                            </View>
                        </View>
                        <View style={[styles.plusMinusBox, styles.minusColor]}>
                            <Text style={styles.plusMinusTitleText}>손실 TOP 1</Text>
                            <View style={styles.ratioConatiner}>
                                <Text style={[styles.ratioText, styles.minusTextColor]}>-2.5%</Text>
                                <Text style={[styles.ratioNameText, styles.minusTextColor]}>카카오</Text>
                            </View>
                        </View>
                </View>
        </View>
        <View style={styles.recommendContainer}>
            <Text style={styles.returnTitleText}>성장 추천</Text>
            <Text style={styles.recommendText}>좋은 도전을 이어가면서, 다음엔 다양한 산업군에{"\n"}도 투자해보세요!</Text>
        </View>
    </View>
    </ScrollView>
    </View>
  );
}

