import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { hScale, vScale } from './Scale.styles';
import { Colors } from './Color.styles';

export const styles = StyleSheet.create({
    
    middleContainer: {
        width: hScale(360),
        height: vScale(274),
    },

    idConatiner: {
        width: hScale(332),
        height: vScale(70),
        alignSelf:'center',
        flexDirection:'column',
    },

    idTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        height: vScale(22),

    },

    idInput: {
        marginTop:vScale(8),
        width: hScale(328),
        height: vScale(40),
        borderWidth: 1,
        borderColor: Colors.outline,
        borderRadius: hScale(4),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(12),
        fontSize: hScale(12),
        textAlignVertical: 'center',
        includeFontPadding: false,
    
    },

    phoneNumContainer: {
        width: hScale(328),
        height: vScale(72),
        marginTop:vScale(20),
        alignSelf:'center',
        
    },
    phoneNumTitleContainer: {
        width: hScale(328),
        height: vScale(24),
        flexDirection:'row',
    },
    getCodeButton: {
        marginLeft:hScale(8),
        width: hScale(90),
        height: vScale(24),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(4),
        backgroundColor:Colors.outline,
        borderRadius: hScale(8),
        justifyContent: 'center',
        alignItems: 'center',
        
    },

    getCodeButtonText: {
        fontSize: hScale(12),
        color:Colors.white,
        textAlign:'center',
    },

    

    phoneNumInputContainer: {
        width: hScale(328),
        flexDirection:'row',
        justifyContent:'space-between',

    },

    
    codeContainer: {
        width: hScale(328),
        height: vScale(92),
        marginTop:vScale(20),
        alignSelf:'center',
    },
    codeInputContainer: {
        width: hScale(328),
        height: vScale(72),
    },

    codeInputTitleContainer: {
        width: hScale(153),
        height: vScale(24),
        flexDirection:'row',
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
        position :'absolute',
        backgroundColor:Colors.primary,
        borderRadius:hScale(8),
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
    },

    

    logInButtonText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
        color:Colors.white,
        textAlign:'center',
    },

}); 