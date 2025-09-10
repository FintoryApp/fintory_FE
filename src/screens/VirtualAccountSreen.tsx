import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../components/TopBar';
import Colors from '../styles/Color.styles';
import { hScale,vScale } from '../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccountList from '../components/AccountList';


export default function VirtualAccountScreen() {
    const {top} = useSafeAreaInsets();
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        
        <TopBar title='나의 가상 머니' />
        <View style={[styles.accountContainer,{marginTop:top}]}>
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>나의 가상 머니 계좌</Text>
                <Text style={styles.numText}>1,000,000 원</Text>
            </View>
        </View>

        <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.listText}>가상 계좌 내역</Text>
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
            <AccountList title='환전' category='(포인트 환전)' amount={300} date='2025.04.03' />
            <AccountList title='삼성전자' category='(매수)' amount={-23400} date='2025.04.03' />
            <AccountList title='카카오 모빌리티' category='(매입)' amount={345600} date='2025.04.03' />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    accountContainer: {
        width:'100%',
        height:vScale(119),
        backgroundColor:Colors.primaryContainer,
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(16),
        borderRadius:hScale(16),
    },
    textContainer: {
        width:hScale(328),
        height:vScale(87), 
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