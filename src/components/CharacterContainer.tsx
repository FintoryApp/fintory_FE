// src/components/CharacterContainer.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { hScale,vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles';

interface CharacterContainerProps {
  userName: string;
  userStyle: {
    title: string;
    characteristic: string;
    description: string;
    leftColor: string;
    rightColor: string;
    image: any;
    background:any;
    textColor:string;
  }|null;
}

const CharacterContainer: React.FC<CharacterContainerProps> = ({ userName, userStyle }) => (
  <View style={styles.characterContainer}>
    <View style={styles.investStyleTextContainer}>
      <Text style={{ fontSize: hScale(16), color: '#000000' }}>
        {userName}님의 투자 성향은
      </Text>
      <Text style={{ fontSize: hScale(24), color: userStyle?.textColor, fontWeight: 'bold' }}>
        {userStyle?.title}
        <Text style={{ fontSize: hScale(16), color: '#000000', fontWeight: 'medium' }}>
          입니다.
        </Text>
      </Text>
    </View>
    <Image source={userStyle?.background} 
    style={{position:'absolute',top:vScale(8),width:hScale(328),height:vScale(262)}} />
    <Image source={userStyle?.image} style={styles.characterImage} />
    
  </View>
);

export const styles = StyleSheet.create({
  characterContainer:{
    height:vScale(266),
    width:hScale(328),
    backgroundColor:'#FFFFFF',
    borderRadius:hScale(12),
    alignSelf:'center',
    paddingHorizontal:hScale(16),
    paddingVertical:vScale(16),
    //marginTop:vScale(30),
  },

  investStyleTextContainer:{
    height:vScale(58),
    width:hScale(216),
    alignSelf:'center',
    alignItems:'center',
  },

  characterImage:{
    position:'absolute',
    alignSelf:'center',
    top:vScale(82),
    width:hScale(168),
    height:vScale(168),
  },})

export default CharacterContainer;
