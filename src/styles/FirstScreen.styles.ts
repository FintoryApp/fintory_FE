import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { hScale, vScale } from './Scale.styles';
import { Colors } from './Color.styles';



export const styles = StyleSheet.create({
    wholeContainer:{
        width: '100%',
        height: '100%',
        backgroundColor: Colors.primary,
    },
    logoContainer:{
        top:vScale(195),
        left:hScale(99),
    },
    logo:{
        width:hScale(161.41),
        height:vScale(133),
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
        alignSelf:'center',
        width:hScale(328),
        height:vScale(211),
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        position:'absolute',
        
    },
    startButton:{
        width:hScale(328),
        height:hScale(72),
        backgroundColor:Colors.white,
        borderRadius:hScale(8),
        paddingHorizontal:hScale(20),
        justifyContent:'center',
    },

    startButtonText:{
        fontSize:hScale(24),
        color:Colors.primary,
        fontWeight:'bold',
        textAlign:'center',
    },

    loginButton:{
        marginTop:vScale(16),
        width:hScale(328),
        height:hScale(72),
        backgroundColor:Colors.primaryDark,
        borderRadius:hScale(8),
        paddingHorizontal:hScale(20),
        justifyContent:'center',
    },

    loginButtonText:{
        fontSize:hScale(24),
        color:Colors.white,
        textAlign:'center',
        fontWeight:'bold',
    },

    snsLoginContainer:{
        marginTop:vScale(16),
        width:hScale(328),
        height:hScale(35),
        flexDirection:'row',
    },  
    kakaoLoginButton:{
        width:hScale(156),
        height:vScale(35),
        backgroundColor:'#FEE500',
        borderRadius:hScale(6),
        justifyContent:'center',
        alignItems:'center',
    },

    kakaoLoginButtonContainer:{
        width:hScale(94),
        height:vScale(16),
        flexDirection:'row',
        alignItems:'center',
    },

    kakaoImageContainer:{
        width:hScale(16),
        height:vScale(16),
        marginRight:hScale(8),
    },


    kakaoLoginButtonText:{
        fontSize:hScale(12),
        color:Colors.black,
        textAlign:'center',
        
    },
    googleLoginButton:{
        width:hScale(156),
        height:vScale(35),
        marginLeft:'auto',
        backgroundColor:Colors.white,
        borderRadius:hScale(6),
        borderWidth:1,
        borderColor:Colors.black,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },


    googleImageContainer:{
        width:hScale(17.83),
        height:vScale(17.5),
        marginRight:hScale(10),
    },


    googleLoginButtonText:{
        width:hScale(106.53),
        height:vScale(11.74),
    },

    buttonGap:{
        height:vScale(16),
    },


    
});
