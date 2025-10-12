import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import TopBar from '../../components/ui/TopBar';
import Colors from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { removeTokens } from '../../api/auth';

export default function SettingMain() {
    const {top} = useSafeAreaInsets();
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const navigation = useNavigation();
    return (
        <View style={{flex:1,backgroundColor:Colors.surface,alignItems:'center'}}>
            <TopBar title="환경설정" />
            <View style={{...styles.notificationContainer,marginTop:top+vScale(16)}}>
                <Text style={styles.notificationText}>알림</Text>

                <Switch
                    value={isNotificationEnabled}
                    onValueChange={()=>{setIsNotificationEnabled(!isNotificationEnabled)}}
                    thumbColor={Colors.white}
                    trackColor={{true: Colors.primary, false: Colors.middleGray}}
                    style={{
                        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                    }}
                />
            </View>
            <TouchableOpacity style={{...styles.logoutContainer,marginTop:top+vScale(500)}} 
            onPress={()=>{removeTokens();navigation.navigate('First' as never)}}
            >
                <Text style={styles.logoutText}>로그아웃 하기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    notificationContainer: {
        width: hScale(328),
        height: vScale(28),
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 'auto',
        alignItems: 'center',
        marginHorizontal: hScale(16),
    },
    notificationText: {
        fontSize: hScale(16),
        color: Colors.black,
    },
    logoutContainer: {
        height: vScale(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: hScale(12),
        color: Colors.outline,
        textDecorationLine: 'underline',
    },
});
