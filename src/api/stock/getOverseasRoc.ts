import api from '../index';

export const getOverseasStock_roc = async () => {
    try {
        const response = await api.get(`/api/child/stock/overseas/rankings/roc`);
        console.log('overseas stock roc api success');
        return response.data;
    } catch (error) {
        // 500 에러는 서버 문제이므로 상세 로그는 개발 환경에서만 출력
        const status = (error as any).response?.status;
        if (status === 500) {
            console.log('Overseas ROC API 서버 에러 (500) - 데이터 없음으로 처리');
        } else {
            console.error('Error fetching overseas stock roc:', error);
        }
        throw error;
    }
};
