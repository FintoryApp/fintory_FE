// 마이페이지 관련 타입 정의

export interface UserData {
  nickname: string;
  email: string;
  streakDays: number;
  isLoading: boolean;
  hasError: boolean;
}

export interface UserDataActions {
  refreshUserData: () => Promise<void>;
}

export interface PointCardProps {
  totalPoint: number;
  onPress: () => void;
  isLoading?: boolean;
  hasError?: boolean;
}

export interface InvestmentItemProps {
  label: string;
  value: string;
}

export interface VirtualMoneyCardProps {
  onPress: () => void;
}

export interface ChallengeCardProps {
  onPress?: () => void;
}

// API 응답 타입
export interface ApiResponse<T> {
  resultCode: string;
  data?: T;
  message?: string;
}

// 사용자 정보 타입
export interface UserInfo {
  nickname: string;
  username: string;
  email?: string;
}

// 포인트 정보 타입
export interface PointInfo {
  totalPoint: number;
}

// 에러 타입
export interface ApiError {
  response?: {
    status: number;
    statusText: string;
    data: any;
  };
  request?: any;
  message?: string;
}
