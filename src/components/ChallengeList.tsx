import { View, Text, StyleSheet } from 'react-native'
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

interface ChallengeListProps {
    title:string;
    complete:boolean;
    challenge:string;
}   


export default function ChallengeList({title,complete,challenge}:ChallengeListProps) {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={styles.listContainer}>
                <Text style={styles.title}>{title} 챌린지</Text>
                
                </View>
                <Text style={styles.date}>{challenge}</Text>
            </View>
            <Text style={complete? styles.complete : styles.incomplete}>
                {complete ? '완료' : '미완료'} </Text>
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
        marginBottom:vScale(16),
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
    complete:{
        fontSize:hScale(16),
        fontWeight:'bold',
        color:Colors.primary,
    },
    incomplete:{
        fontSize:hScale(16),
        fontWeight:'bold',
        color:Colors.middleGray,
    },
})