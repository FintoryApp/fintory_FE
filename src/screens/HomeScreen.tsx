import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/HomeScreen.styles';


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

        
          
    
          <View style={styles.addItem}>
          <Image source={require('../../assets/icons/friend_add_button.png')} style={styles.friendAddButton} />
          <Image source={require('../../assets/icons/plus_button.png')} style={styles.plusButton} />
          <Text style={styles.addText}>ADD</Text>

        </View>

      {/* Avatar Scroll */}
        <View style={styles.scrollContainer}> /* 친구 아바타 스크롤 컨테이너 */
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
      <View style={styles.middleContainer}> /* 중간 컨테이너 */
      <View style={styles.topMiddleContainer}> /* 상단 중간 컨테이너 */
      <View style={styles.profileContainer}> /* 프로필 컨테이너 */
        <View style={styles.nameBadgeContainer}> /* 이름 배지 컨테이너 */
        <Text style={styles.userName}>김나무</Text>

        <View style={styles.badgeNameContainer}>
        <Image source={require('../../assets/icons/home_badge_name.png')} style={styles.badgeIcon} />
        <Text style={styles.badgeText}>배지 칭호</Text>
        </View>

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

        <TouchableOpacity>
        <View style={[styles.greenBox, styles.leftBox]}>
          <Text style={styles.boxText}>모의 주식투자{"\n"}시작하기</Text>
          <Image source={require('../../assets/icons/stock_white.png')} style={styles.boxIcon} />
        </View>
        </TouchableOpacity>
        <TouchableOpacity
           onPress={() => navigation.navigate('Report' as never)}>
        <View style={styles.blueBox}>
          <Text style={styles.boxText}>현황{"\n"}리포트</Text>
          <Image source={require('../../assets/icons/report_white.png')} style={styles.boxIcon} />
        </View>
        </TouchableOpacity>

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
