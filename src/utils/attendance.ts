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

// // 유저별 키 생성
// export const getAttendanceKey = (userEmail: string) =>
//   `lastAttendanceCheck:${userEmail.toLowerCase().trim()}`;

// // 오늘 이미 출석했는지 확인
// export const hasCheckedAttendanceToday = async (userEmail: string) => {
//   try {
//     const key = getAttendanceKey(userEmail);
//     const last = await AsyncStorage.getItem(key);
//     return last === getTodayStringLocal();
//   } catch (e) {
//     console.error('출석체크 날짜 확인 오류:', e);
//     return false;
//   }
// };

// // 오늘 출석 저장
// export const saveAttendanceCheckDate = async (userEmail: string) => {
//   try {
//     const key = getAttendanceKey(userEmail);
//     await AsyncStorage.setItem(key, getTodayStringLocal());
//   } catch (e) {
//     console.error('출석체크 날짜 저장 오류:', e);
//   }
// };

// // 현재 연속 출석일수 가져오기 (출석체크 여부와 관계없이)
// export const getCurrentStreakDays = async () => {
//   try {
//     // 먼저 AsyncStorage에서 확인
//     const savedStreakDays = await AsyncStorage.getItem('streakDays');
//     if (savedStreakDays) {
//       return parseInt(savedStreakDays, 10);
//     }
    
//     // AsyncStorage에 없으면 기본값 0 반환 (출석체크 API는 연속 출석일수를 반환하지 않음)
//     console.log('연속 출석일수 데이터가 없습니다. 기본값 0을 반환합니다.');
//     return 0;
//   } catch (error) {
//     console.error('연속 출석일수 가져오기 오류:', error);
//     return 0;
//   }
// };

// // 출석체크 처리 (공통 함수)
// export const handleAttendanceCheck = async (userEmail: string) => {
//   try {
//     // 오늘 이미 출석했는지 확인
//     const alreadyCheckedToday = await hasCheckedAttendanceToday(userEmail);
    
//     if (alreadyCheckedToday) {
//       // 이미 출석했어도 현재 연속 출석일수는 가져와서 반환
//       const currentStreakDays = await getCurrentStreakDays();
//       return {
//         success: true,
//         message: '오늘 이미 출석체크를 완료했습니다.',
//         streakDays: currentStreakDays,
//         alreadyChecked: true
//       };
//     }

//     // 오늘 아직 출석 전이면 서버에 호출
//     try {
//       const attendance = await checkAttendance();
//       console.log('출석체크 API 응답:', attendance);
      
//       // 출석체크 성공 시 로컬에 저장
//       await saveAttendanceCheckDate(userEmail);
      
//       // 현재 연속 출석일수 가져오기 (AsyncStorage에서)
//       const currentStreakDays = await getCurrentStreakDays();
      
//       return {
//         success: true,
//         message: '출석체크가 완료되었습니다.',
//         streakDays: currentStreakDays,
//         alreadyChecked: false
//       };
//     } catch (e: any) {
//       console.warn('checkAttendance 호출 실패:', e);
      
//       // 500 에러인 경우 특별한 메시지 제공
//       let errorMessage = '출석체크는 잠시 후 다시 시도해주세요';
//       if (e?.response?.status === 500) {
//         errorMessage = '출석체크 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요';
//       } else if (e?.response?.status === 401) {
//         errorMessage = '인증에 문제가 있습니다. 다시 로그인해주세요';
//       }
      
//       // 서버 호출 실패 시에도 현재 연속 출석일수는 가져와서 반환
//       const currentStreakDays = await getCurrentStreakDays();
//       return {
//         success: false,
//         message: errorMessage,
//         streakDays: currentStreakDays,
//         alreadyChecked: false
//       };
//     }
//   } catch (error) {
//     console.error('출석체크 처리 오류:', error);
//     // 에러 발생 시에도 현재 연속 출석일수는 가져와서 반환
//     const currentStreakDays = await getCurrentStreakDays();
//     return {
//       success: false,
//       message: '출석체크 중 오류가 발생했습니다',
//       streakDays: currentStreakDays,
//       alreadyChecked: false
//     };
//   }
// };

export const handleAttendanceCheck = async (userEmail: string) => {
  try {
    // 출석체크 API 호출
    const attendance = await checkAttendance();
    
    // API 응답에 따라 처리
    if (attendance.data?.isCheckedIn === true) {
      // 이미 출석체크 완료된 경우
      return {
        success: false,
        message: '오늘 이미 출석체크를 완료했습니다.',
        streakDays: attendance.data?.continuousDays || 0,
        alreadyChecked: true
      };
    } else {
      // 출석체크가 필요한 경우 (isCheckedIn: false)
      return {
        success: true,
        message: attendance.message || '출석체크가 완료되었습니다.',
        streakDays: attendance.data?.continuousDays || 0,
        alreadyChecked: false
      };
    }
  } catch (error: any) {
    // 400 에러인 경우 (이미 출석체크 완료)
    if (error?.response?.status === 400 && error?.response?.data?.code === 'ALREADY_CHECKED_IN') {
      return {
        success: false,
        message: '오늘 이미 출석체크를 완료했습니다.',
        streakDays: 0,
        alreadyChecked: true
      };
    }
    
    // 기타 에러 (500, 401 등)
    let errorMessage = '출석체크 중 오류가 발생했습니다.';
    if (error?.response?.status === 500) {
      errorMessage = '출석체크 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.';
    } else if (error?.response?.status === 401) {
      errorMessage = '인증에 문제가 있습니다. 다시 로그인해주세요.';
    }
    
    return {
      success: false,
      message: errorMessage,
      streakDays: 0,
      alreadyChecked: false
    };
  }
};
