import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../../components/ui/TopBar';
import Colors from '../../styles/Color.styles';
import { hScale,vScale } from '../../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PointList from '../../components/PointList';
import AccountList from '../../components/AccountList';
import BigButton from '../../components/button/BigButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTotalPoint } from '../../api/totalPoint';
import { getPointList } from '../../api/pointList';

// API 응답 타입 정의
interface PointTransaction {
    amount: number;
    type: string;
    source: string;
    createdAt: string;
}

interface PointListResponse {
    resultCode: string;
    data: {
        totalAmount: number;
        transactions: PointTransaction[];
    };
    message: string;
}

export default function PointScreen() {
    const {top} = useSafeAreaInsets();
    const [totalPoint, setTotalPoint] = useState<number>(0);
    const [pointList, setPointList] = useState<PointTransaction[]>([]);

    // 날짜 포맷팅 함수
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // 타입과 소스에 따른 제목과 카테고리 매핑
    const getTitleAndCategory = (type: string, source: string): { title: string; category: string } => {
        if (type === 'EARN') {
            switch (source) {
                case 'ATTENDANCE_POINT':
                    return { title: '출석체크', category: '(출석 보상)' };
                case 'CHALLENGE_REWARD':
                    return { title: '적립', category: '(챌린지 보상)' };
                default:
                    return { title: '적립', category: `(${source})` };
            }
        } else if (type === 'SPEND') {
            return { title: '환전', category: '(가상머니)' };
        }
        return { title: type, category: `(${source})` };
    };
    useEffect(() => {
        const loadTotalPoint = async () => {
            try {
                // 먼저 AsyncStorage에서 가져오기 (빠른 로딩)
                const savedTotalPoint = await AsyncStorage.getItem('totalPoint');
                if (savedTotalPoint) {
                    setTotalPoint(parseInt(savedTotalPoint, 10));
                }
                
                // 그 다음 API에서 최신 데이터 가져오기
                try {
                    const pointResult = await getTotalPoint();
                    if (pointResult.data !== undefined) {
                        setTotalPoint(pointResult.data);
                        // 최신 데이터를 AsyncStorage에 저장
                        await AsyncStorage.setItem('totalPoint', pointResult.data.toString());
                    }
                } catch (apiError) {
                    console.error('포인트 API 호출 실패:', apiError);
                    // API 실패 시 AsyncStorage 값 유지
                }
            } catch (error) {
                console.error('포인트 로드 실패:', error);
            }
        };
        loadTotalPoint();
    }, []);

    useEffect(() => {
        const loadPointList = async () => {
            const pointList = await getPointList();
            setPointList(pointList.data.transactions);
        };
        loadPointList();
    }, []);
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
        
        <TopBar title='나의 가상 머니' />
        <View style={[styles.accountContainer,{marginTop:top}]}>
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>보유 포인트</Text>
                <Text style={styles.numText}>{totalPoint} P</Text>
            </View>
            <BigButton title='가상 머니로 환전하기' buttonColor={Colors.primaryDim} textColor={Colors.primaryDark} onPress={() => {}} />
        </View>

        <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.listText}>가상 계좌 내역</Text>
            {pointList.map((transaction, index) => {
                const { title, category } = getTitleAndCategory(transaction.type, transaction.source);
                return (
                    <PointList
                        key={index}
                        title={title}
                        category={category}
                        amount={transaction.amount}
                        date={formatDate(transaction.createdAt)}
                    />
                );
            })}
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