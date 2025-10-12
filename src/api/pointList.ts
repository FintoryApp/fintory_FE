import api from './index';

export const getPointList = async () => {
    try {
        console.log('getPointList API 호출 시작');
        const response = await api.get(`/api/child/point/point-transactions`);
        console.log('getPointList API 응답 성공:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('getPointList API 호출 실패:', {
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
        
        // 401 에러인 경우 (인증 실패) - 토큰 문제일 가능성
        if (error.response?.status === 401) {
            console.error('포인트 리스트 API 인증 실패 - 토큰 문제일 가능성');
        }
        
        throw error;
    }
};