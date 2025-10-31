import { StyleSheet } from 'react-native';
import Colors from './Color.styles';
import { hScale, vScale } from './Scale.styles';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primaryContainer,

    },

    header:{
      width: hScale(360),
      height: vScale(44),
      paddingLeft: hScale(16),
      paddingRight: hScale(4),
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },

    headerIcon:{
      width: hScale(80),
      height: vScale(20),
      tintColor: Colors.primaryDark,
    },

    headerRight:{
      width: hScale(80),
      height: vScale(44),
      alignItems: 'center',
      flexDirection: 'row',
    },

    iconImage:{
      tintColor: Colors.outline,
    },
    headerButton:{
      width: hScale(44),
      height: vScale(44),
      alignItems: 'center',
      justifyContent: 'center',
    },

    userInfoContainer:{
      width: hScale(168),
      height: vScale(52),
      top:vScale(60),
      left: hScale(16),
      position: 'absolute',
      flexDirection: 'row',
      gap: hScale(8),
      alignItems: 'center',
      zIndex: 300,
      
    },
    smallCircle:{
      width: hScale(138),
      height: vScale(138),
      borderRadius: hScale(69),
      backgroundColor: '#E3ECDE',
      position: 'absolute',
      left: hScale(18),
      top: vScale(25),
    },
    bigCircle:{
      width: hScale(280),
      height: vScale(280),
      borderRadius: hScale(140),
      backgroundColor: '#E3ECDE',
      position: 'absolute',
      left: hScale(90),
      top: vScale(70),
      overflow: 'hidden',
    },
    adviceTextContainer:{
      width: hScale(220),
      height: vScale(100),
      position: 'absolute',
      top: vScale(170),
      left: hScale(8),
      textAlign: 'left',
    },

    todayAdviceText:{
      fontSize: hScale(12),
      color: Colors.black,
    },
    adviceText:{
      fontSize: hScale(16),
      fontWeight: 'bold',
      color: Colors.black,
    },
    userInfoImage:{
      width: hScale(52),
      height: vScale(52),
      borderRadius: 999999,
      borderWidth: 4,
      borderColor: Colors.primaryDim,
      zIndex: 300,
      backgroundColor: Colors.white,
    },
    userInfoTextContainer:{
      flexDirection: 'column',
      //gap: hScale(8),
      zIndex: 300,
    },
    userInfoText:{
      fontSize: hScale(16),
      fontWeight: 'bold',
      color: Colors.black,
    },
    userPointText:{
      fontSize: hScale(12),
      fontWeight: 'bold',
      color: Colors.black,
    },
    userCharacterImage:{
      width: hScale(220),
      height: vScale(220),
      top:vScale(120),
      right:hScale(16),
    },
    content:{
      width: hScale(360),
      height: vScale(360),
      backgroundColor: Colors.surface,
      borderRadius: hScale(16),
      top:vScale(375),
      position: 'absolute',
      paddingHorizontal: hScale(16),
      paddingTop:vScale(30),
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 300,
      
    },
    investStartButton:{
      width: hScale(156),
      height: vScale(208),
      borderRadius: hScale(8),
      padding: hScale(16),
      // iOS 그림자 효과
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      // Android 그림자 효과
      elevation: 3,
    },
    investStartButtonText:{
      fontSize: hScale(16),
      fontWeight: 'bold',
      color: Colors.primaryDark,
    },
    smallButton:{
      width: hScale(156),
      height: vScale(96),
      backgroundColor: Colors.white,
      borderRadius: hScale(8),
      padding: hScale(16),
      borderWidth: 1,
      borderColor: Colors.outlineVariant,
      // iOS 그림자 효과
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      // Android 그림자 효과
      elevation: 3,
    },
    smallButtonText:{
      fontSize: hScale(16),
      fontWeight: 'bold',
      color: Colors.black,
    },
    smallButtonContainer:{
      width: hScale(156),
      flexDirection: 'column',
      gap: vScale(16),
      backgroundColor: Colors.white,
  
    },
    aiReportImage:{
      width: hScale(61),
      height: vScale(61),
      left: hScale(67),
    },
    startImage:{
      width: hScale(100),
      height: vScale(100),
      left: hScale(20),
      top: vScale(40),
    },
});