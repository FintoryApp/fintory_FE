import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../../components/ui/TopBar';
import Profile from '../../components/Profile';
import AttendCalendar from '../../components/ui/AttendCalendar';
import { VirtualMoneyCard, PointCard, InvestmentSummaryCard, ChallengeCard } from '../../components/MyPageCards';
import Colors from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import { ProfileStackParamList } from '../../navigation/RootStackParamList';
import { useUserData } from '../../hooks/useUserData';
import { MY_PAGE_CONSTANTS } from '../../constants/MyPageConstants';

type VirtualAccountNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'VirtualAccount'>;
type PointNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Point'>;

export default function MyPageScreen() {
    const navigation = useNavigation<VirtualAccountNavigationProp>();
    const pointNavigation = useNavigation<PointNavigationProp>();
    
    // 커스텀 훅을 사용하여 사용자 데이터 관리
    const {
        nickname,
        email,
        totalPoint,
        streakDays,
        isLoading,
        hasError,
        refreshUserData
    } = useUserData();
    
    const [calendarRefreshTrigger, setCalendarRefreshTrigger] = useState<number>(0);
    
    // 데이터 새로고침 시 달력도 함께 새로고침
    const handleRefresh = async () => {
        await refreshUserData();
        setCalendarRefreshTrigger(prev => prev + 1);
    };
    return (
        <View style={styles.container}>
            <TopBar title='마이페이지' />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Profile 
                    name={nickname || (isLoading ? MY_PAGE_CONSTANTS.UI_TEXT.LOADING : MY_PAGE_CONSTANTS.UI_TEXT.USER_DEFAULT)} 
                    image={require('../../../assets/icons/profile.png')} 
                    id={email || (isLoading ? MY_PAGE_CONSTANTS.UI_TEXT.LOADING : '')} 
                />
                
                <View style={styles.contentContainer}>
                    <VirtualMoneyCard onPress={() => navigation.navigate('VirtualAccount')} />
                    <PointCard 
                        totalPoint={totalPoint} 
                        onPress={() => pointNavigation.navigate('Point')}
                        isLoading={isLoading}
                        hasError={hasError}
                    />
                    <InvestmentSummaryCard />
                    <ChallengeCard />
                    <AttendCalendar refreshTrigger={calendarRefreshTrigger} streak={streakDays} />
                </View>
            </ScrollView>
        </View>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.surface,
        alignItems: 'center',
    },
    scrollContent: {
        alignItems: 'center',
    },
    contentContainer: {
        width: hScale(328),
        height: vScale(755),
    },
});
