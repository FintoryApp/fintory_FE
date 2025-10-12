import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';

interface OwnedStockListProps {
    stockCode: string;
    stockName: string;
    quantity: number;
    purchaseAmount:number;
    profileImageUrl:string;
    averagePurchasePrice:number;
    closePrice:number;
}


  
export default function OwnedStockList({stockCode, stockName, quantity, purchaseAmount, profileImageUrl, averagePurchasePrice, closePrice}: OwnedStockListProps) {
    const profitLoss = (closePrice-averagePurchasePrice)/averagePurchasePrice*100;
    // const isDomesticStock = (stockCode: string): boolean => {
    //     if (!stockCode || stockCode.length === 0) {
    //       return false;
    //     }
        
    //     const firstChar = stockCode.charAt(0);
    //     return /[0-9]/.test(firstChar);
    //   };
      
    //  const isDomestic = isDomesticStock(stockCode);
    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.stockContainer}>
                <Image source={profileImageUrl|| require('../../../assets/icons/red_circle.png')} style={styles.image} />
                <View style={styles.stockInfoContainer}>
                    <Text style={styles.stockName}>{stockName}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.stockPrice}>{purchaseAmount.toLocaleString() + "원"}</Text>
                        <Text style={[
                            styles.stockPercentage,
                            { color: profitLoss > 0 ? Colors.red : Colors.blue }
                        ]}>
                            {profitLoss > 0 ? '+' + profitLoss + '%' : profitLoss + '%'}
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
        height: vScale(80),
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
        justifyContent: 'center',
    },
    stockName: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: vScale(4),
    },
    priceContainer: {
        flexDirection: 'row',
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
