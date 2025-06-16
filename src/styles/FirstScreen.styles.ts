import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

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
        backgroundColor:'#00C900',
        flex:1,
    },
    logoContainer:{
        top:vScale(195),
        left:hScale(99),
    },
    logo:{
        width:hScale(161.41),
        height:hScale(133),
    },
    nameContainer:{
        position:'absolute',
        top:vScale(343),
        left:hScale(102),
    },
    name:{
        width:hScale(156),
        height:hScale(43.54),
    },

    textContainer:{
        position:'absolute',
        top:vScale(396),
        left:hScale(96),
    },
    text:{
        fontSize:hScale(12),
        color:'#F8F8F8',
    },

    loginContainer:{
        position:'absolute',
        top:vScale(472),
        left:hScale(16),
        width:hScale(328),
        height:hScale(211),
    },
    startButton:{
        width:hScale(328),
        height:hScale(72),
        backgroundColor:'#F8F8F8',
        borderRadius:hScale(12),
        padding:hScale(20),
    },

    startButtonText:{
        fontSize:hScale(24),
        color:'#00C900',
        textAlign:'center',
        fontWeight:'bold',
    },

    loginButton:{
        width:hScale(328),
        height:hScale(72),
        position:'absolute',
        top:vScale(88),
        backgroundColor:'#006D00',
        borderRadius:hScale(12),
        padding:hScale(20),
    },

    loginButtonText:{
        fontSize:hScale(24),
        color:'#FFFFFF',
        textAlign:'center',
        fontWeight:'bold',
    },

    snsLoginContainer:{
        position:'absolute',
        top:vScale(176),
        width:hScale(328),
        height:hScale(35),
        flexDirection:'row',
    },  
    kakaoLoginButton:{
        width:hScale(156),
        height:vScale(35),
        backgroundColor:'#FEE500',
        borderRadius:hScale(6),
    },

    kakaoLoginButtonContainer:{
        width:hScale(94),
        height:vScale(16),
        left:hScale(31),
        top:vScale(10),
        position:'absolute',
    },

    kakaoImageContainer:{
        width:hScale(16),
        height:vScale(16),
        position:'absolute',
    },

    kakaoLoginButtonImage:{
        width:hScale(15.3),
        height:vScale(14),
        position:'absolute',
        top:vScale(1),
        left:hScale(0.8),
    },

    kakaoLoginButtonText:{
        fontSize:hScale(12),
        color:'#000000',
        left:hScale(24),
        width:hScale(70),
        height:vScale(16),
        position:'absolute',
        textAlign:'center',
    },
    googleLoginButton:{
        width:hScale(156),
        height:vScale(35),
        left:hScale(172),
        position:'absolute',
        backgroundColor:'#FFFFFF',
        borderRadius:hScale(6),
    },


    googleImageContainer:{
        width:hScale(17.83),
        height:vScale(17.5),
        left:hScale(10.7),
        top:vScale(8.75),
        position:'absolute',
    },

    googleLoginButtonImage:{
        width:hScale(17.47),
        height:vScale(17.5),
        position:'absolute',
    },

    googleLoginButtonText:{
        left:hScale(37.9),
        top:vScale(12.69),
        width:hScale(106.53),
        height:vScale(11.74),
        position:'absolute',
    },

    


    
});
