import { View, Text, Image, StyleSheet } from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles';

interface NewsSummaryProps{
    title: any;
    image: any; 
    hour: number | string;
}

const NewsSummary: React.FC<NewsSummaryProps> = ({title, image, hour}) => {
    return (
        <View style={styles.newsSummaryContainer}>
            <View style={styles.newsSummaryTitleContainer}>
                <Text style={styles.newsSummaryTitle}>{title}</Text>
                <Text style={styles.newsInfoTitle}>조선일보 • {hour}</Text>
            </View>
            {image ? <Image 
                source={typeof image === 'string' ? { uri: image } : image} 
                style={image ? styles.newsSummaryImage : {backgroundColor:'#D9D9D9'}} 
            /> : <View style={{backgroundColor:'#D9D9D9',width:hScale(72),height:vScale(72),borderRadius:hScale(8)}} />}
        </View>
    )
}

export default NewsSummary;

const styles = StyleSheet.create({
    newsSummaryContainer: {
        width: hScale(328),
        height: vScale(104),
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(16),
        flexDirection:'row',
        marginBottom:vScale(8),
    },      
    newsSummaryTitleContainer: {
        width: hScale(208),
        height: vScale(72),
        flexDirection:'column',
        marginRight:hScale(16),
    },
    newsSummaryTitle: {
        fontSize: hScale(16),
        textAlignVertical:'top',
    },
    newsInfoTitle: {
        marginTop:'auto',
        fontSize: hScale(12),
        color: Colors.outline,
    },
    newsSummaryImage: {
        width: hScale(72),
        height: vScale(72),
        borderRadius: hScale(8),
        alignSelf:'flex-end',
    }
})