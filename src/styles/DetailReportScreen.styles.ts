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
    wholeContainer: {
        flex: 1,
        backgroundColor: '#F2F7F0',
        height: vScale(1274),
    },

    topContainer: {
        height:vScale(92),
      },

      leftButton:{
        left:hScale(16),
        top:vScale(40),
      },

      topTitle:{
        position:'absolute',
        left:hScale(141),
        top:vScale(51),
        fontSize:hScale(16),
        fontWeight:'bold',
      },

      settingButton:{
        position:'absolute',
        left:hScale(300),
        top:vScale(40),
      },

      middleContainer:{
        height:vScale(1182),
      },

      investStyleContainer:{
        backgroundColor:'#00C900',
        width:hScale(328),
        height:vScale(297),
        padding:hScale(16),
        borderRadius:hScale(12),
        marginLeft:hScale(16),
      },

      titleText:{
        width:hScale(296),
        height:vScale(33),
        position:'absolute',
        fontSize:hScale(24),
        fontWeight:'bold',
        color:'#FFFFFF',
        top:vScale(16),
        left:hScale(16),
      },

      characterImage:{
        position:'absolute',
        left:hScale(98),
        top:vScale(57),
        width:hScale(132),
        height:vScale(132),
      },

      mainText:{
        position:'absolute',
        left:hScale(16),
        top:vScale(197),
        fontSize:hScale(16),
        color:'#FFFFFF',
        textAlign:'center',
        width:hScale(296),
        height:vScale(44),
      },

      boldText: {
        fontWeight: 'bold',
      },

      explainText:{
        position:'absolute',
        left:hScale(16),
        top:vScale(249),
        fontSize:hScale(12),
        color:'#FFFFFF',
        textAlign:'center',
        width:hScale(296),
        height:vScale(80),
      },

      secondContainer:{
        height:vScale(873),
        width:hScale(360),
        top:vScale(313),
        position:'absolute',
        backgroundColor:'#FFFFFF',
      },

      investAreaContainer:{
        height:vScale(396),

      },

      investAreaTitle:{
        fontSize:hScale(24),
        fontWeight:'bold',
        color:'#006D00',
        top:vScale(24),
        left:hScale(16),
        position:'absolute',
      },

      investAreaGraphContainer:{
        position:'absolute',
        left:hScale(16),
        top:vScale(81),
        width:hScale(328),
        height:vScale(190),
      },

      graphTitle:{
        fontSize:hScale(16),
        position:'absolute',
      },

      graphContainer:{
        position:'absolute',
        top:vScale(34),
        width:hScale(328),
        height:vScale(156),
      },

      summaryContainer:{
        height:vScale(77),
        width:hScale(328),
        top:vScale(295),
        position:'absolute',
        flexDirection:'row',
        
      },

      investNum:{
        height:vScale(77),  
        width:hScale(156),
        backgroundColor:'#DBE2D8',
        borderRadius:hScale(12),
        marginLeft:hScale(16),
      },

      summaryTitleText:{
        fontSize:hScale(12),
        top:vScale(8),
        left:hScale(12),
        position:'absolute',
      },

      summaryText:{
        fontSize:hScale(24),
        fontWeight:'bold',
        top:vScale(36),
        left:hScale(12),
        position:'absolute',
      },

      returnRateContainer:{
        height:vScale(204),
        width:hScale(360),
        top:vScale(408),
        position:'absolute',
      },

      returnTitleText:{
        fontSize:hScale(24),
        fontWeight:'bold',
        top:vScale(24),
        left:hScale(16),
        position:'absolute',
      },

      plusMinusContainer:{
        height:vScale(99),
        width:hScale(328),
        top:vScale(81),
        left:hScale(16),
        position:'absolute',
        flexDirection:'row',
        justifyContent: 'space-between',
      },

      plusMinusBox:{
        height:vScale(99),
        width:hScale(156),
        borderRadius:hScale(12),
      },

      plusColor:{
        backgroundColor:'#EFCDCC',
      },

      minusColor:{
        backgroundColor:'#D7DEE6',
      },

      plusMinusTitleText:{
        fontSize:hScale(12),
        top:vScale(8),
        left:hScale(12),
        position:'absolute',
      },
    
      ratioConatiner:{
        height:vScale(55),
        width:hScale(132),
        top:vScale(36),
        left:hScale(12),
        position:'absolute',
      },

      ratioText:{
        fontSize:hScale(16),
        fontWeight:'bold',
        position:'absolute',
      },

      ratioNameText:{
        fontSize:hScale(24),
        fontWeight:'bold',
        top:vScale(22),
        position:'absolute',
      },
      
      plusTextColor:{
        color:'#F94843',
      },

      minusTextColor:{
        color:'#2894FF',
      },

      recommendContainer:{
        height:vScale(149),
        top:vScale(624),
        position:'absolute',
      },
      
      recommendText:{
        fontSize:hScale(16),
        top:vScale(81),
        left:hScale(16),
        position:'absolute',
      },

      
      


});
