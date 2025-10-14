import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TopBar from '../../components/ui/TopBar';
import Profile from '../../components/Profile';
import AttendCalendar from '../../components/ui/AttendCalendar';
import { VirtualMoneyCard, PointCard, InvestmentSummaryCard, ChallengeCard } from '../../components/MyPageCards';
import Colors from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import { ProfileStackParamList } from '../../navigation/RootStackParamList';
import { useUserData } from '../../hooks/useUserData';
import { MY_PAGE_CONSTANTS } from '../../constants/MyPageConstants';
import {getTotalPoint} from '../../api/totalPoint';

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
    const [pointRefresh,setPointRefresh] = useState<number>(0);
    
    // 데이터 새로고침 시 달력도 함께 새로고침
    const handleRefresh = async () => {
        await refreshUserData();
        setCalendarRefreshTrigger(prev => prev + 1);
    };
    useEffect(() => {
        const fetchTotalPoint = async () => {
            const res = await getTotalPoint();
            setPointRefresh(res.data);
        };
        fetchTotalPoint();
    }, []);

    // 화면 포커스 시 포인트 새로고침
    useFocusEffect(
        useCallback(() => {
            const refreshPoint = async () => {
                console.log('📱 [MY_PAGE] MyPageScreen 포커스 - 포인트 새로고침');
                const res = await getTotalPoint();
                setPointRefresh(res.data);
                console.log('📱 [MY_PAGE] 포인트 새로고침 완료:', res.data);
            };
            refreshPoint();
        }, [])
    );

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
                        totalPoint={pointRefresh ?? 0} 
                        onPress={() => pointNavigation.navigate('Point')}
                        isLoading={isLoading}
                        hasError={hasError}
                    />
                   
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
