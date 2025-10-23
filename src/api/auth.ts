import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  API_CONFIG, 
  ApiResponse, 
  AuthToken, 
  ApiResponseBoolean, 
  LoginRequest, 
  SignupRequest
} from './config';
import api from './index';
import { sendFcmToken, deleteFcmToken, createNotificationChannel, handleForegroundNotification, handleNotificationPress } from './fcm';
import { requestNotificationPermissionOnSignup, checkNotificationPermissionOnLogin } from '../utils/notificationPermission';
import messaging from '@react-native-firebase/messaging';

// FCM 리스너 설정 (로그인 성공 후에만 실행)
export const setupFCMListeners = async () => {
  console.log('🔍 [DEBUG] ===== setupFCMListeners 함수 호출됨 =====');
  try {
    console.log('🔍 [DEBUG] FCM 리스너 설정 시작');
    
    // 간단한 지연 후 바로 시도
    console.log('🔍 [DEBUG] 2초 대기 중...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('🔍 [DEBUG] 2초 대기 완료');
    
    // Firebase 초기화 확인 및 초기화 시도 (상세 디버깅)
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
        console.log('🔍 [DEBUG] FCM 리스너 설정을 건너뛰지만 앱은 정상 작동');
        console.log('🔍 [DEBUG] Firebase 초기화 문제 해결 방법:');
        console.log('🔍 [DEBUG] 1. android/app/build.gradle에 google-services 플러그인 확인');
        console.log('🔍 [DEBUG] 2. android/build.gradle에 google-services 클래스패스 확인');
        console.log('🔍 [DEBUG] 3. 앱 재빌드 (npx react-native run-android)');
        return;
      }
      
      console.log('✅ [DEBUG] Firebase 초기화 확인됨, FCM 리스너 설정 진행');
    console.log('🔍 [DEBUG] ===== FCM 리스너 설정 시작 =====');
    } catch (error: any) {
      console.log('❌ [DEBUG] Firebase 확인 실패:', error);
      console.log('❌ [DEBUG] 에러 타입:', typeof error);
      console.log('❌ [DEBUG] 에러 메시지:', error.message);
      console.log('❌ [DEBUG] 에러 스택:', error.stack);
      console.log('❌ [DEBUG] FCM 리스너 설정 건너뜀');
      return;
    }
    
    // FCM 포그라운드 알림 리스너 설정
    console.log('🔍 [DEBUG] ===== FCM 포그라운드 리스너 설정 시작 =====');
    messaging().onMessage(async remoteMessage => {
      console.log('🔍 [DEBUG] ===== FCM 포그라운드 메시지 수신 =====');
      console.log('🔍 [DEBUG] 메시지 제목:', remoteMessage.notification?.title);
      console.log('🔍 [DEBUG] 메시지 내용:', remoteMessage.notification?.body);
      console.log('🔍 [DEBUG] 메시지 데이터:', remoteMessage.data);
      console.log('🔍 [DEBUG] handleForegroundNotification 함수 호출 시작');
      
      try {
        await handleForegroundNotification(remoteMessage);
        console.log('✅ [DEBUG] ===== 포그라운드 알림 처리 완료 =====');
      } catch (error) {
        console.error('❌ [DEBUG] ===== 포그라운드 알림 처리 실패 =====');
        console.error('❌ [DEBUG] 에러 상세:', error);
      }
    });

    // FCM 백그라운드/종료 상태 알림 리스너 설정
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('FCM 백그라운드 메시지 수신:', remoteMessage);
      // 백그라운드에서는 시스템이 자동으로 알림을 표시
    });

    // 앱이 백그라운드에서 포그라운드로 돌아올 때 알림 처리
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('앱이 백그라운드에서 알림 클릭으로 열림:', remoteMessage);
      handleNotificationPress(remoteMessage);
    });

    // 앱이 종료된 상태에서 알림 클릭으로 열릴 때 처리
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('앱이 종료 상태에서 알림 클릭으로 열림:', remoteMessage);
          handleNotificationPress(remoteMessage);
        }
      });

    // 알림 액션 버튼 처리 리스너 설정 (Notifee 이벤트 리스너 제거)
    console.log('🔍 [DEBUG] Notifee 이벤트 리스너는 현재 비활성화됨');
    console.log('✅ [DEBUG] ===== FCM 리스너 설정 완료 =====');
  } catch (error: any) {
    console.error('FCM 리스너 설정 실패:', error);
    // Firebase 초기화 오류인 경우 5초 후 재시도
    if (error.message && error.message.includes('No Firebase App')) {
      console.log('Firebase 초기화 대기 중... 5초 후 재시도');
      setTimeout(() => {
        setupFCMListeners();
      }, 5000);
    } else {
      console.log('기타 오류로 인한 FCM 리스너 설정 실패. 5초 후 재시도');
      setTimeout(() => {
        setupFCMListeners();
      }, 5000);
    }
  }
};

