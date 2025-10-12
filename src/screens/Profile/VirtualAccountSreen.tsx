import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../../components/ui/TopBar';
import Colors from '../../styles/Color.styles';
import { hScale,vScale } from '../../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccountList from '../../components/AccountList';
import { getTotalMoney } from '../../api/totalMoney';
import { getMoneyList } from '../../api/moneyList';

export default function VirtualAccountScreen() {
    const {top} = useSafeAreaInsets();
    const [totalMoney, setTotalMoney] = useState<number>(0);
    const [moneyList, setMoneyList] = useState<any[]>([]);

    // 날짜 포맷팅 함수
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    useEffect(() => {
        const loadTotalMoney = async () => {
            const res = await getTotalMoney();
            setTotalMoney(res.data);
        };
        loadTotalMoney();
    }, []);
    
    useEffect(() => {
        const loadMoneyList = async () => {
            const res = await getMoneyList();
            setMoneyList(res.data);
        };
        loadMoneyList();
    }, []);
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        
        <TopBar title='나의 가상 머니' />
        <View style={[styles.accountContainer,{marginTop:top}]}>
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>나의 가상 머니 계좌</Text>
                <Text style={styles.numText}>{totalMoney.toLocaleString()} 원</Text>
            </View>
        </View>

        <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.listText}>가상 계좌 내역</Text>
            {moneyList.map((item, index) => (
                <AccountList 
                key={index} 
                title={item.type === 'WITHDRAW' ? '출금' : '입금'} 
                category={item.description} 
                amount={item.amount} 
                date={formatDate(item.occurredAt)} 
                />
            ))}
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