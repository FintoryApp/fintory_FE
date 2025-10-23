import api from '../index';

export const getKoreanStock_roc = async () => {
    try {
        const response = await api.get(`/api/child/stock/korean/rankings/roc`);
        console.log('korean stock roc api success');
        return response.data;
    } catch (error) {
        // 500 에러는 서버 문제이므로 상세 로그는 개발 환경에서만 출력
        const status = (error as any).response?.status;
        if (status === 500) {
            console.log('Korean ROC API 서버 에러 (500) - 데이터 없음으로 처리');
        } else {
            console.error('Error fetching korean stock roc:', error);
            console.error('Error status:', status);
            console.error('Error data:', (error as any).response?.data);
        }
        throw error;
    }
};