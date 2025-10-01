import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../../components/ui/TopBar';
import Colors from '../../styles/Color.styles';
import { hScale,vScale } from '../../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PointList from '../../components/PointList';
import AccountList from '../../components/AccountList';
import BigButton from '../../components/button/BigButton';


export default function PointScreen() {
    const {top} = useSafeAreaInsets();
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        
        <TopBar title='나의 가상 머니' />
        <View style={[styles.accountContainer,{marginTop:top}]}>
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>보유 포인트</Text>
                <Text style={styles.numText}>1,000 P</Text>
            </View>
            <BigButton title='가상 머니로 환전하기' buttonColor={Colors.primaryDim} textColor={Colors.primaryDark} onPress={() => {}} />
        </View>

        <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.listText}>가상 계좌 내역</Text>
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
            <PointList title='적립' category='(챌린지 보상)' amount={300} date='2025.04.03' />
            <PointList title='환전' category='(가상머니)' amount={-200} date='2025.04.03' />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    accountContainer: {
        width:'100%',
        height:vScale(183),
        backgroundColor:Colors.primaryContainer,
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(16),
        borderRadius:hScale(16),
        
    },
    textContainer: {
        width:hScale(328),
        height:vScale(87), 
        marginBottom:vScale(8),
    },
    titleText:{
        fontSize:hScale(16),
        fontWeight:'bold',
        color:Colors.outline,
        marginBottom:vScale(16),
    },
    numText:{
        fontSize:hScale(36),
        fontWeight:'bold',
        color:Colors.black,
    },
    scrollViewStyle: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContainer:{
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(16),
        paddingBottom:vScale(30),
    },

    listText:{
        fontSize:hScale(16),
        fontWeight:'bold',
        color:Colors.black,
        marginBottom:vScale(16),
    },
})