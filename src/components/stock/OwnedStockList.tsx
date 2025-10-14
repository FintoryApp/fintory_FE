import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';

interface OwnedStockListProps {
    stockCode: string;
    stockName: string;
    currentPrice:number;
    quantity: number;
    purchaseamount:number;
    profileImageUrl:string;
    averagePurchasePrice:number;
    isKorean: boolean;
    realtimePrice?: number;
    isWebSocketConnected?: boolean;
    onPress?: () => void;
}


  
export default function OwnedStockList({stockCode, stockName, quantity, purchaseamount, profileImageUrl, averagePurchasePrice, currentPrice, isKorean, realtimePrice, isWebSocketConnected, onPress}: OwnedStockListProps) {
    // 웹소켓이 연결되어 있고 실시간 가격이 있으면 실시간 가격 사용, 아니면 API 종가 사용
    const displayPrice = (isWebSocketConnected && realtimePrice) ? realtimePrice : currentPrice;
    const profitLoss = (displayPrice-averagePurchasePrice)/averagePurchasePrice*100;
    // const isDomesticStock = (stockCode: string): boolean => {
    //     if (!stockCode || stockCode.length === 0) {
    //       return false;
    //     }
        
    //     const firstChar = stockCode.charAt(0);
    //     return /[0-9]/.test(firstChar);
    //   };
      
    //  const isDomestic = isDomesticStock(stockCode);
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.stockContainer}>
            <Image 
              source={profileImageUrl ? { 
                uri: profileImageUrl,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              } : require('../../../assets/icons/red_circle.png')} 
              defaultSource={require('../../../assets/icons/red_circle.png')}
              style={styles.image}
              resizeMode="contain"
              onLoad={() => console.log('Image loaded successfully:', profileImageUrl)}
              onError={(error) => console.log('Image load error:', error.nativeEvent.error, 'URL:', profileImageUrl)}
            />
                <View style={styles.stockInfoContainer}>
                    <Text style={styles.stockName}>{stockName}</Text>
                    <Text style={styles.stockQuantity}>{quantity}주</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.stockPrice}>{displayPrice.toLocaleString() + (isKorean ? "원" : "$")}</Text>
                        <Text style={[
                            styles.stockPercentage,
                            { color: profitLoss > 0 ? Colors.red : Colors.blue }
                        ]}>
                            {profitLoss > 0 ? '+' + profitLoss.toFixed(2) + '%' : profitLoss.toFixed(2) + '%'}
                        </Text>
                    </View>
                    
                    
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: hScale(296),
        height: vScale(61),
        backgroundColor: Colors.white,
        borderRadius: hScale(8),
        borderWidth: 1,
        borderColor: Colors.outline,
        marginBottom: vScale(8),
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(12),
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    image: {
        width: hScale(40),
        height: vScale(40),
        borderRadius: hScale(20),
        marginRight: hScale(12),
    },
    stockInfoContainer: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap:'auto',
    },
    stockName: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: vScale(4),
        alignSelf: 'center',
    },
    priceContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: vScale(2),
    },
    stockPrice: {
        fontSize: hScale(14),
        color: Colors.black,
        marginRight: hScale(8),
    },
    stockPercentage: {
        fontSize: hScale(12),
        fontWeight: 'bold',
    },
    stockQuantity: {
        fontSize: hScale(12),
        color: Colors.outline,
        marginBottom: vScale(2),
        alignSelf: 'center',
    },
    quantityText: {
        fontSize: hScale(11),
        color: Colors.outline,
        marginBottom: vScale(2),
    },
    profitLossText: {
        fontSize: hScale(12),
        fontWeight: 'bold',
    },
})
