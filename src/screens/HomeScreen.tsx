import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Green from './Green';
import Blue from './Blue';


const AVATARS = [
    { name: '지윤', image: { uri: 'https://randomuser.me/api/portraits/women/1.jpg' } },
    { name: '민희', image: { uri: 'https://randomuser.me/api/portraits/women/2.jpg' } },
    { name: '민서', image: { uri: 'https://randomuser.me/api/portraits/women/3.jpg' } },
  ];
  

export default function HomeScreen() {
    const navigation=useNavigation();
  return (
    <View style={styles.container}>
      {/* Avatar Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.avatarScroll}
        contentContainerStyle={{paddingHorizontal:10}}>
        {AVATARS.map((avatar, idx) => (
          <View key={idx} style={styles.avatarItem}>
            <Image source={avatar.image} style={styles.avatarImage} />
            <Text style={styles.avatarName}>{avatar.name}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.horizontalLine} />

      {/* Greeting & Badge */}
      <View style={styles.greetingRow}>
        <View style={styles.nameAndBadge}>
            <Text style={styles.userName}>김나무</Text>
            <Image source={require('../../assets/icons/home_badge_name.png')} style={styles.badgeName} />
        </View>

        <TouchableOpacity>
          <Image source={require('../../assets/icons/setting.png')} style={styles.icon24} />
        </TouchableOpacity>
      </View>

      {/* Speech Bubble */}
      <View style={styles.speechContainer}>
        <Image 
          source={require('../../assets/icons/home_bubble.png')} 
          style={styles.speechBubbleImage} />
        <Text style={styles.speechText}>저번달은 공격적으로 투자했네!</Text>
        <Image 
          source={require('../../assets/characters/fire_character.png')} 
          style={styles.characterImage} />
      </View>

      {/* Box Container */}
      <View style={styles.boxContainer}>
        <View style={[styles.greenBox, styles.leftBox]}>
          <Text style={styles.boxText}>모의 주식투자{"\n"}시작하기</Text>
          <Image source={require('../../assets/icons/stock_white.png')} style={styles.boxIcon} />
        </View>
        <View style={styles.blueBox} >
        <Text style={styles.boxText}>현황{"\n"}리포트</Text>
        <Image source={require('../../assets/icons/report_white.png')} style={styles.boxIcon} />
        </View>
        <View style={[styles.whiteBox, styles.leftBox]} >
          <Text style={styles.whiteBoxText}>경제 용어 배우기</Text>
          <Image source={require('../../assets/icons/quiz.png')} style={styles.whiteBoxIcon} />
        </View>
        <View style={styles.whiteBox} >
        <Text style={styles.whiteBoxText}>오늘의 경제 뉴스</Text>
        <Image source={require('../../assets/icons/news.png')} style={styles.whiteBoxIcon} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7F0',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  avatarScroll: {
    marginBottom: 10,
    height:92,
    flexGrow:0,
  },
  avatarItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 68,
    borderWidth: 2,
    borderColor: '#FFD600',
    marginBottom: 4,
  },
  avatarName: {
    fontSize: 18,
    color: '#222',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop:0,
  },
  nameAndBadge:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 8,
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    width: 100,
    height: 30,
    backgroundColor: '#E3F0FF',
    borderRadius: 12,
  },
  
  settingsIcon: {
    marginLeft: 'auto',
  },
  badgeName:{
    marginTop:8,
    width: 80,
    height:28,
  },
  icon24: {
    marginTop:8,
    marginLeft:170,
    width: 30,
    height: 30,
  },
  speechContainer: {
    position: 'relative',
    marginRight: 10,
    width: 200,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speechBubbleImage: {
    width: 220,
    height: 80,
    resizeMode: 'contain',
    position: 'absolute',
    top: 90,
    left: -5,
  },
  speechText: {
    position: 'absolute',
    top: 125,
    left: 5,
    fontSize: 15,
    color: '#222',
    width: 200,
    textAlign: 'center',
  },
  characterImage: {
    width: 160,
    height: 160,
    top:50,
    left:200,
    resizeMode:'contain',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  
  horizontalLine: {
    height: 1,
    backgroundColor: '#E0E0E0', // or any color you like
    width: '100%',
    marginVertical: 10, // space above and below the line
  },
  leftBox:{
    marginRight:5,
  },
  greenBox: {
    width: 180,
    height: 230, // adjust as needed
    backgroundColor: '#00C900',
    borderRadius: 16,
    marginTop: 20,
  },
  blueBox: {
    width: 180,
    height: 230, // adjust as needed
    backgroundColor: '#2894FF',
    borderRadius: 16,
    marginTop: 20,
  },
  whiteBox: {
    width: 180,
    height: 150, // adjust as needed
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 100,
    width: '100%',
  },
  boxIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  whiteBoxIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  boxText: {
    position: 'absolute',
    top: 20,
    left: 16,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  whiteBoxText: {
    position: 'absolute',
    top: 20,
    left: 16,
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
