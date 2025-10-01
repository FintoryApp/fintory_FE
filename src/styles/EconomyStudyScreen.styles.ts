import { StyleSheet } from 'react-native';
import { Colors } from './Color.styles';
import { hScale, vScale } from './Scale.styles';

export const styles = StyleSheet.create({
    
    newsContainer: {
        paddingVertical: vScale(16),
        width: hScale(328),
        height: vScale(408),
        backgroundColor: Colors.white,
        alignSelf:'center',
        borderRadius: hScale(16),
    },
    newsTitleContainer: {
        width: hScale(328),
        height: vScale(32),
        alignSelf:'center',
        paddingHorizontal: hScale(16),
        flexDirection:'row',
        alignItems:'center',
        marginBottom:vScale(16),
    },
    newsTitleIcon: {
        width: hScale(28.66),
        height: vScale(22),
    },
    newsTitleText: {
        fontSize: hScale(16),
        fontWeight:'bold',
        marginLeft:hScale(8),
        
    },
    dateTitleText: {
        fontSize: hScale(12),
        color: Colors.primaryDark,
        marginLeft: 'auto',
    },

    wordContainer: {
        paddingVertical: vScale(16),
        width: hScale(328),
        height: vScale(161),
        backgroundColor: Colors.white,
        alignSelf:'center',
        borderRadius: hScale(16),
        marginTop:vScale(16),
    },
    wordTitleContainer: {
        width: hScale(328),
        height: vScale(32),
        alignSelf:'center',
        paddingHorizontal: hScale(16),
        flexDirection:'row',
        alignItems:'center',
        marginBottom:vScale(16),
    },
    wordTitleIcon: {
        width: hScale(28.66),
        //height: vScale(22),
    },
    wordTitleText: {
        fontSize: hScale(16),
        fontWeight:'bold',
        marginLeft:hScale(4),
    },
    seeAllButtonContainer: {
        width: hScale(55.74),
        height: vScale(16),
        marginLeft:'auto',
        alignItems:'center',
        flexDirection:'row',
    },
    seeAllButtonText: {
        fontSize: hScale(12),
        color: Colors.primaryDark,
        textAlignVertical:'center',
    },
    narrowImage:{
        marginLeft:hScale(4),
        width: hScale(6.74),
        height: vScale(11.55),
        tintColor: Colors.primaryDark,
    },
    wordItemContainer: {
        width: hScale(296),
        height: vScale(81),
        backgroundColor: Colors.primaryContainer,
        alignSelf:'center',
        borderRadius: hScale(8),
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(16),
    },
    textContainer: {
        //width: hScale(191),
        height: vScale(49),
    },
    wordText: {
        fontSize: hScale(24),
        fontWeight:'bold',
        color: Colors.primaryDark,
    },
    explainText: { 
        fontSize: hScale(12)},
});