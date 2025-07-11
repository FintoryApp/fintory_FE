import { StyleSheet, Dimensions,PixelRatio } from 'react-native';
import { Colors } from './Color.styles';
import { hScale, vScale } from './Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const styles = StyleSheet.create({
    
    wholeContainer: {
        flex: 1,
        backgroundColor: Colors.surface,
        width:'100%',
        height:'100%',
        marginTop:vScale(60),
      },

      

      styleExplainContainer:{
        height:vScale(174),
        width:hScale(328),
        backgroundColor:'#FFFFFF',
        borderRadius:hScale(12),
        alignSelf:'center',
        marginTop:vScale(16),
        alignItems:'center',
      },

      styleExplainButton:{
        height:vScale(36),
        width:hScale(119),
        backgroundColor:Colors.outlineVariant,
        borderRadius:hScale(8),
        alignSelf:'center',
        top:vScale(122),
        position:'absolute',
        alignItems:'center',
      },

      monthSearchContainer:{
        height:vScale(60),
        width:hScale(328),
        backgroundColor:'#FFFFFF',
        borderRadius:hScale(8),
        marginTop:vScale(16),
        alignSelf:'center',
      },

      monthSearchTextContainer:{
        height:vScale(22),
        width:hScale(220),
        left:hScale(12),
        top:vScale(19),
        flexDirection:'row',
        alignItems:'center',
      }


      
}); 