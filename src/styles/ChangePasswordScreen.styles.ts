import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { hScale, vScale } from './Scale.styles';
import { Colors } from './Color.styles';

export const styles = StyleSheet.create({
    
    middleContainer: {
        width: hScale(360),
        height: vScale(274),
        alignSelf:'center',
        flexDirection:'column',
    },

    idConatiner: {
        width: hScale(328),
        height: vScale(63),
        position:'absolute',
        top:vScale(112),
        left:hScale(16),
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
        width: hScale(328),
        height: vScale(90),
        position:'absolute',
        top:vScale(195),
        left:hScale(16),
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
        width: hScale(328),
        height: vScale(72),
        position:'absolute',
        top:vScale(467),
        left:hScale(16),
    },



    logInButton: {
        width: hScale(328),
        height: vScale(72),
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