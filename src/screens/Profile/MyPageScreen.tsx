import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../../components/ui/TopBar';
import Profile from '../../components/Profile';
import AttendCalendar from '../../components/ui/AttendCalendar';
import Colors from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import { ProfileStackParamList } from '../../navigation/RootStackParamList';
import { getCurrentUser } from '../../api/auth';
import { getTotalPoint } from '../../api/totalPoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VirtualAccountNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'VirtualAccount'>;
type PointNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Point'>;

export default function MyPageScreen() {
    const navigation = useNavigation<VirtualAccountNavigationProp>();
    const pointNavigation = useNavigation<PointNavigationProp>();
    
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [totalPoint, setTotalPoint] = useState<number>(0);
    const [calendarRefreshTrigger, setCalendarRefreshTrigger] = useState<number>(0);
    const [streakDays, setStreakDays] = useState<number>(0);
    
    // 사용자 정보 및 포인트 데이터 로드
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const [userResult, pointResult] = await Promise.all([
                    getCurrentUser(),
                    getTotalPoint()
                ]);
                
                if (userResult.data) {
                    setNickname(userResult.data.nickname);
                    setEmail(userResult.data.username);
                }
                
                if (pointResult.data !== undefined) {
                    setTotalPoint(pointResult.data);
                    // AsyncStorage에도 저장
                    try {
                        await AsyncStorage.setItem('totalPoint', pointResult.data.toString());
                    } catch (error) {
                        console.error('포인트 저장 실패:', error);
                    }
                } else {
                    // 포인트 데이터가 없는 경우 (신규 가입자 등) 기본값 설정
                    console.log('포인트 데이터가 없습니다. 기본값 0으로 설정합니다.');
                    setTotalPoint(0);
                    try {
                        await AsyncStorage.setItem('totalPoint', '0');
                    } catch (error) {
                        console.error('포인트 저장 실패:', error);
                    }
                }
                
                // 연속 출석일수 가져오기 (AsyncStorage에서)
                try {
                    const savedStreakDays = await AsyncStorage.getItem('streakDays');
                    if (savedStreakDays) {
                        setStreakDays(parseInt(savedStreakDays, 10));
                    }
                } catch (error) {
                    console.error('연속 출석일수 가져오기 실패:', error);
                }
                
                // 달력 데이터 새로고침 트리거
                setCalendarRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error('사용자 데이터 로드 실패:', error);
                // 에러 발생 시에도 기본값 설정
                setTotalPoint(0);
            }
        };
        
        loadUserData();
    }, []);
    return (
        <View style={styles.container}>
            <TopBar title='마이페이지' />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Profile 
                    name={nickname} 
                    image={require('../../../assets/icons/profile.png')} 
                    id={email} 
                />
                
                <View style={styles.contentContainer}>
                    <VirtualMoneyCard onPress={() => navigation.navigate('VirtualAccount')} />
                    <PointCard totalPoint={totalPoint} onPress={() => pointNavigation.navigate('Point')} />
                    <InvestmentSummaryCard />
                    <ChallengeCard />
                    <AttendCalendar refreshTrigger={calendarRefreshTrigger} streak={streakDays} />
                </View>
            </ScrollView>
        </View>
    );
}

// 가상 머니 카드 컴포넌트
const VirtualMoneyCard = ({ onPress }: { onPress: () => void }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>나의 가상 머니</Text>
        <TouchableOpacity style={styles.cardButton} onPress={onPress}>
            <Text style={styles.cardButtonText}>계좌보기</Text>
            <Image 
                source={require('../../../assets/icons/right.png')} 
                style={[styles.arrowIcon, { tintColor: Colors.primaryDark }]} 
            />
        </TouchableOpacity>
    </View>
);

// 포인트 카드 컴포넌트
const PointCard = ({ totalPoint, onPress }: { totalPoint: number; onPress: () => void }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>나의 포인트</Text>
        <TouchableOpacity style={styles.cardButton} onPress={onPress}>
            <Text style={styles.pointText}>{totalPoint} P</Text>
            <Image 
                source={require('../../../assets/icons/right.png')} 
                style={[styles.arrowIcon, { tintColor: Colors.outline }]} 
            />
        </TouchableOpacity>
    </View>
);

// 투자 요약 카드 컴포넌트
const InvestmentSummaryCard = () => (
    <View style={styles.investmentCard}>
        <InvestmentItem label="평가금액" value="10,000,000" />
        <VerticalDivider />
        <InvestmentItem label="수익률" value="+33.6%" />
        <VerticalDivider />
        <InvestmentItem label="총 매수" value="2,456,700" />
    </View>
);

// 투자 항목 컴포넌트
const InvestmentItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.investmentItem}>
        <Text style={styles.investmentLabel}>{label}</Text>
        <Text style={styles.investmentValue}>{value}</Text>
    </View>
);

// 세로 구분선 컴포넌트
const VerticalDivider = () => <View style={styles.verticalDivider} />;

// 챌린지 카드 컴포넌트
const ChallengeCard = () => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>이번달 챌린지 확인하기</Text>
        <TouchableOpacity style={styles.cardButton}>
            <Image 
                source={require('../../../assets/icons/right.png')} 
                style={[styles.arrowIcon, { tintColor: Colors.outline }]} 
            />
        </TouchableOpacity>
    </View>
);

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
    card: {
        width: hScale(328),
        height: vScale(56),
        backgroundColor: Colors.white,
        borderRadius: hScale(16),
        paddingVertical: vScale(16),
        paddingHorizontal: hScale(16),
        marginBottom: vScale(16),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    cardTitle: {
        fontSize: hScale(16),
        color: Colors.black,
    },
    cardButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardButtonText: {
        fontSize: hScale(16),
        color: Colors.primaryDark,
    },
    pointText: {
        fontSize: hScale(24),
        color: Colors.outline,
    },
    arrowIcon: {
        width: hScale(24),
        height: vScale(24),
    },
    investmentCard: {
        width: hScale(328),
        height: vScale(92),
        backgroundColor: Colors.primaryDim,
        borderRadius: hScale(16),
        paddingVertical: vScale(16),
        paddingHorizontal: hScale(16),
        marginBottom: vScale(16),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    investmentItem: {
        width: hScale(98),
        height: vScale(54),
        alignItems: 'center',
        justifyContent: 'center',
    },
    investmentLabel: {
        fontSize: hScale(12),
        color: Colors.primaryDark,
    },
    investmentValue: {
        fontSize: hScale(16),
        color: Colors.primaryDark,
        fontWeight: 'bold',
    },
    verticalDivider: {
        width: hScale(1),
        height: vScale(60),
        backgroundColor: Colors.white,
    },
});
