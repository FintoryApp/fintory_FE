import { Alert } from 'react-native';
import { requestPushPermission, getFcmToken } from '../api/fcm';
import { updateAlarmStatus, getAlarmStatus } from '../api/alarmStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTokens } from '../api/auth';

// 회원가입 시 알림 권한 요청
export const requestNotificationPermissionOnSignup = async (): Promise<boolean> => {
  try {
    console.log('회원가입 시 알림 권한 요청');
    
    // Firebase 초기화를 위한 지연 실행
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 알림 권한 요청
    const hasPermission = await requestPushPermission();
    
    if (hasPermission) {
      // Firebase 초기화 확인 후 FCM 토큰 발급 (최신 API 사용)
      try {
        const { getApps } = require('@react-native-firebase/app');
        const apps = getApps();
        if (apps.length === 0) {
          console.log('Firebase가 초기화되지 않았습니다. FCM 토큰 발급 건너뜀');
          return false;
        }
      } catch (error) {
        console.log('Firebase 확인 실패. FCM 토큰 발급 건너뜀');
        return false;
      }
      
      // FCM 토큰 발급 (간단하게)
      let fcmToken;
      try {
        fcmToken = await getFcmToken();
        console.log('회원가입 시 FCM 토큰 발급 성공:', fcmToken);
        
        // FCM 토큰을 AsyncStorage에 저장
        await AsyncStorage.setItem('fcmToken', fcmToken);
      } catch (error) {
        console.log('FCM 토큰 발급 실패, 알림 기능 건너뜀:', error);
        return false;
      }
      
      // 백엔드에 알림 설정 상태 전송
      try {
        const { accessToken } = await getTokens();
        if (accessToken) {
          await updateAlarmStatus(true, accessToken);
          console.log('회원가입 시 알림 설정 상태 백엔드 동기화 성공');
        }
      } catch (error) {
        console.error('회원가입 시 알림 설정 상태 동기화 실패:', error);
        // 동기화 실패는 알림 권한을 막지 않음
      }
      
      return true;
    } else {
      console.log('회원가입 시 알림 권한이 거부되었습니다.');
      
      // 백엔드에 알림 거부 상태 전송
      try {
        const { accessToken } = await getTokens();
        if (accessToken) {
          await updateAlarmStatus(false, accessToken);
          console.log('회원가입 시 알림 거부 상태 백엔드 동기화 성공');
        }
      } catch (error) {
        console.error('회원가입 시 알림 거부 상태 동기화 실패:', error);
      }
      
      Alert.alert(
        '알림 권한',
        '알림을 받으려면 설정에서 알림 권한을 허용해주세요.',
        [{ text: '확인' }]
      );
      return false;
    }
  } catch (error: any) {
    console.error('회원가입 시 알림 권한 요청 실패:', error);
    // Firebase 초기화 오류인 경우 3초 후 재시도
    if (error.message && error.message.includes('No Firebase App')) {
      console.log('Firebase 초기화 대기 중... 3초 후 재시도');
      setTimeout(() => {
        requestNotificationPermissionOnSignup();
      }, 3000);
    }
    return false;
  }
};

