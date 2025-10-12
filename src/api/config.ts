// API 기본 설정
export const API_CONFIG = {
  BASE_URL: 'https://fintory.xyz',
  
  //BASE_URL: 'http://10.0.2.2:8080',
    
  // API 엔드포인트
  ENDPOINTS: {
    // 인증 관련
    SIGNUP: '/api/child/auth/signup',
    REISSUE_TOKEN: '/api/child/auth/reissue',
    LOGOUT: '/api/child/auth/logout',
    LOGIN: '/api/child/auth/login',
    GET_ME: '/api/child/auth/me',
    CHECK_EMAIL: '/api/child/auth/check-email',
    SOCIAL_LOGIN_GOOGLE: '/api/child/auth/social-login/google',
    SOCIAL_LOGIN_KAKAO: '/api/child/auth/social-login/kakao',
    
    // 출석 관련
    CHECK_ATTENDANCE: '/api/child/attendance/check-in',
    GET_ATTENDANCE: '/api/child/attendance/attendance-logs',
    
    // 주식 관련
    KOREAN_STOCK_MARKET_CAP: '/api/child/stock/korean/rankings/market-cap',
    OVERSEAS_STOCK_MARKET_CAP: '/api/child/stock/overseas/rankings/market-cap',
    
    // 환율 관련
    EXCHANGE_RATE: '/api/child/portfolio/exchangeRate',
  },
  
  // 요청 타임아웃 (밀리초)
  TIMEOUT: 10000,
  
  // 재시도 횟수
  MAX_RETRIES: 3,
};

// API 응답 기본 타입
export interface ApiResponse<T = any> {
  resultCode: string;
  data?: T;
  message?: string;
}

// 회원가입 요청 타입
export interface SignupRequest {
  nickname: string;
  password: string;
  email: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 인증 토큰 타입
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

// 토큰 재발급 요청 타입
export interface ReissueRequest {
  refreshToken: string;
}

// 문자열 응답 타입 (이메일 중복 확인 등)
export interface ApiResponseBoolean {
  resultCode: string;
  data: boolean;
  message?: string;
}
