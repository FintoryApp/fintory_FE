import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../styles/Color.styles';
import TopBar from '../../components/ui/TopBar';
import { hScale, vScale } from '../../styles/Scale.styles';
import { useRoute } from '@react-navigation/native';
import { EconomyStudyStackParamList } from '../../navigation/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type WordDetailNavigationProp = NativeStackNavigationProp<EconomyStudyStackParamList, 'WordDetailScreen'>;
type WordDetailRouteProp = RouteProp<EconomyStudyStackParamList, 'WordDetailScreen'>;


    
export default function WordDetailScreen() {
    const content = `매수는 경제 용어로, 어떤 것을 구입해서 내 것으로 만드는 행위를 말해요. 특히 주식, 부동산, 코인 같은 투자 대상과 관련해서 자주 사용하는 말이에요.
쉽게 말해서, 무언가를 사는 것, 바로 그게 매수예요.

참고로, 매수의 반대는 매도(賣渡)라고 해요. 매도는 내가 가진 것을 파는 것을 말해요.`;

    const route = useRoute<WordDetailRouteProp>();
    const { word } = route.params;
    const top = useSafeAreaInsets().top;
    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 용어' />
            <View style={[styles.titleContainer,{marginTop:top}]}>
                <Image source={require('../../../assets/icons/pencil.png')} style={styles.pencilIcon} />
                <Text style={styles.titleText}>{word}란?</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.definitionText}>정의</Text>
                <Text style={styles.contentText}>
                    {content}
                </Text>
            </View>

            <View style={styles.exampleContainer}>
                <Text style={styles.definitionText}>좀 더 쉽게 이해해보기</Text>
                <Text style={styles.contentText}>
                    {content}
                </Text>
            </View>
        </View> 
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        width: hScale(114),
        height: vScale(33),
        marginLeft: hScale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    titleText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
        
    },
    pencilIcon: {
        marginRight: hScale(4),
        width: hScale(32),
        height: vScale(32),
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