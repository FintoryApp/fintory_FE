import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../../components/ui/TopBar';
import Colors from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ChallengeList from '../../components/ChallengeList';
import FastImage from 'react-native-fast-image';


export default function ChallengeScreen() {
  const {top} = useSafeAreaInsets();
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface,alignItems:'center'}}>
      <TopBar title='챌린지' />
        <View style={[styles.profileImage,{marginTop:top+vScale(60)}]}></View>
      
        <LinearGradient colors={['#1B9300','#85E76F']} 
            locations={[0.16,1]} 
            style={[styles.greenGradient,{marginTop:top+vScale(40)}]} 
            >

            <LinearGradient colors={['#54DA48','#30B125']} 
            locations={[0,1]} 
            style={styles.miniCircleGradient}/>

        <LinearGradient colors={['#66D85C','#20A914']} 
            locations={[0,1]} 
            style={styles.bigCircleGradient}>
                <FastImage
                style={styles.logo}
                source={require('../../../assets/icons/logo.gif')}
                resizeMode={FastImage.resizeMode.contain}
            />
            </LinearGradient>
            <View style={{width:hScale(296),height:vScale(128),marginBottom:vScale(24),zIndex:8}}>
                <Text style={{fontSize:hScale(16),color:Colors.white,marginBottom:vScale(8)}}>
                    김나무 님의 이번달 챌린지
                    </Text>
                <Text style={{fontSize:hScale(36),color:Colors.white,fontWeight:'bold'}}>
                    경제 용어 10개{"\n"}공부하기
                </Text>
            </View>
            <Text style={{fontSize:hScale(12),color:Colors.primaryDark,zIndex:6}}>
                챌린지 완료까지 화이팅!
            </Text>
        </LinearGradient>
        

        <ScrollView style={styles.listContainer}
                contentContainerStyle={{paddingBottom:vScale(30)}}>

                <Text style={{
                    fontSize:hScale(16),
                    color:Colors.primaryDark,
                    fontWeight:'bold',
                    marginBottom:vScale(16)}}>
                        이전 챌린지 목록
                    </Text>
                
                <ChallengeList title='7월 2주차' complete={true} challenge='경제 용어 10개 공부하기' />
                <ChallengeList title='7월 1주차' complete={false} challenge='경제 용어 10개 공부하기' />
                <ChallengeList title='7월 2주차' complete={true} challenge='경제 용어 10개 공부하기' />
                <ChallengeList title='7월 1주차' complete={false} challenge='경제 용어 10개 공부하기' />
                <ChallengeList title='7월 2주차' complete={true} challenge='경제 용어 10개 공부하기' />
                <ChallengeList title='7월 1주차' complete={false} challenge='경제 용어 10개 공부하기' />
                <ChallengeList title='7월 2주차' complete={true} challenge='경제 용어 10개 공부하기' />
                <ChallengeList title='7월 1주차' complete={false} challenge='경제 용어 10개 공부하기' />
            </ScrollView>

      
    </View>
  );
}


const styles = StyleSheet.create({
    greenGradient: {
        width:hScale(328),
        height:vScale(240),
        borderRadius:hScale(16),
        paddingVertical:vScale(36),
        paddingHorizontal:hScale(16),
        zIndex:1,
        marginBottom:vScale(12),
        overflow:'hidden',
    },
    profileImage: {
        width:hScale(56),
        height:vScale(56),
        borderRadius:100,
        outlineColor:Colors.primary,
        outlineWidth:hScale(8),
        position:'absolute',
        left:hScale(30),
        zIndex:2,
        backgroundColor:Colors.outlineVariant,
    },
    
    listContainer: {
        width:hScale(360),
            height:vScale(270),
            paddingVertical:vScale(16),
            paddingHorizontal:hScale(16),
            backgroundColor:Colors.white,
            zIndex:5,
        },
            

    miniCircleGradient: {
        width:hScale(48),
        height:hScale(48),
        borderRadius:hScale(24),
        position:'absolute',
        left:hScale(264),
        top:vScale(60),
        zIndex:3,
        
    },
    bigCircleGradient: {
        width:hScale(224),
        height:hScale(224), // vScale 대신 hScale 사용
        borderRadius:hScale(112), // width/height의 절반
        position:'absolute',
        left:hScale(123),
        top:vScale(100),
        zIndex:4,
        
    },
    logo: {
        width:hScale(93.5),
        height:hScale(77.04),
        position:'absolute',
        left:hScale(30),
        top:vScale(55),
        zIndex:8,
    },
    
        
})