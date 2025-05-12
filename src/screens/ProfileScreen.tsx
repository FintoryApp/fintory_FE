
import React from 'react';
import { View, Text, StyleSheet,ScrollView, Image, TouchableOpacity, ImageBackground  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/ReportScreen.styles';

export default function ReportScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.wholeContainer}>
      
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={require('../../assets/icons/left.png')} style={styles.leftButton}/>
      </TouchableOpacity>

      <Text style={styles.topTitle}>현황 리포트</Text>
      <Image source={require('../../assets/icons/setting.png')} style={styles.settingButton}/>
      </View>

      <View style={styles.middleContainer}>
        <View style={styles.investStyleContainer}>
          <Text style={styles.titleText}>나의 투자 성향</Text>
          
          <Image source={require('../../assets/characters/fire_character.png')} style={styles.characterImage}/>

          <Text style={styles.mainText}>김나무님의 투자는 {"\n"}<Text style={styles.boldText}>공격형</Text>입니다!</Text>

          <Text style={styles.explainText}>
            빠른 판단과 도전을 즐기지만, {"\n"}
            가끔은 신중함이 필요할 수 있어요.{"\n"}{"\n"}
            좋은 도전을 이어가면서,{"\n"}
            다음엔 다양한 산업군에도 투자해보세요!</Text>


            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.entireAnaylzeButton}>
                <Text style={styles.entireAnaylzeText}>투자분석 전체보기</Text>
                <Image source={require('../../assets/icons/right.png')} style={styles.rightArrowImage}/>
              </TouchableOpacity>
            </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchDate}>2025년 5월 <Text style={styles.searchText}>투자 분석 조회하기</Text></Text>
          <TouchableOpacity>
          <Image source={require('../../assets/icons/calendar.png')} style={styles.calendarImage}/>
          </TouchableOpacity>
        </View>
      </View>



    </View>
  );
}