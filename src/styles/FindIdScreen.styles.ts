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
        left:hScale(141),
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
        width: hScale(360),
        height: vScale(184),
        position:'absolute',
        top:vScale(92),
        left:hScale(1),
    },

    phoneNumContainer: {
        width: hScale(328),
        height: vScale(72),
        position:'absolute',
        left:hScale(16),
    },
    phoneNumTitleContainer: {
        width: hScale(328),
        height: vScale(24),
        position:'absolute',
    },
    getCodeButton: {
        width: hScale(86),
        height: vScale(24),
        position:'absolute',
        left:hScale(101),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(4),
        backgroundColor:'#AEAEAE',
        borderRadius: hScale(8),
        justifyContent: 'center',
        alignItems: 'center',
        
    },

    getCodeButtonText: {
        fontSize: hScale(12),
        color:'#FFFFFF',
        textAlign:'center',
    },

    phoneNumTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        width: hScale(328),
        height: vScale(22),
        position:'absolute',
    },

    phoneNumInputContainer: {
        width: hScale(328),
        height: vScale(72),
        position:'absolute',
        //left:hScale(16),
        top:vScale(32),
    },

    phoneNumInput1: {
        width: hScale(70),
        height: vScale(40),
        position:'absolute', 
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

    phoneNumInput2: {
        width: hScale(113),
        height: vScale(40),
        position:'absolute',
        left:hScale(86),
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
    phoneNumInput3: {
        width: hScale(113),
        height: vScale(40),
        position:'absolute',
        left:hScale(215),
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
    codeContainer: {
        width: hScale(328),
        height: vScale(92),
        position:'absolute',
        top:vScale(92),
        left:hScale(16),
    },
    codeInputContainer: {
        width: hScale(328),
        height: vScale(72),
        position:'absolute',
    },

    codeInputTitleContainer: {
        width: hScale(153),
        height: vScale(24),
        position:'absolute',
    },
    codeInputTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        width: hScale(328),
        height: vScale(22),
        position:'absolute',
    },
    codeCheckContainer: {
        width: hScale(86),
        height: vScale(24),
        position:'absolute',
        left:hScale(67),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(4),
        backgroundColor:'#AEAEAE',
        borderRadius: hScale(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeCheckText: {
        fontSize: hScale(12),
        color:'#FFFFFF',
        textAlign:'center',
    },

    codeInput: {
        width: hScale(328),
        height: vScale(40),
        position:'absolute',
        top:vScale(32),
        borderWidth: 1,
        borderColor: '#AEAEAE',
        borderRadius: hScale(6),
        paddingHorizontal: hScale(8),
        paddingVertical: 0,
        fontSize: hScale(12),
        color: '#000000',
        textAlignVertical: 'center',
        includeFontPadding: false,
        lineHeight: vScale(40),
        
    },
    verificationMessageContainer: {
        width: hScale(328),
        height: vScale(16),
        position:'absolute',
        top:vScale(76),
    },

    verificationMessage: {
        position: 'absolute',
        fontSize: hScale(12),
    },

    verificationSuccess: {
        color: '#4CAF50',
    },

    verificationError: {
        color: '#FF5555',
    },

    bottomContainer: {
        width: hScale(328),
        height: vScale(72),
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

}); 