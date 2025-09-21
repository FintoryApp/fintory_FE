import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

interface StockListProps {
    name:string;
    price:number;
    marketCap:number;
    image:any;
    number:number;
    
}

export default function MarketCapStockList({number,price,name,marketCap,image}:StockListProps) {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.number}>{number}</Text>
            
            <View style={styles.stockContainer}>
            <Image source={image||require('../../assets/icons/red_circle.png')} style={styles.image} />
            <View style={styles.stockInfoContainer}>
                <Text style={styles.stockName}>{name}</Text>
                <View style={styles.numContainer}>
                    <Text style={styles.stockPrice}>{price+"원"}</Text>
                    <Text style={styles.stockMarketCap}>{marketCap+"조 원"}</Text>
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