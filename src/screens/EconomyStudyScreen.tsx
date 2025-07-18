import { View, Text, Image, TouchableOpacity } from 'react-native';
import TopBar from '../components/TopBar';
import { styles } from '../styles/EconomyStudyScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewsSummary from '../components/NewsSummary';
import { Colors } from '../styles/Color.styles';
import { useNavigation } from '@react-navigation/native';

const newsData = [
    {
        title: '부메랑 된 트럼프 관세 전생...미국 성장률 -0.3%',
        image: require('../../assets/icons/googleLogo.png'),
    },
]
export default function EconomyStudyScreen() {
    const navigation = useNavigation();
    const {top} = useSafeAreaInsets();
    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 뉴스 & 경제 용어' />
            <View style={{...styles.newsContainer,marginTop:top}}>
                <View style={styles.newsTitleContainer}>
                    <Image source={require('../../assets/icons/speaker.png')} style={styles.newsTitleIcon} />
                    <Text style={styles.newsTitleText}>오늘의 경제 뉴스</Text>
                    <Text style={styles.dateTitleText}>2025.07.16</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('EconomyNewsDetailScreen' as never);
                }}>
                    <NewsSummary title={newsData[0].title} image={newsData[0].image} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <NewsSummary title={newsData[0].title} image={newsData[0].image} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <NewsSummary title={newsData[0].title} image={newsData[0].image} />
                    </TouchableOpacity>
                
            </View>

            <View style={styles.wordContainer}>
                <View style={styles.wordTitleContainer}>
                    <Image source={require('../../assets/icons/pencil.png')} style={styles.wordTitleIcon} />
                    <Text style={styles.wordTitleText}>오늘의 경제 용어</Text>
                <TouchableOpacity style={styles.seeAllButtonContainer} onPress={()=>{
                    navigation.navigate('EconomyWordScreen' as never);
                }}>
                    <Text style={styles.seeAllButtonText}>전체보기</Text>
                    <Image source={require('../../assets/icons/chevron_forward.png')} style={styles.narrowImage} />
                </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.wordItemContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.wordText}>금리</Text>
                    <Text style={styles.explainText}>빌리거나 빌려 준 돈에 대한 이자, 이율</Text>

                </View>
                </TouchableOpacity>

            </View>
        </View>
    );
}
