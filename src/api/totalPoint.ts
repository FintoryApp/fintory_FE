import api from './index';

export const getTotalPoint = async () => {
    try {
        const response = await api.get(`/api/child/point/total-point`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching total point:', error);
        
        // 404 에러인 경우 (포인트 데이터가 아직 생성되지 않은 경우) 기본값 반환
        if (error.response?.status === 404) {
            console.log('포인트 데이터가 아직 생성되지 않았습니다. 기본값 0을 반환합니다.');
            return { data: 0 };
        }
        
        // 다른 에러는 그대로 throw
        throw error;
    }
};