import React from 'react';
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
}

type StockChartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StockChart'>;

export default function ChangeRateStockList({rank,stockName,stockCode,closePrice,openPrice,stockImage,onPriceChangeRateCalculated,isKorean}:ChangeRateStockListProps) {
    const navigation = useNavigation<StockChartNavigationProp>();
    
    // closePrice와 openPrice가 유효한지 확인
    const safeClosePrice = closePrice ?? 0;
    const safeOpenPrice = openPrice ?? 0;
    const priceChangeRate = safeOpenPrice !== 0 ? (safeClosePrice - safeOpenPrice)/safeOpenPrice*100 : 0;
    
    // priceChangeRate가 계산되면 부모 컴포넌트에 전달
    React.useEffect(() => {
        if (onPriceChangeRateCalculated) {
            onPriceChangeRateCalculated(priceChangeRate);
        }
    }, [priceChangeRate]);
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('StockChart',{stockCode:stockCode,stockName:stockName,closePrice:safeClosePrice})}>
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
              onLoad={() => console.log('Image loaded successfully:', stockImage)}
              onError={(error) => console.log('Image load error:', error.nativeEvent.error, 'URL:', stockImage)}
            />
            <View style={styles.stockInfoContainer}>
                <Text style={styles.stockName}>{stockName}</Text>
                <View style={styles.numContainer}>
                    <Text style={styles.stockPrice}>{safeClosePrice.toLocaleString()+(isKorean ? "원" : "달러")}</Text>
                    <Text style={[
                        styles.stockPercentage,
                        { color: priceChangeRate >= 0 ? Colors.red : Colors.primary }
                    ]}>
                        {priceChangeRate >= 0 ? '+' : ''}{priceChangeRate.toFixed(2)}%
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
        fontWeight: 'bold',
    },
})