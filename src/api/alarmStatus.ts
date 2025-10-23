import api from './index';

// 알림 설정 상태를 백엔드에 전송
export const updateAlarmStatus = async (isAlarm: boolean, accessToken: string) => {
  try {
    const response = await api.post('/api/child/alarm/status', 
      { isAlarm }, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('알림 설정 상태 업데이트 성공:', response.data);
    
    // 백엔드 응답 구조 확인
    if (response.data.resultCode === 'SUCCESS') {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || '알림 설정이 업데이트되었습니다.'
      };
    } else {
      throw new Error('알림 설정 상태 업데이트 실패: ' + (response.data.message || '알 수 없는 오류'));
    }
  } catch (error) {
    console.error('알림 설정 상태 업데이트 실패:', error);
    throw error;
  }
};

// 백엔드에서 알림 설정 상태 조회
export const getAlarmStatus = async (accessToken: string) => {
  try {
    const response = await api.get('/api/child/alarm/status', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    console.log('알림 설정 상태 조회 성공:', response.data);
    
    // 백엔드 응답 구조에 맞춰서 데이터 추출
    if (response.data.resultCode === 'SUCCESS' && response.data.data) {
      return {
        isAlarm: response.data.data.isAlarm
      };
    } else {
      throw new Error('알림 설정 상태 조회 실패: ' + (response.data.message || '알 수 없는 오류'));
    }
  } catch (error) {
    console.error('알림 설정 상태 조회 실패:', error);
    throw error;
  }
};
