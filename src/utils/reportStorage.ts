import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORT_EXISTS_KEY = 'report_exists';

// Report 존재 여부 저장
export const saveReportExists = async (exists: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(REPORT_EXISTS_KEY, JSON.stringify(exists));
    console.log('Report 존재 여부 저장됨:', exists);
  } catch (error) {
    console.error('Report 존재 여부 저장 실패:', error);
  }
};

// Report 존재 여부 불러오기
export const getReportExists = async (): Promise<boolean | null> => {
  try {
    const exists = await AsyncStorage.getItem(REPORT_EXISTS_KEY);
    if (exists === null) {
      return null;
    }
    return JSON.parse(exists);
  } catch (error) {
    console.error('Report 존재 여부 불러오기 실패:', error);
    return null;
  }
};

// Report 존재 여부 초기화
export const clearReportExists = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REPORT_EXISTS_KEY);
    console.log('Report 존재 여부 초기화됨');
  } catch (error) {
    console.error('Report 존재 여부 초기화 실패:', error);
  }
};

