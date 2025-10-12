import api from './index';

export const getTotalPoint = async () => {
    try {
        console.log('getTotalPoint API 호출 시작');
        const response = await api.get(`/api/child/point/total-point`);
        console.log('getTotalPoint API 응답 성공:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('getTotalPoint API 호출 실패:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            }
        });
        
        // 404 에러인 경우 (포인트 데이터가 아직 생성되지 않은 경우) 기본값 반환
        if (error.response?.status === 404) {
            console.log('포인트 데이터가 아직 생성되지 않았습니다. 기본값 0을 반환합니다.');
            return { data: 0 };
        }
        
        // 401 에러인 경우 (인증 실패) - 토큰 문제일 가능성
        if (error.response?.status === 401) {
            console.error('포인트 API 인증 실패 - 토큰 문제일 가능성');
        }
        
        // 다른 에러는 그대로 throw
        throw error;
    }
};