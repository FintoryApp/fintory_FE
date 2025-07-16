import { Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

interface WordContainerProps {
    word: string;
}

const WordContainer = ({ word }: WordContainerProps) => {
    return (
        <TouchableOpacity style={styles.container}>
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