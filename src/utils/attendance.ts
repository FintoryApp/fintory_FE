import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAttendance } from '../api/checkAttendance';

// 로컬 타임존 기준 YYYY-MM-DD
export const getTodayStringLocal = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// 유저별 키 생성
export const getAttendanceKey = (userEmail: string) =>
  `lastAttendanceCheck:${userEmail.toLowerCase().trim()}`;

// 오늘 이미 출석했는지 확인
export const hasCheckedAttendanceToday = async (userEmail: string) => {
  try {
    const key = getAttendanceKey(userEmail);
    const last = await AsyncStorage.getItem(key);
    return last === getTodayStringLocal();
  } catch (e) {
    console.error('출석체크 날짜 확인 오류:', e);
    return false;
  }
};

// 오늘 출석 저장
export const saveAttendanceCheckDate = async (userEmail: string) => {
  try {
    const key = getAttendanceKey(userEmail);
    await AsyncStorage.setItem(key, getTodayStringLocal());
  } catch (e) {
    console.error('출석체크 날짜 저장 오류:', e);
  }
};

// 출석체크 처리 (공통 함수)
export const handleAttendanceCheck = async (userEmail: string) => {
  try {
    // 오늘 이미 출석했는지 확인
    const alreadyCheckedToday = await hasCheckedAttendanceToday(userEmail);
    
    if (alreadyCheckedToday) {
      return {
        success: true,
        message: '오늘 이미 출석체크를 완료했습니다.',
        streakDays: 0,
        alreadyChecked: true
      };
    }

    // 오늘 아직 출석 전이면 서버에 호출
    try {
      const attendance = await checkAttendance();
      const days = Number(attendance?.data ?? 0);
      await saveAttendanceCheckDate(userEmail);
      
      // 연속 출석일수를 AsyncStorage에 저장
      try {
        await AsyncStorage.setItem('streakDays', days.toString());
      } catch (storageError) {
        console.error('연속 출석일수 저장 실패:', storageError);
      }
      
      return {
        success: true,
        message: `연속출석일수: ${days}일`,
        streakDays: days,
        alreadyChecked: false
      };
    } catch (e) {
      console.warn('checkAttendance 호출 실패:', e);
      return {
        success: false,
        message: '출석체크는 잠시 후 다시 시도해주세요',
        streakDays: 0,
        alreadyChecked: false
      };
    }
  } catch (error) {
    console.error('출석체크 처리 오류:', error);
    return {
      success: false,
      message: '출석체크 중 오류가 발생했습니다',
      streakDays: 0,
      alreadyChecked: false
    };
  }
};
