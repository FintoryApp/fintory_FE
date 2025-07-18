import { StyleSheet } from "react-native";
import { Colors } from "./Color.styles";
import { hScale, vScale } from "./Scale.styles";

const styles = StyleSheet.create({
    newsContainer: {
        width: hScale(328),
        flex: 1,
        alignSelf: 'center',
    },
    newsTitleContainer: {
        width: hScale(328),
        height: vScale(90),
    },
    newsTitleText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
        color: Colors.black,
    },
    newsInfoContainer: { 
        width: hScale(328),
        height: vScale(16),
        marginTop: vScale(8),
        flexDirection: 'row',
        alignItems: 'center',
    },
    newsInfoText: {
        fontSize: hScale(12),
        color: Colors.outline,
    },
    verticalLine: {
        width: 1,
        height: vScale(16),
        backgroundColor: Colors.outlineVariant,
        marginHorizontal: hScale(16),
    },
    newsContentContainer: {
        width: hScale(328),
        flex: 1,
        marginTop: vScale(16),
        backgroundColor: Colors.white,
        borderRadius: hScale(16),
    },
    aiSummaryContainer: {
        width: hScale(296),
        minHeight: vScale(24),
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiSummaryContentContainer: {
        width: hScale(296),
        flex: 1,
    },
    aiSummaryWithBar: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.outlineVariant,
        paddingLeft: hScale(8),
    },
    aiSummaryText: {
        fontSize: hScale(12),
        color: Colors.outline,
    },
    aiSummaryIcon: {
        width: hScale(24),
        height: vScale(24),
        tintColor: Colors.outline,
    },
    newsContentText: {
        fontSize: hScale(12),
        color: Colors.black,
        marginTop: vScale(16),
    },
});

export default styles;