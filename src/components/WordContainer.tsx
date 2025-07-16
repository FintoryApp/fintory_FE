import { Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type WordDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EconomyWordDetailScreen'>;

interface WordContainerProps {
    word: string;
}

const WordContainer = ({ word }: WordContainerProps) => {
    const navigation = useNavigation<WordDetailNavigationProp>();
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('EconomyWordDetailScreen', { word:word })}>
            <Text style={styles.wordText}>{word}</Text>
            <Image source={require('../../assets/icons/chevron_forward.png')} style={styles.arrowRight} />
        </TouchableOpacity>
    )
}

export default WordContainer;

const styles = StyleSheet.create({
    container: {
        width: hScale(328),
        height: vScale(54),
        backgroundColor: Colors.white,
        borderRadius: hScale(8),
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(16),
        marginBottom: vScale(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wordText: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.primaryDark,
    },
    arrowRight: {
        width: hScale(9),
        height: vScale(16),
        tintColor: Colors.outline,
    },
})