// API 기본 설정
export const API_CONFIG = {
  // 개발 환경 (Android 에뮬레이터용)
  BASE_URL: 'http://fintory.xyz', // Android 에뮬레이터에서 호스트 컴퓨터 접근
  
  // iOS 시뮬레이터용 (필요시 주석 해제)
  // BASE_URL: 'http://localhost:8080',
  
  // 프로덕션 환경
  // BASE_URL: 'https://your-production-server.com',
  
  // API 엔드포인트
  ENDPOINTS: {
    // 인증 관련
    SIGNUP: '/api/auth/signup',
    REISSUE_TOKEN: '/api/auth/reissue',
    LOGOUT: '/api/auth/logout',
    LOGIN: '/api/auth/login',
    GET_ME: '/api/auth/me',
    CHECK_EMAIL: '/api/auth/check-email',
    // FCM 토큰 등록/삭제 (가정된 엔드포인트 - 필요 시 수정)
    FCM_TOKEN: '/api/notifications/token',
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
