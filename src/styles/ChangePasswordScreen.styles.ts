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

    idContainer: {
        width: hScale(328),
        height: vScale(63),
        alignSelf:'center',
    },

    idTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',

    },

    idInput: {
        marginTop: vScale(8),
        width: hScale(328),
        height: vScale(40),
        borderWidth: 1,
        borderColor: Colors.middleGray,
        borderRadius: hScale(6),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(12),
        fontSize: hScale(12),
        textAlignVertical: 'center',
        includeFontPadding: false,
    },

    errorContainer: {
        width: hScale(328),
        height: vScale(16),
        marginTop: vScale(8),
        
    },

    errorText: {
        fontSize: hScale(12),
        color:Colors.red,
        
    },

    bottomContainer: {
        width: hScale(328),
        height: vScale(72),
        position:'absolute',
        top:vScale(467),
        left:hScale(16),
        backgroundColor:Colors.primary,
        borderRadius: hScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },



    

    logInButtonText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
        color:Colors.white,
        textAlign:'center',
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