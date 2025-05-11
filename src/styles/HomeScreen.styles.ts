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
  friendContainer:{
    height:vScale(116),
    top:vScale(32),
    flexDirection:'row',
  },


  avatarItem: {
    height:vScale(84),
    width: hScale(64),
    alignItems: 'center',
    justifyContent:'center',
  },
  addItem: {
    height:vScale(84),
    width: hScale(64),
    alignItems: 'center',
    justifyContent:'center',
    marginLeft:hScale(8),
  },
  friendAddButton:{
    width: hScale(52),
    height: vScale(52),
    top:vScale(10),
    left:hScale(10),
    position:'absolute',
  },

  plusButton:{
    width: hScale(16),
    height: vScale(16),
    position:'absolute',
    left:44,
    top:40,
  },
  addText: {
    fontSize: hScale(12),
    marginTop:vScale(54),
    marginLeft:hScale(10),
  },

  scrollContainer:{
    height:vScale(116),
    width:hScale(276),
    //left:hScale(2),
  },
  avatarScroll: {
    height: vScale(84),
    width:hScale(276),
    //marginLeft: hScale(84),
    //flexGrow: 0,
  },
  
  avatarImage: {
    width: hScale(52),
    height: vScale(52),
    borderRadius: hScale(64),
    borderWidth: 4,
    borderColor: '#FFDF29',
  },
  avatarName: {
    fontSize: hScale(12),
  },

  

  horizontalLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },

  middleContainer:{
    height:vScale(492),
    position:'relative',
  },

  topMiddleContainer:{
    height:vScale(176),
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vScale(44),
  },
  nameBadgeContainer:{
    width:hScale(139),
    height:vScale(33),
    marginLeft:hScale(16),
  },

  userName: {
    position: 'absolute',
    fontSize: hScale(24),
    fontWeight: 'bold',
  },

  badgeNameContainer:{
    width: hScale(64),
    height: vScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    position:'relative',
    left: hScale(75),
    top:vScale(4.5),
  },

  badgeIcon: {
    position: 'absolute',
    width: hScale(64),
    height: vScale(24),
  },

  badgeText:{
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    fontSize:hScale(12),
    color:'#ffffff',
  },

  icon24: {
    width: hScale(44),
    height: vScale(44),
    marginLeft: hScale(150),
  },
  characterContainer: {
    position: 'relative',
    width: hScale(360),
    height: vScale(132),
    //top: vScale(44),
  },
  speechContainer:{
    position: 'absolute',
    top:vScale(71),
    //left:hScale(16),
    width: hScale(187),
    height: vScale(61),
    marginLeft: hScale(16),
  },
  speechBubbleImage: {
    width: hScale(186),
    height: vScale(50),
    position: 'absolute',
  },
  speechText: {
    position: 'absolute',
    top: vScale(21),
    left: hScale(15),
    fontSize: hScale(12),
    color: '#222',
    width: hScale(153),
    textAlign: 'center',
  },
  characterImage: {
    width: hScale(132),
    height: vScale(132),
    left: hScale(212),
    resizeMode: 'contain',
  },

  boxContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    height:vScale(308),
    marginTop:vScale(12),
    position:'relative',
  },
  colorContainer:{
    position: 'relative',
    height:vScale(182),
    top:0,
    left:0,
    right:0,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:hScale(16),
},
  greenBox: {
    width: hScale(156),
    height: vScale(182),
    backgroundColor: '#00C900',
    borderRadius: hScale(12),
    
  },
  blueBox: {
    width: hScale(156),
    height: vScale(182),
    backgroundColor: '#2894FF',
    borderRadius: hScale(12),
  },

  whiteContainer:{
    position:'relative',
    //top:vScale(198),
    marginTop:vScale(16),
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:hScale(16),
  },

  leftBox: {
    marginRight: hScale(5),
  },
  
  
  whiteBox: {
    width: hScale(156),
    height: vScale(110),
    backgroundColor: '#FFFFFF',
    borderRadius: hScale(12),
    position:'relative',
  },
  
  boxIcon: {
    position: 'absolute',
    bottom: vScale(16),
    right: hScale(16),
    width: hScale(48),
    height: vScale(48),
    resizeMode: 'contain',
  },
  whiteBoxIcon: {
    position: 'absolute',
    bottom: vScale(16),
    right: hScale(16),
    width: hScale(48),
    height: vScale(48),
    resizeMode: 'contain',
  },
  boxText: {
    position: 'absolute',
    top: vScale(20),
    left: hScale(16),
    color: '#fff',
    fontSize: hScale(16),
    fontWeight: 'bold',
  },
  whiteBoxText: {
    position: 'absolute',
    top: vScale(20),
    left: hScale(16),
    color: '#222',
    fontSize: hScale(16),
    fontWeight: 'bold',
  },
}); 