import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTING_KEY = 'notification_enabled';

// 알림 설정 저장
export const saveNotificationSetting = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTING_KEY, JSON.stringify(enabled));
    console.log('알림 설정 저장됨:', enabled);
  } catch (error) {
    console.error('알림 설정 저장 실패:', error);
  }
};

// 알림 설정 불러오기
export const getNotificationSetting = async (): Promise<boolean> => {
  console.log('🔍 [DEBUG] getNotificationSetting 함수 시작');
  console.log('🔍 [DEBUG] NOTIFICATION_SETTING_KEY:', NOTIFICATION_SETTING_KEY);
  
  try {
    console.log('🔍 [DEBUG] AsyncStorage.getItem 호출 중...');
    const setting = await AsyncStorage.getItem(NOTIFICATION_SETTING_KEY);
    console.log('🔍 [DEBUG] AsyncStorage에서 가져온 값:', setting);
    
    if (setting === null) {
      console.log('🔍 [DEBUG] 설정값이 null, 기본값 true 반환');
      // 기본값은 true (알림 허용)
      return true;
    }
    
    const parsedSetting = JSON.parse(setting);
    console.log('🔍 [DEBUG] 파싱된 설정값:', parsedSetting);
    return parsedSetting;
  } catch (error) {
    console.error('❌ [DEBUG] 알림 설정 불러오기 실패:', error);
    console.log('🔍 [DEBUG] 에러 시 기본값 true 반환');
    // 에러 시 기본값은 true
    return true;
  }
};

// 알림 설정 초기화 (로그아웃 시)
export const clearNotificationSetting = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_SETTING_KEY);
    console.log('알림 설정 초기화됨');
  } catch (error) {
    console.error('알림 설정 초기화 실패:', error);
  }
};
