import AsyncStorage from '@react-native-async-storage/async-storage';

// 실시간 주식 데이터를 로컬 스토리지에 저장/불러오기
export const STOCK_DATA_KEYS = {
  KOREAN_REALTIME_DATA: 'korean_realtime_data',
  OVERSEAS_REALTIME_DATA: 'overseas_realtime_data',
  LAST_UPDATE_TIME: 'last_update_time',
} as const;

export interface RealtimeStockData {
  [stockCode: string]: {
    code: string;
    currentPrice: number;
    priceChange: number;
    priceChangeRate: number;
    timestamp: number; //추가 필드드
  };
}

// 실시간 데이터 저장
export const saveRealtimeData = async (
  data: RealtimeStockData,
  isKorean: boolean
): Promise<void> => {
  try {
    const key = isKorean ? STOCK_DATA_KEYS.KOREAN_REALTIME_DATA : STOCK_DATA_KEYS.OVERSEAS_REALTIME_DATA;
    await AsyncStorage.setItem(key, JSON.stringify(data));
    await AsyncStorage.setItem(STOCK_DATA_KEYS.LAST_UPDATE_TIME, Date.now().toString());
    // console.log(`[LOCAL STORAGE] ${isKorean ? '국내' : '해외'} 실시간 데이터 저장 완료:`, Object.keys(data).length, '개');
  } catch (error) {
    // console.error('[LOCAL STORAGE] 실시간 데이터 저장 실패:', error);
  }
};

// 실시간 데이터 불러오기
export const loadRealtimeData = async (isKorean: boolean): Promise<RealtimeStockData> => {
  try {
    const key = isKorean ? STOCK_DATA_KEYS.KOREAN_REALTIME_DATA : STOCK_DATA_KEYS.OVERSEAS_REALTIME_DATA;
    const data = await AsyncStorage.getItem(key);
    if (data) {
      const parsedData = JSON.parse(data);
      // console.log(`[LOCAL STORAGE] ${isKorean ? '국내' : '해외'} 실시간 데이터 불러오기 완료:`, Object.keys(parsedData).length, '개');
      return parsedData;
    }
    return {};
  } catch (error) {
    // console.error('[LOCAL STORAGE] 실시간 데이터 불러오기 실패:', error);
    return {};
  }
};

// 마지막 업데이트 시간 불러오기
export const getLastUpdateTime = async (): Promise<number> => {
  try {
    const time = await AsyncStorage.getItem(STOCK_DATA_KEYS.LAST_UPDATE_TIME);
    return time ? parseInt(time, 10) : 0;
  } catch (error) {
    // console.error('[LOCAL STORAGE] 마지막 업데이트 시간 불러오기 실패:', error);
    return 0;
  }
};

// 로컬 스토리지 데이터 삭제
export const clearRealtimeData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STOCK_DATA_KEYS.KOREAN_REALTIME_DATA,
      STOCK_DATA_KEYS.OVERSEAS_REALTIME_DATA,
      STOCK_DATA_KEYS.LAST_UPDATE_TIME,
    ]);
    // console.log('[LOCAL STORAGE] 실시간 데이터 삭제 완료');
  } catch (error) {
    // console.error('[LOCAL STORAGE] 실시간 데이터 삭제 실패:', error);
  }
};

// 데이터가 오래되었는지 확인 (5분 이상)
export const isDataStale = async (): Promise<boolean> => {
  try {
    const lastUpdate = await getLastUpdateTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5분
    return (now - lastUpdate) > fiveMinutes;
  } catch (error) {
    // console.error('[LOCAL STORAGE] 데이터 유효성 확인 실패:', error);
    return true;
  }
};
