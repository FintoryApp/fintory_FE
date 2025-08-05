import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { hScale, vScale } from './Scale.styles.ts';


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

}); 