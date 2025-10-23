import api from './index';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, AppState } from 'react-native';
import { getTokens } from './auth';
import { getNotificationSetting } from '../utils/notificationSettings';

export async function requestPushPermission():Promise<boolean>{
    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
        return enabled;
    } catch (error) {
        console.error('알림 권한 요청 실패:', error);
        return false;
    }
}
//Fcm token 발급
export async function getFcmToken():Promise<string>{
    try {
        console.log('🔍 [DEBUG] FCM 토큰 발급 시작');
        
        // 상세한 Firebase 초기화 확인 및 초기화 시도
        try {
            console.log('🔍 [DEBUG] Firebase 모듈 로드 시도...');
            const { getApps, initializeApp } = require('@react-native-firebase/app');
            console.log('🔍 [DEBUG] Firebase 모듈 로드 성공');
            
            console.log('🔍 [DEBUG] getApps() 함수 호출 시도...');
            const apps = getApps();
            console.log('🔍 [DEBUG] getApps() 함수 호출 성공');
            console.log('🔍 [DEBUG] Firebase 앱 개수:', apps.length);
            console.log('🔍 [DEBUG] Firebase 앱 배열:', apps);
            
            if (apps.length === 0) {
                console.log('❌ [DEBUG] Firebase 앱이 없음');
                console.log('🔍 [DEBUG] Firebase는 google-services.json을 통해 자동 초기화되어야 함');
                console.log('🔍 [DEBUG] google-services.json 파일 위치: android/app/google-services.json');
                console.log('🔍 [DEBUG] Firebase 초기화 문제 해결 방법:');
                console.log('🔍 [DEBUG] 1. android/app/build.gradle에 google-services 플러그인 확인');
                console.log('🔍 [DEBUG] 2. android/build.gradle에 google-services 클래스패스 확인');
                console.log('🔍 [DEBUG] 3. 앱 재빌드 (npx react-native run-android)');
                throw new Error('Firebase가 초기화되지 않았습니다. google-services.json 설정을 확인하고 앱을 재빌드하세요.');
            }
            
            console.log('✅ [DEBUG] Firebase 초기화 확인됨');
        } catch (error: any) {
            console.log('❌ [DEBUG] Firebase 확인 실패:', error);
            console.log('❌ [DEBUG] 에러 타입:', typeof error);
            console.log('❌ [DEBUG] 에러 메시지:', error.message);
            console.log('❌ [DEBUG] 에러 스택:', error.stack);
            throw error;
        }
        
        // FCM 토큰 발급
        console.log('🔍 [DEBUG] messaging().getToken() 호출 시도...');
        const fcmToken = await messaging().getToken();
        console.log('✅ [DEBUG] FCM 토큰 발급 성공:', fcmToken);
        console.log('🔍 [DEBUG] FCM 토큰 길이:', fcmToken.length);
        return fcmToken;
    } catch (error: any) {
        console.error('❌ [DEBUG] FCM 토큰 발급 실패:', error);
        console.error('❌ [DEBUG] 에러 타입:', typeof error);
        console.error('❌ [DEBUG] 에러 메시지:', error?.message);
        console.error('❌ [DEBUG] 에러 스택:', error?.stack);
        throw error;
    }
}

