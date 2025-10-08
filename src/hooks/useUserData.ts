import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../api/auth';
import { getTotalPoint } from '../api/totalPoint';
import { handleApiError, showErrorAlert, ApiError } from '../utils/errorHandler';
import { MY_PAGE_CONSTANTS } from '../constants/MyPageConstants';
import { UserData, UserDataActions } from '../types/MyPageTypes';
import { getCurrentStreakDays } from '../utils/attendance';

export const useUserData = (): UserData & UserDataActions => {
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      console.log(MY_PAGE_CONSTANTS.LOG_MESSAGES.USER_DATA_LOAD_START);
      
      const [userResult, pointResult] = await Promise.all([
        getCurrentUser(),
        getTotalPoint()
      ]);
      
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
      // 새로운 함수를 사용하여 현재 연속 출석일수 가져오기
      const currentStreakDays = await getCurrentStreakDays();
      setStreakDays(currentStreakDays);
    } catch (error) {
      console.error(MY_PAGE_CONSTANTS.LOG_MESSAGES.STREAK_LOAD_FAIL, error);
      // 에러 발생 시 AsyncStorage에서 fallback 시도
      try {
        const savedStreakDays = await AsyncStorage.getItem(MY_PAGE_CONSTANTS.STORAGE_KEYS.STREAK_DAYS);
        if (savedStreakDays) {
          setStreakDays(parseInt(savedStreakDays, 10));
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