// AsyncStorage를 안전하게 가져오는 함수
let asyncStorageInstance: typeof AsyncStorage | null = null;

const getAsyncStorage = async (): Promise<typeof AsyncStorage | null> => {
  if (asyncStorageInstance) {
    return asyncStorageInstance;
  }
  
  try {
    // AsyncStorage가 사용 가능한지 테스트
    await AsyncStorage.setItem('__test__', 'test');
    await AsyncStorage.removeItem('__test__');
    asyncStorageInstance = AsyncStorage;
    return asyncStorageInstance;
  } catch (error) {
    console.warn('AsyncStorage is not available:', error);
    return null;
  }
};

// AsyncStorage가 사용 가능한지 확인하는 함수
const isAsyncStorageAvailable = async (): Promise<boolean> => {
  const storage = await getAsyncStorage();
  return storage !== null;
};

// 토큰 저장
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    const storage = await getAsyncStorage();
    if (!storage) {
      console.warn('AsyncStorage is not available, tokens will not be saved');
      return;
    }
    await storage.setItem('accessToken', accessToken);
    await storage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

// 토큰 가져오기
export const getTokens = async () => {
  try {
    const storage = await getAsyncStorage();
    if (!storage) {
      console.warn('AsyncStorage is not available, returning null tokens');
      return { accessToken: null, refreshToken: null };
    }
    const accessToken = await storage.getItem('accessToken');
    const refreshToken = await storage.getItem('refreshToken');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return { accessToken: null, refreshToken: null };
  }
};

// 토큰 삭제 (로그아웃)
export const removeTokens = async () => {
  try {
    const storage = await getAsyncStorage();
    if (!storage) {
      console.warn('AsyncStorage is not available, tokens will not be removed');
      return;
    }
    await storage.removeItem('accessToken');
    await storage.removeItem('refreshToken');
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
};

// 인증이 포함된 fetch 함수
// fetchWithAuth는 axios로 통일된 환경에서는 사용하지 않음 (남겨두되 미사용)
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  throw new Error('Deprecated: Use axios instance (api) instead.');
};

