import { StyleSheet } from 'react-native';
import Colors from './Color.styles';
import { hScale, vScale } from './Scale.styles';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
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
  
});