import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';
import { saveTokens } from './auth';
import { API_BASE_URL } from '@env';
import { resetToFirst } from '../navigation/NavigationService';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers:{
        'Content-Type':'application/json',
    },
});

// AT가 필요 없는 경로 화이트리스트
const WITHOUT_AT_PATHS: string[] = [
  // user
  '/api/child/auth/login',
  '/api/child/auth/signup',
  '/api/child/auth/check-email',
  '/api/child/auth/social-login/google',
  '/api/child/auth/social-login/kakao',
  // refresh
  '/api/child/auth/reissue',
  // news
  '/api/news/crawl-test',
];

// 요청 인터셉터: 화이트리스트를 제외하고 Authorization 헤더 첨부
api.interceptors.request.use(async (config) => {
  try {
    const requestPath = config.url || '';
    const isWithoutAT = WITHOUT_AT_PATHS.some((path) => requestPath.startsWith(path));
    if (isWithoutAT) {
      return config;
    }

    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      } as any;
    }
  } catch (e) {
    // no-op: 토큰을 못 읽더라도 요청은 그대로 진행
  }
  return config;
});

export default api;

// 응답 인터셉터: 401 시 토큰 재발급 후 원요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    // 이미 재시도한 요청은 중복 재시도 방지
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // 재발급 요청 (axios 기본 인스턴스로 호출해 순환 방지)
        const reissueRes = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REISSUE_TOKEN}`,
          undefined,
          { headers: { RefreshToken: refreshToken } }
        );

        if (reissueRes?.status >= 200 && reissueRes?.status < 300) {
          const data = reissueRes.data?.data || {};
          if (data.accessToken && data.refreshToken) {
            await saveTokens(data.accessToken, data.refreshToken);
            // 원 요청 헤더 갱신
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${data.accessToken}`,
            };
            return api.request(originalRequest);
          }
        }
      } catch (e: any) {
        // 재발급 실패 시 응답 코드에 따라 분기
        const code = e?.response?.data?.resultCode || e?.response?.data?.code;
        if (code === 'EXPIRED_REFRESH_TOKEN') {
          // RT 만료: 로그인 초기화
          resetToFirst();
        }
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);