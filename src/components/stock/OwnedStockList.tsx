import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';

interface OwnedStockListProps {
    name: string;
    price: number;
    percentage: number;
    image: any;
    quantity?: number; // 보유 수량
    profitLoss?: number; // 손익금액
}

export default function OwnedStockList({name, price, percentage, image, quantity, profitLoss}: OwnedStockListProps) {
    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.stockContainer}>
                <Image source={image || require('../../../assets/icons/red_circle.png')} style={styles.image} />
                <View style={styles.stockInfoContainer}>
                    <Text style={styles.stockName}>{name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.stockPrice}>{price.toLocaleString()}원</Text>
                        <Text style={[
                            styles.stockPercentage,
                            { color: percentage > 0 ? Colors.red : Colors.blue }
                        ]}>
                            {percentage > 0 ? '+' + percentage + '%' : percentage + '%'}
                        </Text>
                    </View>
                    {quantity && (
                        <Text style={styles.quantityText}>보유: {quantity}주</Text>
                    )}
                    {profitLoss !== undefined && (
                        <Text style={[
                            styles.profitLossText,
                            { color: profitLoss > 0 ? Colors.red : profitLoss < 0 ? Colors.blue : Colors.black }
                        ]}>
                            {profitLoss > 0 ? '+' : ''}{profitLoss.toLocaleString()}원
                        </Text>
                    )}
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
