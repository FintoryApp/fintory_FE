import { View, Text, StyleSheet } from 'react-native';
import TopBar from '../components/TopBar';
import FastImage from 'react-native-fast-image';
import { Colors } from '../styles/Color.styles';
import { hScale, vScale } from '../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const text = `김나무 님의 데이터를\n아직 분석할 수 없어요.\n\n핀토리와 함께 모의 주식을 시작하고\nAI 투자 분석을 받아보세요!`
export default function NoReportScreen() {

    const {top} = useSafeAreaInsets();
    return (
        <View>
        <TopBar title='현황 리포트'/>
        <View style={{...styles.fullContainer,marginTop:top}}>
        <FastImage
                style={{...styles.logo,marginTop:vScale(180)}}
                source={require('../../assets/icons/logo.gif')}
                resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.text}>
                {text}
                </Text>
            </View>
            </View>

    );
}

const styles = StyleSheet.create({
    fullContainer: {
        //flex: 1,
        backgroundColor: Colors.surface,
        width: '100%',
        height: '100%',
    },
    logo: {
        width: hScale(144),
        height: vScale(118.66),
        left:hScale(108),
    },
    text: {
        fontSize: hScale(16),
        top:vScale(32),
        alignSelf:'center',
        textAlign:'center',
    },
});