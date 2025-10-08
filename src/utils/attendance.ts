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

// 현재 연속 출석일수 가져오기 (출석체크 여부와 관계없이)
export const getCurrentStreakDays = async () => {
  try {
    // 먼저 AsyncStorage에서 확인
    const savedStreakDays = await AsyncStorage.getItem('streakDays');
    if (savedStreakDays) {
      return parseInt(savedStreakDays, 10);
    }
    
    // AsyncStorage에 없으면 서버에서 가져오기
    const attendance = await checkAttendance();
    const days = Number(attendance?.data ?? 0);
    
    // 가져온 데이터를 AsyncStorage에 저장
    try {
      await AsyncStorage.setItem('streakDays', days.toString());
    } catch (storageError) {
      console.error('연속 출석일수 저장 실패:', storageError);
    }
    
    return days;
  } catch (error) {
    console.error('연속 출석일수 가져오기 오류:', error);
    return 0;
  }
};

// 출석체크 처리 (공통 함수)
export const handleAttendanceCheck = async (userEmail: string) => {
  try {
    // 오늘 이미 출석했는지 확인
    const alreadyCheckedToday = await hasCheckedAttendanceToday(userEmail);
    
    if (alreadyCheckedToday) {
      // 이미 출석했어도 현재 연속 출석일수는 가져와서 반환
      const currentStreakDays = await getCurrentStreakDays();
      return {
        success: true,
        message: '오늘 이미 출석체크를 완료했습니다.',
        streakDays: currentStreakDays,
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
      // 서버 호출 실패 시에도 현재 연속 출석일수는 가져와서 반환
      const currentStreakDays = await getCurrentStreakDays();
      return {
        success: false,
        message: '출석체크는 잠시 후 다시 시도해주세요',
        streakDays: currentStreakDays,
        alreadyChecked: false
      };
    }
  } catch (error) {
    console.error('출석체크 처리 오류:', error);
    // 에러 발생 시에도 현재 연속 출석일수는 가져와서 반환
    const currentStreakDays = await getCurrentStreakDays();
    return {
      success: false,
      message: '출석체크 중 오류가 발생했습니다',
      streakDays: currentStreakDays,
      alreadyChecked: false
    };
  }
};