// 로그인 API
export const login = async (email: string, password: string): Promise<ApiResponse<AuthToken>> => {
  try {
    const { data: responseData } = await api.post(`${API_CONFIG.ENDPOINTS.LOGIN}`, {
      email,
      password,
    } as LoginRequest);

    if (responseData.resultCode === 'SUCCESS' && responseData.data) {
      await saveTokens(responseData.data.accessToken, responseData.data.refreshToken);
      
      console.log('=== 로그인 성공 ===');
      console.log('AccessToken:', responseData.data.accessToken);
      console.log('RefreshToken:', responseData.data.refreshToken);
      
      // 로그인 성공 후 알림 설정 조회 및 FCM 초기화
      try {
        // 알림 채널 생성 (Android)
        await createNotificationChannel();
        
        // 알림 권한 확인 및 FCM 토큰 등록
        const hasNotificationPermission = await checkNotificationPermissionOnLogin();
        if (hasNotificationPermission) {
          const fcmToken = await AsyncStorage.getItem('fcmToken');
          if (fcmToken) {
            await sendFcmToken(fcmToken, responseData.data.accessToken);
            console.log('로그인 시 FCM 토큰 백엔드 등록 성공');
          }
        }
        
        // FCM 리스너 설정
        console.log('🔍 [DEBUG] ===== 로그인 성공 후 FCM 리스너 설정 호출 =====');
        await setupFCMListeners();
        console.log('🔍 [DEBUG] ===== FCM 리스너 설정 호출 완료 =====');
      } catch (error) {
        console.error('로그인 시 FCM 초기화 실패:', error);
        // FCM 초기화 실패는 로그인을 막지 않음
      }
      
      return {
        resultCode: responseData.resultCode,
        data: {
          accessToken: responseData.data.accessToken,
          refreshToken: responseData.data.refreshToken,
        },
      };
    } else {
      return {
        resultCode: responseData.resultCode,
        message: responseData.message || '로그인 실패',
      };
    }
  } catch (error: any) {
    // HTTP 상태 코드에 따른 에러 구분
    if (error.code === 'NETWORK_ERROR' || 
        error.message?.includes('Network Error') || 
        error.message?.includes('timeout') ||
        !error.response) {
      // 서버 연결 오류
      console.error('로그인 API 호출 실패:', error);
      return { resultCode: 'ERROR', message: '서버 연결 오류가 발생했습니다. 네트워크를 확인해주세요.' };
    } else if (error.response?.status === 400) {
      // 400: 아이디 또는 비밀번호 문제 (콘솔 에러 출력 안함)
      return { resultCode: 'ERROR', message: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    } else if (error.response?.status === 500) {
      // 500: 서버 내부 오류
      console.error('로그인 API 호출 실패:', error);
      return { resultCode: 'ERROR', message: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' };
    } else {
      // 기타 오류
      console.error('로그인 API 호출 실패:', error);
      return { resultCode: 'ERROR', message: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' };
    }
  }
};

// 회원가입 API (자동 로그인 포함)
export const signup = async (userData: SignupRequest): Promise<ApiResponse<AuthToken>> => {
  try {
    const { data: responseData } = await api.post(`${API_CONFIG.ENDPOINTS.SIGNUP}`, userData);

    // 디버깅: 백엔드 응답 로그
    console.log('백엔드 회원가입 응답:', responseData);

    if ((responseData.resultCode || responseData.code) === 'SUCCESS' && responseData.data) {
      const accessToken = responseData.data.accessToken;
      const refreshToken = responseData.data.refreshToken;
      if (accessToken && refreshToken) {
        await saveTokens(accessToken, refreshToken);
        
        // 회원가입 성공 시 FCM 초기화 및 리스너 설정
        try {
          // 알림 채널 생성 (Android)
          await createNotificationChannel();
          
          // 알림 권한 요청
          const hasNotificationPermission = await requestNotificationPermissionOnSignup();
          if (hasNotificationPermission) {
            // 알림 권한이 허용된 경우 FCM 토큰을 백엔드에 등록
            const fcmToken = await AsyncStorage.getItem('fcmToken');
            if (fcmToken) {
              await sendFcmToken(fcmToken, accessToken);
              console.log('회원가입 시 FCM 토큰 백엔드 등록 성공');
            }
          }
          
          // FCM 리스너 설정
          setupFCMListeners();
        } catch (error) {
          console.error('회원가입 시 FCM 초기화 실패:', error);
          // FCM 초기화 실패는 회원가입을 막지 않음
        }
      }
      return {
        resultCode: responseData.resultCode || responseData.code,
        data: { accessToken, refreshToken },
        message: responseData.message,
      };
    } else if (responseData.code === 'VALIDATION_FAIL' && responseData.errors) {
      const errorMessages = Object.values(responseData.errors).filter((msg: any) => msg).join('\n');
      return { resultCode: responseData.code, message: errorMessages || responseData.message };
    } else {
      return { resultCode: responseData.resultCode || responseData.code || 'ERROR', message: responseData.message || '회원가입 실패' };
    }
  } catch (error) {
    console.error('회원가입 API 호출 실패:', error);
    return { resultCode: 'ERROR', message: '네트워크 오류가 발생했습니다.' };
  }
};

// 이메일 중복 확인
export const checkEmailDuplication = async (email: string): Promise<ApiResponse<boolean>> => {
  try {
    const { data: responseData } = await api.get(`${API_CONFIG.ENDPOINTS.CHECK_EMAIL}?email=${encodeURIComponent(email)}`);
    if (responseData.resultCode === 'SUCCESS') {
      return { resultCode: 'SUCCESS', data: responseData.data, message: '이메일 중복 확인 완료' };
    } else {
      return { resultCode: responseData.resultCode || 'ERROR', data: false, message: responseData.message || '이메일 중복 확인 실패' };
    }
  } catch (error) {
    console.error('이메일 중복 확인 API 호출 실패:', error);
    return { resultCode: 'ERROR', data: false, message: '네트워크 오류가 발생했습니다.' };
  }
};

// 로그아웃 API
export const logout = async (): Promise<ApiResponse<string>> => {
  try {
    // 로그아웃 전에 FCM 토큰 삭제
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      const { accessToken } = await getTokens();
      
      if (fcmToken && accessToken) {
        await deleteFcmToken(fcmToken, accessToken);
        console.log('FCM 토큰 백엔드에서 삭제 성공');
      }
    } catch (error) {
      console.error('FCM 토큰 삭제 실패:', error);
      // FCM 토큰 삭제 실패는 로그아웃을 막지 않음
    }

    const res = await api.post(`${API_CONFIG.ENDPOINTS.LOGOUT}`);
    if (res.status >= 200 && res.status < 300) {
      await removeTokens();
      // FCM 토큰도 로컬에서 삭제
      await AsyncStorage.removeItem('fcmToken');
      return { resultCode: 'SUCCESS', data: '로그아웃 성공' };
    } else {
      return { resultCode: 'ERROR', message: '로그아웃 실패' };
    }
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
    return { resultCode: 'ERROR', message: '네트워크 오류' };
  }
};

// 카카오 소셜 로그인 API
export const kakaoSocialLogin = async (accessToken: string): Promise<ApiResponse<AuthToken>> => {
  try {
    console.log('카카오 소셜 로그인 API 호출 시작');
    const { data: responseData } = await api.post(`${API_CONFIG.ENDPOINTS.SOCIAL_LOGIN_KAKAO}`, {
      accessToken
    });

    console.log('카카오 소셜 로그인 API 응답:', responseData);

    if (responseData.resultCode === 'SUCCESS' && responseData.data) {
      await saveTokens(responseData.data.accessToken, responseData.data.refreshToken);
      
      console.log('=== 카카오 로그인 성공 ===');
      console.log('AccessToken:', responseData.data.accessToken);
      console.log('RefreshToken:', responseData.data.refreshToken);
      
      // 카카오 로그인 성공 후 알림 설정 조회 및 FCM 초기화
      try {
        // 알림 채널 생성 (Android)
        await createNotificationChannel();
        
        // 알림 권한 확인 및 FCM 토큰 등록
        const hasNotificationPermission = await checkNotificationPermissionOnLogin();
        if (hasNotificationPermission) {
          const fcmToken = await AsyncStorage.getItem('fcmToken');
          if (fcmToken) {
            await sendFcmToken(fcmToken, responseData.data.accessToken);
            console.log('카카오 로그인 시 FCM 토큰 백엔드 등록 성공');
          }
        }
        
        // FCM 리스너 설정
        await setupFCMListeners();
      } catch (error) {
        console.error('카카오 로그인 시 FCM 초기화 실패:', error);
      }
      
      return {
        resultCode: responseData.resultCode,
        data: {
          accessToken: responseData.data.accessToken,
          refreshToken: responseData.data.refreshToken,
        },
        message: responseData.message,
      };
    } else {
      return {
        resultCode: responseData.resultCode || 'ERROR',
        message: responseData.message || '카카오 로그인 실패',
      };
    }
  } catch (error: any) {
    console.error('카카오 소셜 로그인 API 호출 실패:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    return { resultCode: 'ERROR', message: '카카오 로그인 중 오류가 발생했습니다.' };
  }
};

// 구글 소셜 로그인 API
export const googleSocialLogin = async (idToken: string): Promise<ApiResponse<AuthToken>> => {
  try {
    console.log('구글 소셜 로그인 API 호출 시작');
    const { data: responseData } = await api.post(`${API_CONFIG.ENDPOINTS.SOCIAL_LOGIN_GOOGLE}`, {
      idToken
    });

    console.log('구글 소셜 로그인 API 응답:', responseData);

    if (responseData.resultCode === 'SUCCESS' && responseData.data) {
      await saveTokens(responseData.data.accessToken, responseData.data.refreshToken);
      
      console.log('=== 구글 로그인 성공 ===');
      console.log('AccessToken:', responseData.data.accessToken);
      console.log('RefreshToken:', responseData.data.refreshToken);
      
      // 구글 로그인 성공 후 알림 설정 조회 및 FCM 초기화
      try {
        // 알림 채널 생성 (Android)
        await createNotificationChannel();
        
        // 알림 권한 확인 및 FCM 토큰 등록
        const hasNotificationPermission = await checkNotificationPermissionOnLogin();
        if (hasNotificationPermission) {
          const fcmToken = await AsyncStorage.getItem('fcmToken');
          if (fcmToken) {
            await sendFcmToken(fcmToken, responseData.data.accessToken);
            console.log('구글 로그인 시 FCM 토큰 백엔드 등록 성공');
          }
        }
        
        // FCM 리스너 설정
        await setupFCMListeners();
      } catch (error) {
        console.error('구글 로그인 시 FCM 초기화 실패:', error);
      }
      
      return {
        resultCode: responseData.resultCode,
        data: {
          accessToken: responseData.data.accessToken,
          refreshToken: responseData.data.refreshToken,
        },
        message: responseData.message,
      };
    } else {
      return {
        resultCode: responseData.resultCode || 'ERROR',
        message: responseData.message || '구글 로그인 실패',
      };
    }
  } catch (error: any) {
    console.error('구글 소셜 로그인 API 호출 실패:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    return { resultCode: 'ERROR', message: '구글 로그인 중 오류가 발생했습니다.' };
  }
};

// 현재 로그인한 사용자 정보 조회
export const getCurrentUser = async (): Promise<ApiResponse<any>> => {
  try {
    console.log('getCurrentUser API 호출 시작');
    const res = await api.get(`${API_CONFIG.ENDPOINTS.GET_ME}`);
    console.log('getCurrentUser API 응답:', res.data);
    
    if (res.status >= 200 && res.status < 300) {
      // 응답 구조에 따라 적절한 데이터 추출
      const userData = res.data?.data || res.data;
      console.log('getCurrentUser - 추출된 사용자 데이터:', userData);
      return { resultCode: 'SUCCESS', data: userData };
    } else {
      return { resultCode: 'ERROR', message: res.data?.message || '사용자 정보 조회 실패' };
    }
  } catch (error: any) {
    console.error('사용자 정보 조회 실패:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return { resultCode: 'ERROR', message: '네트워크 오류' };
  }
};