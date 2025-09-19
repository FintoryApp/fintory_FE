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
  } catch (error) {
    console.error('로그인 API 호출 실패:', error);
    return { resultCode: 'ERROR', message: '네트워크 오류' };
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
    const res = await api.post(`${API_CONFIG.ENDPOINTS.LOGOUT}`);
    if (res.status >= 200 && res.status < 300) {
      try {
        const token = await messaging().getToken();
        if (token) {
          await deleteFcmToken(token);
        }
      } catch (e) {
        console.warn('FCM 토큰 삭제 중 오류(무시):', e);
      }
      await removeTokens();
      return { resultCode: 'SUCCESS', data: '로그아웃 성공' };
    } else {
      return { resultCode: 'ERROR', message: '로그아웃 실패' };
    }
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
    return { resultCode: 'ERROR', message: '네트워크 오류' };
  }
};

// 현재 로그인한 사용자 정보 조회
export const getCurrentUser = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get(`${API_CONFIG.ENDPOINTS.GET_ME}`);
    if (res.status >= 200 && res.status < 300) {
      return { resultCode: 'SUCCESS', data: res.data?.data };
    } else {
      return { resultCode: 'ERROR', message: res.data?.message || '사용자 정보 조회 실패' };
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    return { resultCode: 'ERROR', message: '네트워크 오류' };
  }
};