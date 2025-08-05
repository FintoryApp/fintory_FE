import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { hScale, vScale } from './Scale.styles';
import { Colors } from './Color.styles';

export const styles = StyleSheet.create({
    
    middleContainer: {
        width: hScale(360),
        height: vScale(274),
        alignContent:'center',
        alignItems:'center',
    },


    bottomContainer: {
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