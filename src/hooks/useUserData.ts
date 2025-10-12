import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../api/auth';
import { getTotalPoint } from '../api/totalPoint';
import { handleApiError, showErrorAlert, ApiError } from '../utils/errorHandler';
import { MY_PAGE_CONSTANTS } from '../constants/MyPageConstants';
import { UserData, UserDataActions } from '../types/MyPageTypes';
import {checkAttendance} from '../api/checkAttendance';

export const useUserData = (): UserData & UserDataActions => {
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // 포인트 로드 재시도 함수
  const loadPointWithRetry = async (maxRetries: number = 3): Promise<any> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`포인트 정보 조회 시도 ${attempt}/${maxRetries}`);
        
        // 토큰 확인
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          console.warn(`시도 ${attempt}: AccessToken이 없습니다.`);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 500 * attempt)); // 점진적 대기
            continue;
          }
          throw new Error('AccessToken이 없습니다.');
        }
        
        const pointResult = await getTotalPoint();
        console.log(`포인트 정보 조회 성공 (시도 ${attempt}):`, pointResult);
        return pointResult;
        
      } catch (pointError: any) {
        console.warn(`포인트 정보 조회 실패 (시도 ${attempt}):`, {
          error: pointError,
          status: pointError?.response?.status,
          message: pointError?.message
        });
        
        if (attempt === maxRetries) {
          console.error('모든 포인트 조회 시도가 실패했습니다. 기본값을 반환합니다.');
          return { data: 0 };
        }
        
        // 다음 시도 전 대기 (점진적 백오프)
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
    return { data: 0 };
  };

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      console.log(MY_PAGE_CONSTANTS.LOG_MESSAGES.USER_DATA_LOAD_START);
      
      // 먼저 사용자 정보를 가져온 후, 토큰이 확실히 설정된 후 포인트 정보를 가져옴
      const userResult = await getCurrentUser();
      console.log('사용자 정보 조회 결과:', userResult);
      
      let pointResult = null;
      if (userResult.resultCode === 'SUCCESS') {
        // 사용자 정보 조회 성공 시에만 포인트 정보 조회 (재시도 로직 포함)
        pointResult = await loadPointWithRetry();
      } else {
        console.warn('사용자 정보 조회 실패로 인해 포인트 정보를 조회하지 않습니다.');
        pointResult = { data: 0 }; // 기본값 설정
      }
      
      console.log('API 응답 결과:', { userResult, pointResult });
      
      // 사용자 정보 처리
      if (userResult.resultCode === 'SUCCESS' && userResult.data) {
        setNickname(userResult.data.nickname || '');
        setEmail(userResult.data.username || '');
        console.log(MY_PAGE_CONSTANTS.LOG_MESSAGES.USER_DATA_LOAD_SUCCESS, userResult.data);
      } else {
        console.warn(MY_PAGE_CONSTANTS.LOG_MESSAGES.USER_DATA_LOAD_FAIL, userResult.message);
      }
      
      // 포인트 정보 처리
      if (pointResult.data !== undefined) {
        setTotalPoint(pointResult.data);
        console.log(MY_PAGE_CONSTANTS.LOG_MESSAGES.POINT_LOAD_SUCCESS, pointResult.data);
        await savePointToStorage(pointResult.data);
      } else {
        console.log(MY_PAGE_CONSTANTS.LOG_MESSAGES.POINT_DATA_NOT_FOUND);
        setTotalPoint(MY_PAGE_CONSTANTS.DEFAULT_VALUES.TOTAL_POINT);
        await savePointToStorage(MY_PAGE_CONSTANTS.DEFAULT_VALUES.TOTAL_POINT);
      }
      
      // 연속 출석일수 가져오기
      await loadStreakDays();
      
      console.log(MY_PAGE_CONSTANTS.LOG_MESSAGES.USER_DATA_LOAD_COMPLETE);
      setIsLoading(false);
      
    } catch (error: any) {
      handleUserDataError(error);
    }
  };

  const savePointToStorage = async (point: number) => {
    try {
      await AsyncStorage.setItem(MY_PAGE_CONSTANTS.STORAGE_KEYS.TOTAL_POINT, point.toString());
    } catch (error) {
      console.error(MY_PAGE_CONSTANTS.LOG_MESSAGES.POINT_SAVE_FAIL, error);
    }
  };

  const loadStreakDays = async () => {
    try {
      // checkAttendance API 호출하여 연속 출석일수 가져오기
      const response = await checkAttendance();
      console.log('연속 출석일수 조회 결과:', response);
      
      // API 응답 구조에 맞게 연속일수 추출
      if (response.resultCode === 'SUCCESS' && response.data) {
        setStreakDays(response.data.continuousDays || 0);
        // AsyncStorage에 저장
        await AsyncStorage.setItem(MY_PAGE_CONSTANTS.STORAGE_KEYS.STREAK_DAYS, (response.data.continuousDays || 0).toString());
      } else {
        console.warn('연속 출석일수 조회 실패:', response.message);
        setStreakDays(0);
      }
    } catch (error) {
      console.error(MY_PAGE_CONSTANTS.LOG_MESSAGES.STREAK_LOAD_FAIL, error);
      // 에러 발생 시 AsyncStorage에서 fallback 시도
      try {
        const savedStreakDays = await AsyncStorage.getItem(MY_PAGE_CONSTANTS.STORAGE_KEYS.STREAK_DAYS);
        if (savedStreakDays) {
          setStreakDays(parseInt(savedStreakDays, 10));
        } else {
          setStreakDays(0);
        }
      } catch (fallbackError) {
        console.error('Fallback streak days load failed:', fallbackError);
        setStreakDays(0);
      }
    }
  };

  const handleUserDataError = (error: ApiError) => {
    console.error(MY_PAGE_CONSTANTS.LOG_MESSAGES.USER_DATA_LOAD_ERROR, error);
    
    // 에러 처리 및 로깅
    handleApiError(error);
    
    // 사용자에게 에러 알림 표시
    showErrorAlert(error);
    
    // 에러 발생 시에도 기본값 설정
    setTotalPoint(MY_PAGE_CONSTANTS.DEFAULT_VALUES.TOTAL_POINT);
    setNickname('');
    setEmail('');
    setHasError(true);
    setIsLoading(false);
  };

  const refreshUserData = async () => {
    await loadUserData();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return {
    nickname,
    email,
    totalPoint,
    streakDays,
    isLoading,
    hasError,
    refreshUserData
  };
};
