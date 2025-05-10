import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Green from './Green';
import Blue from './Blue';
import { styles } from './HomeScreen.styles';

const AVATARS = [
  { name: '지윤', image: { uri: 'https://randomuser.me/api/portraits/women/1.jpg' } },
  { name: '민희', image: { uri: 'https://randomuser.me/api/portraits/women/2.jpg' } },
  { name: '민서', image: { uri: 'https://randomuser.me/api/portraits/women/3.jpg' } },
  { name: '지윤', image: { uri: 'https://randomuser.me/api/portraits/women/1.jpg' } },
  { name: '민희', image: { uri: 'https://randomuser.me/api/portraits/women/2.jpg' } },
  { name: '민서', image: { uri: 'https://randomuser.me/api/portraits/women/3.jpg' } },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    
    <View style={styles.wholeContainer}> /*전체 컨테이너 */
      <View style={styles.friendContainer}> /*상단 1 컨테이너 */
      {/* Avatar Scroll */}
      <View style={styles.scrollContainer}>
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
      </View>
      </View>
      <View style={styles.horizontalLine} />

      
      {/*프로필 컨테이너*/}
      <View style={styles.middleContainer}>
      <View style={styles.topMiddleContainer}>
      <View style={styles.profileContainer}>
        <View style={styles.nameBadgeContainer}>
        <Text style={styles.userName}>김나무</Text>
        <Image source={require('../../assets/icons/home_badge_name.png')} style={styles.badgeName} />
        </View>
        <TouchableOpacity>
          <Image source={require('../../assets/icons/setting.png')} style={styles.icon24} />
        </TouchableOpacity>
      </View>

      {/* Speech Bubble */}
      <View style={styles.characterContainer}>
        <View style={styles.speechContainer}>
        <Image 
          source={require('../../assets/icons/home_bubble.png')} 
          style={styles.speechBubbleImage} />
        <Text style={styles.speechText}>저번달은 공격적으로 투자했네!</Text>
        </View>
        <Image 
          source={require('../../assets/characters/fire_character.png')} 
          style={styles.characterImage} />
      </View>
      </View>

      {/* Box Container */}
      <View style={styles.boxContainer}>
        <View style={styles.colorContainer}>
        <View style={[styles.greenBox, styles.leftBox]}>
          <Text style={styles.boxText}>모의 주식투자{"\n"}시작하기</Text>
          <Image source={require('../../assets/icons/stock_white.png')} style={styles.boxIcon} />
        </View>
        <View style={styles.blueBox}>
          <Text style={styles.boxText}>현황{"\n"}리포트</Text>
          <Image source={require('../../assets/icons/report_white.png')} style={styles.boxIcon} />
        </View>
        </View>
        <View style={styles.whiteContainer}>
        <View style={styles.whiteBox}>
          <Text style={styles.whiteBoxText}>경제 용어 배우기</Text>
          <Image source={require('../../assets/icons/quiz.png')} style={styles.whiteBoxIcon} />
        </View>
        <View style={styles.whiteBox}>
          <Text style={styles.whiteBoxText}>오늘의 경제 뉴스</Text>
          <Image source={require('../../assets/icons/news.png')} style={styles.whiteBoxIcon} />
        </View>
        </View>
        </View>
      </View>
    </View>
  );
}
