import { Alert } from 'react-native';

export interface ApiError {
  response?: {
    status: number;
    statusText: string;
    data: any;
  };
  request?: any;
  message?: string;
}

export const handleApiError = (error: ApiError) => {
  console.error('API 에러 발생:', error);
  
  // 에러 타입별 상세 로깅
  if (error.response) {
    console.error('서버 응답 에러:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    });
    
    // 상태 코드별 로깅
    switch (error.response.status) {
      case 500:
        console.error('서버 내부 오류 (500) - 백엔드 서버에 문제가 있습니다.');
        break;
      case 401:
        console.error('인증 오류 (401) - 로그인이 필요합니다.');
        break;
      case 403:
        console.error('권한 오류 (403) - 접근 권한이 없습니다.');
        break;
      case 404:
        console.error('리소스를 찾을 수 없음 (404)');
        break;
      default:
        console.error(`HTTP 에러 (${error.response.status}): ${error.response.statusText}`);
    }
  } else if (error.request) {
    console.error('네트워크 요청 실패:', error.request);
  } else {
    console.error('요청 설정 에러:', error.message);
  }
};

export const showErrorAlert = (error: ApiError) => {
  if (!error.response) return;
  
  const { status } = error.response;
  
  switch (status) {
    case 500:
      Alert.alert(
        '서버 오류',
        '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        [{ text: '확인' }]
      );
      break;
    case 401:
      Alert.alert(
        '인증 오류',
        '로그인이 필요합니다. 다시 로그인해주세요.',
        [{ text: '확인' }]
      );
      break;
    case 403:
      Alert.alert(
        '권한 오류',
        '접근 권한이 없습니다.',
        [{ text: '확인' }]
      );
      break;
    case 404:
      Alert.alert(
        '리소스 없음',
        '요청한 정보를 찾을 수 없습니다.',
        [{ text: '확인' }]
      );
      break;
    default:
      Alert.alert(
        '오류',
        '알 수 없는 오류가 발생했습니다.',
        [{ text: '확인' }]
      );
  }
};

export const getErrorMessage = (error: ApiError): string => {
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 500: return '서버 오류가 발생했습니다.';
      case 401: return '인증이 필요합니다.';
      case 403: return '접근 권한이 없습니다.';
      case 404: return '요청한 정보를 찾을 수 없습니다.';
      default: return '알 수 없는 오류가 발생했습니다.';
    }
  } else if (error.request) {
    return '네트워크 연결을 확인해주세요.';
  } else {
    return error.message || '알 수 없는 오류가 발생했습니다.';
  }
};
