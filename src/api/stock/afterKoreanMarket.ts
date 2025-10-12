import api from '../index';

export const getKoreanStock_livePrice = async (code: number) => {
    try {
        const response = await api.get(`/api/child/stock/korean/live-price/${code}`);
        console.log('korean stock live price api success');
        return response.data;
    } catch (error) {
        console.error('Error fetching korean stock live price:', error);   
        throw error;
    }
};