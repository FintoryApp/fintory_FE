import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { getKoreanStock_marketCap } from '../../api/stock/getKoreanStockMarketCapList';
import { getOverseasStock_marketCap } from '../../api/stock/getOverseasStockMarketCapList';

type StockChartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotOwnedStockChart' | 'OwnedStockChart'>;

interface StockListProps {
    rank:number;
    stockName:string;
    stockCode:string;
    marketCap:number;
    currentPrice:number;
    stockImage:string;
    isKorean:boolean;
    isWebSocketConnected?: boolean;
    realtimePrice?: number;
    realtimePriceChangeRate?: number;
    isMarketCapSelected?: boolean;
    marketStatus?: string;
    ownedStockCodes?: string[]; // 보유 주식 코드 목록
}

export default function MarketCapStockList({rank,stockName,stockCode,stockImage,marketCap,currentPrice,isKorean,isWebSocketConnected,realtimePrice,realtimePriceChangeRate,isMarketCapSelected,marketStatus,ownedStockCodes}:StockListProps) {
    const navigation = useNavigation<StockChartNavigationProp>();
    // 개별 API 호출 제거 - StockMainScreen에서 웹소켓으로 관리
    // 달러의 경우 조/억 단위로 변환하는 함수
    const formatMarketCap = (value: number, isKorean: boolean) => {
        if (isKorean) {
            return value + "조 원";
        } else {
            // 달러의 경우: 4732 → "4조 7320억 달러"
            const trillion = Math.floor(value / 1000);
            const billion = Math.floor((value % 1000) * 10);
            
            if (trillion > 0 && billion > 0) {
                return `${trillion}조 ${billion}억 달러`;
            } else if (trillion > 0) {
                return `${trillion}조 달러`;
            } else {
                return `${billion}억 달러`;
            }
        }
    };

    const safeCurrentPrice = currentPrice ?? 0;
    const safeMarketCap = marketCap ?? 0;
    
    // 시가총액 버튼이 선택되었을 때만 웹소켓 데이터 사용
    const shouldUseWebSocket = isMarketCapSelected && isWebSocketConnected;
    
    // 웹소켓에서 받은 실시간 가격 우선 사용, 없으면 currentPrice 사용
    const displayPrice = shouldUseWebSocket ? (realtimePrice ?? safeCurrentPrice) : safeCurrentPrice;

    // 보유 주식인지 확인
    const isOwned = ownedStockCodes?.includes(stockCode) || false;
    const chartScreen = isOwned ? 'NotOwnedStockChart' : 'OwnedStockChart';

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate(chartScreen,{stockCode:stockCode,stockName:stockName,closePrice:currentPrice,stockImageUrl:stockImage})}>
            <Text style={styles.number}>{rank}</Text>
            
            <View style={styles.stockContainer}>
            <Image 
              source={stockImage ? { 
                uri: stockImage,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              } : require('../../../assets/icons/red_circle.png')} 
              defaultSource={require('../../../assets/icons/red_circle.png')}
              style={styles.image}
              resizeMode="contain"
              onLoad={() => {}}
              onError={(error) => {}}
            />
            <View style={styles.stockInfoContainer}>
                <Text style={styles.stockName}>{stockName}</Text>
                <View style={styles.numContainer}>
                    <Text style={styles.stockPrice}>
                        {displayPrice.toLocaleString() + (isKorean ? "원" : "달러")}
                    </Text>
                    {/* {marketCap !== undefined && (
                        <Text style={[
                            styles.stockPercentage,
                            { color: marketCap >= 0 ? Colors.red : Colors.blue }
                        ]}>
                            {marketCap >= 0 ? '+' : ''}{marketCap.toFixed(2)}%
                        </Text>
                    )} */}
                    <Text style={styles.stockMarketCap}>{"   "+formatMarketCap(safeMarketCap, isKorean)}</Text>
                </View>
            </View>
            </View>

        </TouchableOpacity>
    )
}

const styles=StyleSheet.create({
    container:{
        width: hScale(328),
        height: vScale(60),
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(8),
        marginBottom: vScale(4),
        flexDirection:'row',
        alignItems:'center',

    },
    number:{
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.primaryDark,
        marginRight: hScale(8),
    },
    stockContainer:{
        width: hScale(269),
        height: vScale(44),
        flexDirection:'row',
        alignItems:'center',
    },
    image:{
        width: hScale(32),
        height: vScale(32),
        borderRadius: hScale(16),
        marginRight: hScale(8),
        
    },
    stockInfoContainer:{
        height: vScale(42),
        justifyContent:'center',
    },
    stockName:{
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
    },
    numContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockPrice:{
        fontSize: hScale(12),
        color: Colors.black,
        marginRight: hScale(2),
    },
    stockPercentage:{
        fontSize: hScale(12),
        fontWeight: 'bold',
    },
    stockMarketCap:{
        fontSize: hScale(12),
        color: Colors.black,
    },
})