import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  API_CONFIG, 
  ApiResponse, 
  AuthToken, 
  ApiResponseBoolean, 
  LoginRequest, 
  SignupRequest
} from './config';
import messaging from '@react-native-firebase/messaging';
import { deleteFcmToken } from './user';

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
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const { accessToken } = await getTokens();

  // Authorization 헤더 추가
  const defaultHeaders = {
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  // AccessToken 만료 (401 Unauthorized)
  if (response.status === 401) {
    const { refreshToken } = await getTokens();

    if (refreshToken) {
      try {
        const reissueRes = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REISSUE_TOKEN}`, {
          method: "POST",
          headers: {
            "RefreshToken": refreshToken,
          },
        });

        if (reissueRes.ok) {
          const { data } = await reissueRes.json(); // { accessToken, refreshToken }

          // 새 토큰 저장
          await saveTokens(data.accessToken, data.refreshToken);

          // 재요청 (새 토큰으로)
          const retryRes = await fetch(url, {
            ...options,
            headers: {
              ...defaultHeaders,
              "Authorization": `Bearer ${data.accessToken}`,
            },
          });

          return retryRes;
        }
      } catch (error) {
        console.error('토큰 재발급 실패:', error);
      }
    }

    // 토큰 재발급 실패 시 로그인 화면으로 이동
    // React Native에서는 navigation을 사용해야 함
    throw new Error('TOKEN_EXPIRED');
  }

  return response;
};

// 로그인 API
export const login = async (email: string, password: string): Promise<ApiResponse<AuthToken>> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as LoginRequest),
    });

    const responseData = await response.json();
    
    // API 응답 구조: resultCode로 성공/실패 판단
    if (responseData.resultCode === 'SUCCESS' && responseData.data) {
      await saveTokens(responseData.data.accessToken, responseData.data.refreshToken);
      return { 
        resultCode: responseData.resultCode, 
        data: {
          accessToken: responseData.data.accessToken,
          refreshToken: responseData.data.refreshToken
        }
      };
    } else {
      // 실패 시 (resultCode가 SUCCESS가 아니거나 data가 없는 경우)
      return { 
        resultCode: responseData.resultCode, 
        message: responseData.message || '로그인 실패' 
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
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    
    // 디버깅: 백엔드 응답 로그
    console.log('백엔드 회원가입 응답:', responseData);
    
    if (responseData.code === 'SUCCESS' && responseData.data) {
      await saveTokens(responseData.data.accessToken, responseData.data.refreshToken);
      return {
        resultCode: responseData.code,
        data: {
          accessToken: responseData.data.accessToken,
          refreshToken: responseData.data.refreshToken
        },
        message: responseData.message
      };
    } else if (responseData.code === 'VALIDATION_FAIL' && responseData.errors) {
      // 검증 실패 시 상세한 오류 메시지 생성
      const errorMessages = Object.values(responseData.errors).filter(msg => msg).join('\n');
      return {
        resultCode: responseData.code,
        message: errorMessages || responseData.message
      };
    } else {
      return {
        resultCode: responseData.code || 'ERROR',
        message: responseData.message || '회원가입 실패'
      };
    }
  } catch (error) {
    console.error('회원가입 API 호출 실패:', error);
    return {
      resultCode: 'ERROR',
      message: '네트워크 오류가 발생했습니다.'
    };
  }
};

// 이메일 중복 확인
export const checkEmailDuplication = async (email: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECK_EMAIL}?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    
    // 백엔드 응답 구조: resultCode, data
    if (responseData.resultCode === 'SUCCESS') {
      return {
        resultCode: 'SUCCESS',
        data: responseData.data, // data는 boolean 값 (false: 사용 가능, true: 이미 사용 중)
        message: '이메일 중복 확인 완료'
      };
    } else {
      return {
        resultCode: responseData.resultCode || 'ERROR',
        data: false,
        message: responseData.message || '이메일 중복 확인 실패'
      };
    }
  } catch (error) {
    console.error('이메일 중복 확인 API 호출 실패:', error);
    return {
      resultCode: 'ERROR',
      data: false,
      message: '네트워크 오류가 발생했습니다.'
    };
  }
};

// 로그아웃 API
export const logout = async (): Promise<ApiResponse<string>> => {
  try {
    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`, {
      method: 'POST',
    });

    if (response.ok) {
      // 서버 로그아웃 성공 시 FCM 토큰 삭제 시도 (실패해도 진행)
      try {
        const token = await messaging().getToken();
        if (token) {
          await deleteFcmToken(token);
        }
      } catch (e) {
        console.warn('FCM 토큰 삭제 중 오류(무시):', e);
      }
      // 로그아웃 성공 시 로컬 토큰 삭제
      await removeTokens();
      return { resultCode: 'SUCCESS', data: '로그아웃 성공' };
    } else {
      const errorData = await response.json();
      return { resultCode: 'ERROR', message: errorData.message || '로그아웃 실패' };
    }
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
    return { resultCode: 'ERROR', message: '네트워크 오류' };
  }
};

// 현재 로그인한 사용자 정보 조회
export const getCurrentUser = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ME}`, {
      method: 'GET',
    });

    if (response.ok) {
      const { data } = await response.json();
      return { resultCode: 'SUCCESS', data: data };
    } else {
      const errorData = await response.json();
      return { resultCode: 'ERROR', message: errorData.message || '사용자 정보 조회 실패' };
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    return { resultCode: 'ERROR', message: '네트워크 오류' };
  }
}; 