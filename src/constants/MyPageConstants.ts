// 마이페이지 관련 상수들
export const MY_PAGE_CONSTANTS = {
  // AsyncStorage 키
  STORAGE_KEYS: {
    NICKNAME: 'userNickname',
    EMAIL: 'userEmail',
    TOTAL_POINT: 'totalPoint',
    STREAK_DAYS: 'streakDays',
  },
  
  // 기본값
  DEFAULT_VALUES: {
    TOTAL_POINT: 0,
    STREAK_DAYS: 0,
  },
  
  // UI 텍스트
  UI_TEXT: {
    LOADING: '로딩 중...',
    ERROR: '오류',
    USER_DEFAULT: '사용자',
    MY_VIRTUAL_MONEY: '나의 가상 머니',
    MY_POINT: '나의 포인트',
    ACCOUNT_VIEW: '계좌보기',
    CHALLENGE_TITLE: '이번달 챌린지 확인하기',
  },
  
  // 투자 요약 데이터
  INVESTMENT_DATA: {
    EVALUATION_AMOUNT: '10,000,000',
    RETURN_RATE: '+33.6%',
    TOTAL_PURCHASE: '2,456,700',
  },
  
  // 로그 메시지
  LOG_MESSAGES: {
    USER_DATA_LOAD_START: '사용자 데이터 로드 시작...',
    USER_DATA_LOAD_SUCCESS: '사용자 정보 로드 성공:',
    USER_DATA_LOAD_FAIL: '사용자 정보 로드 실패:',
    POINT_LOAD_SUCCESS: '포인트 정보 로드 성공:',
    POINT_DATA_NOT_FOUND: '포인트 데이터가 없습니다. 기본값 0으로 설정합니다.',
    POINT_SAVE_FAIL: '포인트 저장 실패:',
    STREAK_LOAD_FAIL: '연속 출석일수 가져오기 실패:',
    USER_DATA_LOAD_COMPLETE: '사용자 데이터 로드 완료',
    USER_DATA_LOAD_ERROR: '사용자 데이터 로드 실패:',
  },
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  SERVER_ERROR: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  AUTH_ERROR: '로그인이 필요합니다. 다시 로그인해주세요.',
  PERMISSION_ERROR: '접근 권한이 없습니다.',
  NOT_FOUND_ERROR: '요청한 정보를 찾을 수 없습니다.',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;
