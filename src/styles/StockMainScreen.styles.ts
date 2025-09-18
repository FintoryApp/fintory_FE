import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Colors from './Color.styles';
import { hScale, vScale } from './Scale.styles';

export const styles = StyleSheet.create({
    wholeContainer:{
        backgroundColor: Colors.surface,
        width: '100%',
    },
    userInfoContainer:{
        width: hScale(328),
        backgroundColor: Colors.white,
        borderRadius: hScale(16),
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(16),
        marginBottom: vScale(16),
        alignSelf: 'center',
    },

    topContainerText:{
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        
    },

    percentageText:{
        fontSize: hScale(36),
        fontWeight: 'bold',
        color: Colors.red,
        marginBottom: vScale(16),
        
    },

    seeMoreButton:{
        width: hScale(45),
        height: vScale(16),
        alignSelf: 'center',
        flexDirection: 'row',

    },

    seeMoreButtonImage:{
        marginTop: vScale(7),
    },

    seeMoreButtonText:{
        fontSize: hScale(12),
        color: Colors.outlineVariant,
        marginLeft: hScale(8),
    },

    totalPriceContainer:{
        width: hScale(296),
        height: vScale(48),
        borderRadius: hScale(8),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(8),
        borderWidth: 1,
        borderColor: Colors.outlineVariant,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: vScale(8),
    },

    totalPriceTextContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    totalPriceText:{
        fontSize: hScale(12),
        color: Colors.black,
        fontWeight: 'bold',
    },

    totalPriceValue:{
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
    },

    textContainer:{
        width: hScale(295),
        height: vScale(48),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vScale(8),
    },
    smallBox:{
        width: hScale(143.5),
        height: vScale(48),
        borderRadius: hScale(8),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(8),
        borderWidth: 1,
        borderColor: Colors.outlineVariant,
    },
    smallBoxText:{
        fontSize: hScale(12),
        color: Colors.black,
        fontWeight: 'bold',
    },

    stockInfoContainer:{
        width: hScale(328),
        backgroundColor: Colors.white,
        borderRadius: hScale(16),
        alignSelf: 'center',
        paddingVertical: vScale(16),
        paddingHorizontal: hScale(16),
        marginBottom: vScale(16),
    
    },
    stockImage:{
        height: hScale(36),
        width: hScale(36),
        borderRadius:hScale(18),
        marginLeft:hScale(16),
        marginTop:vScale(12),
    },

    stockInfoText:{
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        top: vScale(16),
        left: hScale(16),
        position: 'absolute',
    },

    stockInfoBlockContainer:{
        width: hScale(296),
        alignSelf: 'center',
        marginTop: vScale(54),
    },
    bottomContainer:{
        width: hScale(360),
        height: 'auto',
        backgroundColor: Colors.white,
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(8),
        alignItems: 'center',
    },
    detailContainer:{
        width: hScale(328),
        height: vScale(86),
        alignSelf: 'center',
        marginBottom: vScale(16),
    },
    whereContainer:{
        width: hScale(100),
        height: vScale(38),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vScale(16),
    },

    domesticButton:{
        width: hScale(46),
        height: vScale(38),
        borderRadius: hScale(4),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(8),
    },
    domesticButtonText:{
        fontSize: hScale(16),
        fontWeight: 'bold',
    },
    categoryContainer:{
        width: hScale(328),
        height:vScale(32),
        flexDirection:'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.outlineVariant,
        marginBottom: vScale(16),

    },
    amountButton:{
        width:hScale(50),
        height:vScale(32),
        paddingHorizontal:hScale(8),
        paddingVertical:vScale(8),
    },
    buttonText:{
        fontSize:hScale(12),
        fontWeight:'bold',
        color: Colors.outlineVariant,
    },
    selectedButton: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.primaryDark,
    },
    selectedButtonText: {
        color: Colors.primaryDark,
    },
    searchContainer:{
        width: hScale(328),
        height: vScale(40),
        borderRadius: hScale(8),
        paddingHorizontal: hScale(16),
        borderWidth: 1,
        borderColor: Colors.outlineVariant,
        marginBottom: vScale(16),

    },
    stockListContainer:{
        width: hScale(328),
        //minHeight: vScale(1200),
        alignSelf: 'center',
        marginBottom: vScale(16),
    }

});
