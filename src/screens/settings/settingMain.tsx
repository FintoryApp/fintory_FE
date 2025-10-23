import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import TopBar from '../../components/ui/TopBar';
import Colors from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { logout, getTokens } from '../../api/auth';
import { saveNotificationSetting, getNotificationSetting } from '../../utils/notificationSettings';
import { updateAlarmStatus } from '../../api/alarmStatus';

export default function SettingMain() {
    const {top} = useSafeAreaInsets();
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const navigation = useNavigation();

    // 컴포넌트 마운트 시 저장된 알림 설정 불러오기
    useEffect(() => {
        const loadNotificationSetting = async () => {
            const setting = await getNotificationSetting();
            setIsNotificationEnabled(setting);
        };
        loadNotificationSetting();
    }, []);

    // 알림 설정 변경 시 AsyncStorage에 저장 및 백엔드 동기화
    const handleNotificationToggle = async (value: boolean) => {
        setIsNotificationEnabled(value);
        await saveNotificationSetting(value);
        
        // 백엔드에 알림 설정 상태 동기화
        try {
            const { accessToken } = await getTokens();
            if (accessToken) {
                await updateAlarmStatus(value, accessToken);
                console.log('설정 화면에서 알림 설정 상태 백엔드 동기화 성공:', value);
            }
        } catch (error) {
            console.error('설정 화면에서 알림 설정 상태 동기화 실패:', error);
            // 동기화 실패는 로컬 설정을 막지 않음
        }
    };
    return (
        <View style={{flex:1,backgroundColor:Colors.surface,alignItems:'center'}}>
            <TopBar title="환경설정" />
            <View style={{...styles.notificationContainer,marginTop:top+vScale(16)}}>
                <Text style={styles.notificationText}>알림</Text>

                <Switch
                    value={isNotificationEnabled}
                    onValueChange={handleNotificationToggle}
                    thumbColor={Colors.white}
                    trackColor={{true: Colors.primary, false: Colors.middleGray}}
                    style={{
                        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                    }}
                />
            </View>
            <TouchableOpacity style={{...styles.logoutContainer,marginTop:top+vScale(500)}} 
            onPress={async ()=>{
                await logout();
                navigation.navigate('First' as never);
            }}
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