//백엔드에 Fcm token 전송
export const sendFcmToken = async (fcmToken: string, accessToken: string) => {
    try {
        const response = await api.post(`/api/child/alarm/token`, { token: fcmToken }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sending FCM token:', error);
        throw error;
    }
};

//백엔드에서 Fcm token 삭제
export const deleteFcmToken = async (fcmToken: string, accessToken: string) => {
    try {
        const response = await api.delete(`/api/child/alarm/token`, {
            data: { token: fcmToken },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting FCM token:', error);
        throw error;
    }
};

// 알림 설정 확인 후 알림 표시 여부 결정
export const shouldShowNotification = async (): Promise<boolean> => {
    console.log('🔍 [DEBUG] shouldShowNotification 함수 시작');
    try {
        console.log('🔍 [DEBUG] getNotificationSetting 호출 중...');
        const isNotificationEnabled = await getNotificationSetting();
        console.log('🔍 [DEBUG] getNotificationSetting 결과:', isNotificationEnabled);
        console.log('🔍 [DEBUG] 알림 설정 상태:', isNotificationEnabled);
        return isNotificationEnabled;
    } catch (error) {
        console.error('❌ [DEBUG] 알림 설정 확인 실패:', error);
        console.log('🔍 [DEBUG] 에러 시 기본값 true 반환');
        // 에러 시 기본값은 true (알림 허용)
        return true;
    }
};

// FCM 알림 수신 시 설정값 확인하여 알림 표시
export const handleForegroundNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('🔍 [DEBUG] ===== handleForegroundNotification 함수 호출됨 =====');
    console.log('🔍 [DEBUG] ===== 포그라운드 알림 처리 시작 =====');
    console.log('🔍 [DEBUG] remoteMessage:', JSON.stringify(remoteMessage, null, 2));
    
    try {
        const shouldShow = await shouldShowNotification();
        console.log('🔍 [DEBUG] 알림 설정 상태:', shouldShow);
        
        if (!shouldShow) {
            console.log('❌ [DEBUG] 알림 설정이 비활성화되어 알림을 표시하지 않습니다.');
            return;
        }
        
        console.log('✅ [DEBUG] 알림 설정 활성화됨, 알림 표시 진행');
    } catch (error) {
        console.error('❌ [DEBUG] 알림 설정 확인 중 오류:', error);
        return;
    }

    // 알림 설정이 활성화된 경우에만 알림 표시
    console.log('🔍 [DEBUG] 포그라운드 알림 표시 시작');
    console.log('🔍 [DEBUG] 알림 제목:', remoteMessage.notification?.title || '알림');
    console.log('🔍 [DEBUG] 알림 내용:', remoteMessage.notification?.body || '');
    
    // 앱 내 모달/팝업으로 알림 표시
    try {
        const { Alert } = require('react-native');
        Alert.alert(
            remoteMessage.notification?.title || '알림',
            remoteMessage.notification?.body || '',
            [
                {
                    text: '확인',
                    onPress: () => {
                        console.log('✅ [DEBUG] 사용자가 알림을 확인했습니다');
                        // 알림 클릭 처리 로직 추가 가능
                        handleNotificationPress(remoteMessage);
                    },
                },
                {
                    text: '닫기',
                    style: 'cancel',
                    onPress: () => {
                        console.log('✅ [DEBUG] 사용자가 알림을 닫았습니다');
                    },
                },
            ],
            { cancelable: false } // 뒤로가기로 닫을 수 없음
        );
        console.log('✅ [DEBUG] 포그라운드 알림 모달 표시 완료');
    } catch (error) {
        console.error('❌ [DEBUG] 포그라운드 알림 모달 표시 실패:', error);
    }
};

// 백그라운드/종료 상태에서 알림 클릭 시 앱 실행 처리
export const handleNotificationPress = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('알림 클릭됨:', remoteMessage);
    
    // 알림 데이터에 따라 특정 화면으로 이동하는 로직
    if (remoteMessage.data) {
        const { screen, params } = remoteMessage.data;
        
        // 네비게이션 처리 (필요시 구현)
        if (screen) {
            console.log(`알림 클릭으로 ${screen} 화면으로 이동`);
            // navigationRef.current?.navigate(screen as never, params);
        }
    }
};

// 알림 액션 버튼 처리
export const handleNotificationAction = async (actionId: string, notificationId: string) => {
    console.log('알림 액션 클릭:', actionId, notificationId);
    
    switch (actionId) {
        case 'confirm':
            console.log('알림 확인됨');
            // 알림을 확인으로 표시하거나 특정 동작 수행
            await notifee.cancelNotification(notificationId);
            break;
        case 'dismiss':
            console.log('알림 닫기');
            // 알림 닫기
            await notifee.cancelNotification(notificationId);
            break;
        default:
            console.log('알 수 없는 액션:', actionId);
    }
};

// 알림 채널 생성 (Android)
export const createNotificationChannel = async () => {
    if (Platform.OS === 'android') {
        console.log('🔍 [DEBUG] Android 알림 채널 생성 시작');
        try {
            await notifee.createChannel({
                id: 'default',
                name: '기본 알림',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibration: true,
                lights: true,
            });
            console.log('✅ [DEBUG] Android 알림 채널 생성 성공');
        } catch (error) {
            console.error('❌ [DEBUG] Android 알림 채널 생성 실패:', error);
        }
    }
};

// 테스트용 알림 함수 (디버깅용)
export const sendTestNotification = async () => {
    console.log('🔍 [DEBUG] 테스트 알림 전송 시작');
    
    if (Platform.OS === 'android') {
        try {
            const notificationId = await notifee.displayNotification({
                title: '테스트 알림',
                body: 'FCM 포그라운드 알림 테스트입니다.',
                data: { test: 'true' },
                android: {
                    channelId: 'default',
                    importance: AndroidImportance.HIGH,
                    smallIcon: 'ic_notification',
                    ongoing: true,
                    autoCancel: false,
                    showTimestamp: true,
                    actions: [
                        {
                            title: '확인',
                            pressAction: { id: 'confirm' },
                        },
                        {
                            title: '닫기',
                            pressAction: { id: 'dismiss' },
                        },
                    ],
                },
            });
            console.log('✅ [DEBUG] 테스트 알림 전송 성공, ID:', notificationId);
        } catch (error) {
            console.error('❌ [DEBUG] 테스트 알림 전송 실패:', error);
        }
    }
};