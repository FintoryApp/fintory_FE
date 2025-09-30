import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { hScale, vScale } from './Scale.styles';
import { Colors } from './Color.styles';


export const styles = StyleSheet.create({
    

    middleContainer: {
        width: hScale(332),
        height: vScale(180),
        alignSelf:'center',
        flexDirection:'column',
    },

    idConatiner: {
        width: hScale(332),
        height: vScale(70),
        
    },

    idTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        marginBottom:vScale(8),

    },

    idInput: {
        width: hScale(332),
        height: vScale(40),
        borderWidth: 1,
        borderColor: Colors.middleGray,
        borderRadius: hScale(4),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(12),
        fontSize: hScale(12),
        textAlignVertical: 'center',
        includeFontPadding: false,
    },

    passwordContainer: {
        width: hScale(332),
        height: vScale(90),
        marginTop:vScale(20),
    },

    passwordTitle: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        marginBottom:vScale(8),
    },

    

    bottomContainer: {
        width: hScale(360),
        height: vScale(114),
        position:'absolute',
        alignItems: 'center',
    },

    logInContainer: {
        width: hScale(328),
        height: vScale(72),
        alignSelf:'center',
        backgroundColor:Colors.primary,
        paddingHorizontal:hScale(20),
        borderRadius:hScale(8),
        justifyContent:'center',
        alignItems:'center',
    },

   

    logInButtonText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
        color:Colors.white,
        textAlignVertical:'center',
    },

    findContainer: {
        width: hScale(360),
        height: vScale(22),
        marginTop:vScale(20),
        flexDirection:'row',
        justifyContent: 'center',
    },

    findButton: {
        height: vScale(22),
        justifyContent:'center',
        alignItems:'center',
    },

    findButtonText: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color:Colors.outline,
        textAlign:'center',
    },

    underline: {
        height: 1,
        backgroundColor: Colors.outline,
        marginTop: vScale(3),
    },

}); 