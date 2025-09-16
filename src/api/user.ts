import api from './index';
import { API_CONFIG } from './config';

// FCM 토큰 등록
export const registerFcmToken = async (token: string) => {
  try {
    const res = await api.post(API_CONFIG.ENDPOINTS.FCM_TOKEN, { token });
    return res.data;
  } catch (e) {
    console.error('FCM 토큰 등록 실패:', e);
    throw e;
  }
};

// FCM 토큰 삭제
export const deleteFcmToken = async (token: string) => {
  try {
    const res = await api.delete(API_CONFIG.ENDPOINTS.FCM_TOKEN, { data: { token } });
    return res.data;
  } catch (e) {
    console.error('FCM 토큰 삭제 실패:', e);
    throw e;
  }
};