// 기존 사용자 로그인 시 알림 권한 확인 (권한 요청 없이)
export const checkNotificationPermissionOnLogin = async (): Promise<boolean> => {
  try {
    console.log('🔍 [DEBUG] 로그인 시 알림 권한 확인 시작');
    
    // Firebase 초기화를 위한 지연 실행
    console.log('🔍 [DEBUG] 3초 대기 중...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('🔍 [DEBUG] 3초 대기 완료');
    
    // 백엔드에서 알림 설정 상태 조회
    console.log('🔍 [DEBUG] 액세스 토큰 조회 시도...');
    const { accessToken } = await getTokens();
    console.log('🔍 [DEBUG] 액세스 토큰 조회 결과:', accessToken ? '있음' : '없음');
    
    if (accessToken) {
      try {
        console.log('🔍 [DEBUG] 백엔드 알림 설정 상태 조회 시도...');
        const alarmStatus = await getAlarmStatus(accessToken);
        console.log('🔍 [DEBUG] 백엔드에서 알림 설정 상태 조회:', alarmStatus);
        
        // isAlarm이 null이면 알림 권한 재선택
        if (alarmStatus.isAlarm === null) {
          console.log('🔍 [DEBUG] 알림 설정이 null이므로 알림 권한 재선택');
          return await requestNotificationPermissionOnLogin();
        }
        
        // isAlarm이 true이면 알림 허용, false이면 알림 거부
        if (alarmStatus.isAlarm === true) {
          console.log('🔍 [DEBUG] 백엔드 설정: 알림 허용');
          return await initializeFCMForLogin();
        } else {
          console.log('🔍 [DEBUG] 백엔드 설정: 알림 거부');
          return false;
        }
      } catch (error: any) {
        console.error('❌ [DEBUG] 백엔드 알림 설정 상태 조회 실패:', error);
        console.error('❌ [DEBUG] 에러 타입:', typeof error);
        console.error('❌ [DEBUG] 에러 메시지:', error.message);
        // 백엔드 조회 실패 시 기존 로직 사용
      }
    }
    
    // 백엔드 조회 실패 시 기존 로직 사용
    const existingToken = await AsyncStorage.getItem('fcmToken');
    
    if (existingToken) {
      console.log('기존 FCM 토큰 사용');
      return true;
    }
    
    // FCM 토큰이 없으면 새로 발급 (권한 요청 없이)
    const fcmToken = await getFcmToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      console.log('로그인 시 FCM 토큰 발급 성공:', fcmToken);
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error('로그인 시 알림 권한 확인 실패:', error);
    // Firebase 초기화 오류인 경우 3초 후 재시도
    if (error.message && error.message.includes('No Firebase App')) {
      console.log('Firebase 초기화 대기 중... 3초 후 재시도');
      setTimeout(() => {
        checkNotificationPermissionOnLogin();
      }, 3000);
    }
    return false;
  }
};

// 로그인 시 알림 권한 재선택
const requestNotificationPermissionOnLogin = async (): Promise<boolean> => {
  try {
    console.log('로그인 시 알림 권한 재선택');
    
    // 알림 권한 요청
    const hasPermission = await requestPushPermission();
    
    if (hasPermission) {
      // FCM 토큰 발급 (간단하게)
      try {
        const fcmToken = await getFcmToken();
        console.log('로그인 시 FCM 토큰 발급 성공:', fcmToken);
        
        // FCM 토큰을 AsyncStorage에 저장
        await AsyncStorage.setItem('fcmToken', fcmToken);
      } catch (error) {
        console.log('FCM 토큰 발급 실패, 알림 기능 건너뜀:', error);
        return false;
      }
      
      // 백엔드에 알림 설정 상태 전송
      const { accessToken } = await getTokens();
      if (accessToken) {
        await updateAlarmStatus(true, accessToken);
        console.log('로그인 시 알림 설정 상태 백엔드 동기화 성공');
      }
      
      return true;
    } else {
      console.log('로그인 시 알림 권한이 거부되었습니다.');
      
      // 백엔드에 알림 거부 상태 전송
      const { accessToken } = await getTokens();
      if (accessToken) {
        await updateAlarmStatus(false, accessToken);
        console.log('로그인 시 알림 거부 상태 백엔드 동기화 성공');
      }
      
      return false;
    }
  } catch (error: any) {
    console.error('로그인 시 알림 권한 재선택 실패:', error);
    return false;
  }
};

// 로그인 시 FCM 초기화
const initializeFCMForLogin = async (): Promise<boolean> => {
  try {
    console.log('🔍 [DEBUG] 로그인 시 FCM 초기화 시작');
    
    // Firebase 초기화 확인 (최신 API 사용)
    try {
      console.log('🔍 [DEBUG] Firebase 모듈 로드 시도...');
      const { getApps } = require('@react-native-firebase/app');
      console.log('🔍 [DEBUG] Firebase 모듈 로드 성공');
      
      console.log('🔍 [DEBUG] getApps() 함수 호출 시도...');
      const apps = getApps();
      console.log('🔍 [DEBUG] getApps() 함수 호출 성공');
      console.log('🔍 [DEBUG] Firebase 앱 개수:', apps.length);
      
      if (apps.length === 0) {
        console.log('❌ [DEBUG] Firebase가 초기화되지 않았습니다. FCM 초기화 건너뜀');
        return false;
      }
      
      console.log('✅ [DEBUG] Firebase 초기화 확인됨');
    } catch (error: any) {
      console.log('❌ [DEBUG] Firebase 확인 실패:', error);
      console.log('❌ [DEBUG] 에러 타입:', typeof error);
      console.log('❌ [DEBUG] 에러 메시지:', error.message);
      console.log('❌ [DEBUG] FCM 초기화 건너뜀');
      return false;
    }
    
    // 기존에 저장된 FCM 토큰이 있는지 확인
    console.log('🔍 [DEBUG] 기존 FCM 토큰 확인 중...');
    const existingToken = await AsyncStorage.getItem('fcmToken');
    console.log('🔍 [DEBUG] 기존 FCM 토큰 존재 여부:', existingToken ? '있음' : '없음');
    
    if (existingToken) {
      console.log('✅ [DEBUG] 기존 FCM 토큰 사용');
      return true;
    }
    
    // FCM 토큰이 없으면 새로 발급 (간단하게)
    try {
      console.log('🔍 [DEBUG] 새 FCM 토큰 발급 시도...');
      const fcmToken = await getFcmToken();
      console.log('✅ [DEBUG] 로그인 시 FCM 토큰 발급 성공');
      await AsyncStorage.setItem('fcmToken', fcmToken);
      console.log('✅ [DEBUG] FCM 토큰 AsyncStorage 저장 완료');
      return true;
    } catch (error: any) {
      console.log('❌ [DEBUG] FCM 토큰 발급 실패:', error);
      console.log('❌ [DEBUG] 에러 타입:', typeof error);
      console.log('❌ [DEBUG] 에러 메시지:', error.message);
      return false;
    }
  } catch (error: any) {
    console.error('❌ [DEBUG] 로그인 시 FCM 초기화 실패:', error);
    console.error('❌ [DEBUG] 에러 타입:', typeof error);
    console.error('❌ [DEBUG] 에러 메시지:', error.message);
    console.error('❌ [DEBUG] 에러 스택:', error.stack);
    return false;
  }
};
