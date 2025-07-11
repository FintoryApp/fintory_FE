import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { hScale, vScale } from './Scale.styles';
import { Colors } from './Color.styles';

export const styles = StyleSheet.create({
    wholeContainer: {
        flex: 1,
        backgroundColor: Colors.surface,
        height: '100%',
        width: '100%',
        
    },
    secondContainer:{
        height:vScale(833.79),
        width:hScale(360),
        marginTop:vScale(16),
        backgroundColor:'#FFFFFF',
        
    },

      investAreaContainer:{
        height:vScale(384),
        width:hScale(360),
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(8),
      },

      investAreaTitle:{
        fontSize:hScale(24),
        fontWeight:'bold',
        color:Colors.primaryDark
      },

      investAreaGraphContainer:{
        width:hScale(328),
        height:vScale(222),
        borderRadius:hScale(8),
        borderColor:Colors.outlineVariant,
        borderWidth:hScale(1),
        paddingVertical:vScale(8),
        paddingHorizontal:hScale(16),
      },

      graphTitle:{
        fontSize:hScale(16),
        fontWeight:'bold',
      },

      graphContainer:{
        marginTop:vScale(8),
        paddingVertical:vScale(8),
        width:hScale(296),
        height:vScale(176),
      },

      summaryContainer:{
        height:vScale(77),
        flexDirection:'row',
        marginTop:vScale(16),
        marginBottom:vScale(16),
      },

      investNum:{
        height:vScale(81),  
        width:hScale(156),
        borderRadius:hScale(8),
        borderColor:Colors.outlineVariant,
        borderWidth:hScale(1),
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(8),
      },

      summaryTitleText:{
        fontSize:hScale(12),
      },

      summaryText:{
        fontSize:hScale(24),
        fontWeight:'bold',
        marginTop:vScale(16),
      },

      returnRateContainer:{
        height:vScale(204.79),
        width:hScale(360),
        marginTop:vScale(16),
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(8),
      },

      plusMinusContainer:{
        flexDirection:'column',
        justifyContent: 'space-between',
        
      },

      plusMinusBox:{
        height:vScale(61.9),
        width:hScale(328),
        borderRadius:hScale(8),
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(12),
        borderColor:Colors.outlineVariant,
        borderWidth:hScale(1),
        flexDirection:'row',
        justifyContent:'space-between'},

      ratioConatiner:{
        height:vScale(33),
        width:hScale(234.92),
        flexDirection:'row',
        justifyContent:'space-between',
      },

      recommendContainer:{
        height:vScale(109),
        width:hScale(360),
        paddingHorizontal:hScale(16),
        paddingVertical:vScale(8),
        marginBottom:vScale(16),
        marginTop:vScale(16),
      },
      
      recommendText:{
        fontSize:hScale(16),
        fontWeight:'bold',
      },

      
      


});
