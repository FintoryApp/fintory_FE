import { View, Text, StyleSheet } from 'react-native'
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

interface AccountListProps {
    title:string;
    category:string;
    amount:number;
    date:string;
}   


export default function AccountList({title,category,amount,date}:AccountListProps) {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={styles.listContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.category}>({category})</Text>
                </View>
                <Text style={styles.date}>{date}</Text>
            </View>
            <Text style={amount > 0 ? styles.amountPlus : styles.amountMinus}>
                {amount > 0 ? '+' : ''} {amount.toLocaleString()} 원</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width:hScale(328),
        height:vScale(38),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:vScale(8),
    },
    leftContainer:{
    },
    listContainer:{
        flexDirection:'row',
    },
    title:{
        fontSize:hScale(16),
        color:Colors.black,
    },
    category:{
        fontSize:hScale(16),
        color:Colors.black,
        marginLeft:hScale(4),
    },

    date:{
        fontSize:hScale(12),
        color:Colors.outline,
    },
    amountPlus:{
        fontSize:hScale(16),
        fontWeight:'bold',
        color:Colors.primary,
    },
    amountMinus:{
        fontSize:hScale(16),
        fontWeight:'bold',
        color:Colors.black,
    },
})