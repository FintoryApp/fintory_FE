import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../styles/Color.styles';
import TopBar from '../../components/ui/TopBar';
import { hScale, vScale } from '../../styles/Scale.styles';
import { useRoute } from '@react-navigation/native';
import { EconomyStudyStackParamList } from '../../navigation/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getWordInfo } from '../../api/wordInfo';
import { useEffect, useState } from 'react';

type WordDetailNavigationProp = NativeStackNavigationProp<EconomyStudyStackParamList, 'WordDetailScreen'>;
type WordDetailRouteProp = RouteProp<EconomyStudyStackParamList, 'WordDetailScreen'>;


    
export default function WordDetailScreen() {
    

    const route = useRoute<WordDetailRouteProp>();
    const { id } = route.params;
    const top= useSafeAreaInsets().top;
    const [wordInfo, setWordInfo] = useState<any>({});

    useEffect(() => {
        (async () => {
            const res = await getWordInfo(id);
            setWordInfo(res.data);
        })();
    }, [id]);
    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 용어' />
            <View style={[styles.titleContainer,{marginTop:top}]}>
                <Image source={require('../../../assets/icons/pencil.png')} style={styles.pencilIcon} />
                <Text style={styles.titleText}>{wordInfo.word}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.definitionText}>정의</Text>
                <Text style={styles.contentText}>
                    {wordInfo.definition}
                </Text>
            </View>

            <View style={styles.exampleContainer}>
                <Text style={styles.definitionText}>좀 더 쉽게 이해해보기</Text>
                <Text style={styles.contentText}>
                    {wordInfo.moreInfo}
                </Text>
            </View>
        </View> 
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        height: vScale(33),
        flexDirection: 'row',
        paddingLeft: hScale(16),
        alignItems: 'center',
    },

    titleText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
        
    },
    pencilIcon: {
        marginRight: hScale(4),
        width: hScale(20),
        height: vScale(20),
    },  
    contentContainer: {
        marginTop: vScale(15),
        width: hScale(328),
        backgroundColor: Colors.white,
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(16),
        borderRadius: hScale(16),
        alignSelf: 'center',
        minHeight: vScale(100),
    },
    definitionText: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.primaryDark,
        marginBottom: vScale(16),
    },
    contentText: {
        fontSize: hScale(12),
        lineHeight: vScale(18),
    },
    exampleContainer: {
        marginTop: vScale(15),
        width: hScale(328),
        backgroundColor: Colors.white,
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(16),
        borderRadius: hScale(16),
        alignSelf: 'center',
        minHeight: vScale(100),
    },
});