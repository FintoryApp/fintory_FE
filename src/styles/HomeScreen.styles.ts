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
    },

    userInfoImage:{
      width: hScale(52),
      height: vScale(52),
      borderRadius: 999999,
      borderWidth: 2,
      borderColor: Colors.outline,
    },
    userInfoTextContainer:{
      flexDirection: 'column',
      //gap: hScale(8),
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
      top:vScale(150),
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
      paddingTop:vScale(40),
      flexDirection: 'row',
      justifyContent: 'space-between',
      
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
      top: vScale(50),
    },
});