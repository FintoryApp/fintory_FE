import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Colors from './Color.styles';

const { width: W, height: H } = Dimensions.get('window');

const guidelineW = 360;
const guidelineH = 740;

const hScale = (s: number) => {
    const newSize = (W / guidelineW) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
  
const vScale = (s: number) => {
    const newSize = (H / guidelineH) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const styles = StyleSheet.create({
    wholeContainer:{
        backgroundColor: Colors.surface,
        width: '100%',
        height: '100%',
    },

    topContainer:{
        width: hScale(360),
        height: vScale(352.72),
        backgroundColor: Colors.surface,
        top: vScale(92),
        position: 'absolute',
    },
    userInfoContainer:{
        width: hScale(328),
        //height: vScale(112),
        backgroundColor: Colors.white,
        left: hScale(16),
        borderRadius: hScale(16),
        marginBottom: vScale(16),
    },

    topContainerText:{
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        top: vScale(13),
        left: hScale(17),
        position: 'absolute',
    },

    percentageText:{
        fontSize: hScale(36),
        fontWeight: 'bold',
        color: Colors.red,
        top: vScale(35),
        left: hScale(16),
        position: 'absolute',
    },

    seeMoreButton:{
        width: hScale(45),
        height: vScale(16),
        //top: vScale(88),
        alignSelf: 'center',
        //position: 'absolute',
    },

    seeMoreButtonImage:{
        top: vScale(7),
    },

    seeMoreButtonText:{
        fontSize: hScale(12),
        color: Colors.outlineVariant,
        //top: vScale(3),
        left: hScale(16),
        position: 'absolute',
    },

    stockInfoContainer:{
        width: hScale(328),
        backgroundColor: Colors.white,
        borderRadius: hScale(16),
        alignSelf: 'center',
    
    },

    stockInfoText:{
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        top: vScale(16),
        left: hScale(16),
        position: 'absolute',
    },

    stockInfoBlockContainer:{
        width: hScale(296),
        alignSelf: 'center',
        height: vScale(100),
        position: 'absolute',
        top: vScale(54),
    },
});
