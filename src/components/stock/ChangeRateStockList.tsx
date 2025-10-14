import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

interface ChangeRateStockListProps {
    rank:number;
    stockName:string;
    stockCode:string;
    closePrice:number;
    openPrice:number;
    stockImage:string;
    isKorean:boolean;
    onPriceChangeRateCalculated?: (rate: number) => void;
    isWebSocketConnected?: boolean;
    realtimePrice?: number;
    realtimePriceChangeRate?: number;
    isChangeRateSelected?: boolean;
    marketStatus?: string;
    ownedStockCodes?: string[]; // 보유 주식 코드 목록
}

type StockChartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotOwnedStockChart' | 'OwnedStockChart'>;

export default function ChangeRateStockList({rank,stockName,stockCode,closePrice,openPrice,stockImage,onPriceChangeRateCalculated,isKorean,isWebSocketConnected,realtimePrice,realtimePriceChangeRate,isChangeRateSelected,marketStatus,ownedStockCodes}:ChangeRateStockListProps) {
    const navigation = useNavigation<StockChartNavigationProp>();
    // 개별 API 호출 제거 - StockMainScreen에서 웹소켓으로 관리
    // closePrice와 openPrice가 유효한지 확인
    const safeClosePrice = closePrice ?? 0;
    const safeOpenPrice = openPrice ?? 0;
    // 등락률 버튼이 선택되었을 때만 웹소켓 데이터 사용
    const shouldUseWebSocket = isChangeRateSelected && isWebSocketConnected;
    
    // 웹소켓에서 받은 실시간 가격 우선 사용, 없으면 closePrice 사용
    const safeLivePrice = shouldUseWebSocket ? (realtimePrice ?? safeClosePrice) : safeClosePrice;
    // 웹소켓에서 받은 실시간 등락률 우선 사용, 없으면 계산
    const priceChangeRateLive = shouldUseWebSocket ? (realtimePriceChangeRate ?? (safeOpenPrice !== 0 ? (safeLivePrice - safeOpenPrice)/safeOpenPrice*100 : 0)) : 0;
    
    const priceChangeRate = safeOpenPrice !== 0 ? (safeLivePrice - safeOpenPrice)/safeOpenPrice*100 : 0;
    
    
    
    

    // priceChangeRate가 계산되면 부모 컴포넌트에 전달
    React.useEffect(() => {
        if (onPriceChangeRateCalculated) {
            shouldUseWebSocket ? onPriceChangeRateCalculated(priceChangeRateLive) : onPriceChangeRateCalculated(priceChangeRate);
        }
    }, [priceChangeRate, priceChangeRateLive, shouldUseWebSocket, onPriceChangeRateCalculated]);
    
    // 보유 주식인지 확인
    const isOwned = ownedStockCodes?.includes(stockCode) || false;
    const chartScreen = isOwned ? 'OwnedStockChart' : 'NotOwnedStockChart';
    
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate(chartScreen,{stockCode:stockCode,stockName:stockName,closePrice:safeClosePrice,stockImageUrl:stockImage})}>
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
                    <Text style={[
                        styles.stockPrice,
                        { color: shouldUseWebSocket ? (priceChangeRateLive >= 0 ? Colors.red : Colors.blue) : (priceChangeRate >= 0 ? Colors.red : Colors.blue) }
                    ]}>
                        {shouldUseWebSocket ? 
                            safeLivePrice.toLocaleString() + (isKorean ? "원" : " $") : 
                            safeClosePrice.toLocaleString() + (isKorean ? "원" : " $")
                        }
                    </Text>
                    <Text style={[
                        styles.stockPercentage,
                        { color: shouldUseWebSocket ? (priceChangeRateLive >= 0 ? Colors.red : Colors.blue) : (priceChangeRate >= 0 ? Colors.red : Colors.blue) }
                    ]}>
                        {shouldUseWebSocket ? 
                            (priceChangeRateLive >= 0 ? '+' : '') + priceChangeRateLive.toFixed(2) + '%' : 
                            (priceChangeRate >= 0 ? '+' : '') + priceChangeRate.toFixed(2) + '%'
                        }
                    </Text>
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
        fontWeight: '900',
        marginLeft: hScale(10),
    },
})