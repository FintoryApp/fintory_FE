import { StyleSheet, Dimensions,PixelRatio } from 'react-native';

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
        height:vScale(617),
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
        height:vScale(521),
      },

      investStyleContainer:{
        backgroundColor:'#00C900',
        width:hScale(328),
        height:vScale(397),
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
        top:vScale(61),
        width:hScale(132),
        height:vScale(132),
      },

      mainText:{
        position:'absolute',
        left:hScale(16),
        top:vScale(205),
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
        top:vScale(261),
        fontSize:hScale(12),
        color:'#FFFFFF',
        textAlign:'center',
        width:hScale(296),
        height:vScale(80),
      },

      bottomContainer:{
        position:'absolute',
        width:hScale(296),
        height:vScale(28),
        top:vScale(353),
        left:hScale(16),
      },

      entireAnaylzeButton:{
        position:'absolute',
        width:hScale(124),
        height:vScale(28),
        left:hScale(172),
        backgroundColor:'rgba(255,255,255,0.7)',
        borderRadius:hScale(8),
      },

      entireAnaylzeText:{
        position:'absolute',
        left:hScale(8),
        top:vScale(6),
        width:hScale(92),
        height:vScale(16),
        fontSize:hScale(12),
      },

      rightArrowImage:{
        position:'absolute',
        left:hScale(100),
        top:vScale(2),
        width:hScale(24),
        height:vScale(24),
      },

      searchContainer:{
        position:'absolute',
        width:hScale(328),
        height:vScale(60),
        left:hScale(16),
        top:vScale(461),
        backgroundColor:'#FFFFFF',
        borderRadius:hScale(4),
        borderWidth:hScale(1),
        borderColor:'#C2C2C2',
      },

      searchDate:{
        position:'absolute',
        left:hScale(12),
        top:vScale(19),
        width:hScale(220),
        height:vScale(22),
        fontSize:hScale(16),
        color:'#006D00',
      },

      
      searchText:{
        position:'absolute',
        left:hScale(12),
        top:vScale(19),
        width:hScale(220),
        height:vScale(22),
        fontSize:hScale(16),
        color:'#000000',
      },

      calendarImage:{
        position:'absolute',
        left:hScale(272),
        top:vScale(8),
      }




}); 