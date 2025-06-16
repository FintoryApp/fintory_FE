import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const guidelineW = 360;
const guidelineH = 740;

export const hScale = (s: number) => {
    const newSize = (W / guidelineW) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
  
const vScale = (s: number) => {
    const newSize = (H / guidelineH) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const styles = StyleSheet.create({
    wholeContainer: {
        flex: 1,
        backgroundColor: '#F4FFF4',
    },

    topContainer: {
        width: hScale(360),
        height: vScale(60),
        position:'absolute',
        top:vScale(32),
    },

    topTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        left:hScale(157.5),
        top:vScale(19),
        position:'absolute',
    },

    leftButtonConainer: {
        width: hScale(44),
        height: vScale(44),
        left:hScale(16),
        top:vScale(8),
        position:'absolute',
    },

    leftButton: {
        alignSelf:'center',
        justifyContent:'center',
        position:'absolute',
    },

    middleContainer: {
        width: hScale(332),
        height: vScale(180),
        position:'absolute',
        top:vScale(156),
        left:hScale(16),
    },

    idConatiner: {
        width: hScale(332),
        height: vScale(70),
        position:'absolute',
    },

    idTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        width: hScale(328),
        height: vScale(22),
        position:'absolute',

    },

    idInput: {
        width: hScale(328),
        height: vScale(40),
        position:'absolute',
        top:vScale(30),
        borderWidth: 1,
        borderColor: '#AEAEAE',
        borderRadius: hScale(6),
        paddingHorizontal: hScale(8),
        paddingVertical: 0,
        fontSize: hScale(12),
        textAlignVertical: 'center',
        includeFontPadding: false,
        lineHeight: vScale(40),
    },

    passwordContainer: {
        width: hScale(332),
        height: vScale(90),
        position:'absolute',
        top:vScale(90),
    },

    passwordTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        width: hScale(328),
        height: vScale(22),
        position:'absolute',
    },

    passwordInput: {
        width: hScale(328),
        height: vScale(40),
        position:'absolute',
        top:vScale(30),
        borderWidth: 1,
        borderColor: '#AEAEAE',
        borderRadius: hScale(6),
        paddingHorizontal: hScale(8),
        paddingVertical: 0,
        fontSize: hScale(12),
        textAlignVertical: 'center',
        includeFontPadding: false,
        lineHeight: vScale(40),
    },

    bottomContainer: {
        width: hScale(360),
        height: vScale(114),
        position:'absolute',
        top:vScale(472),
    },

    logInContainer: {
        width: hScale(360),
        height: vScale(72),
        position:'absolute',
    },

    logInButton: {
        width: hScale(328),
        height: vScale(72),
        left:hScale(16),
        position:'absolute',
        backgroundColor:'#00C900',
        borderRadius: hScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },

    logInButtonText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
        color:'#FFFFFF',
        textAlign:'center',
        lineHeight: vScale(72),
    },

    findContainer: {
        width: hScale(360),
        height: vScale(22),
        position:'absolute',
        top:vScale(92),
        flexDirection:'row',
        justifyContent: 'center',
    },

    findButton: {
        width: hScale(78),
        height: vScale(22),
        justifyContent:'center',
        alignItems:'center',
    },

    findButtonText: {
        fontSize: hScale(12),
        fontWeight: 'bold',
        color:'#AEAEAE',
        textAlign:'center',
    },

    underline: {
        height: 1,
        backgroundColor: '#AEAEAE',
        marginTop: vScale(3),
    },

}); 