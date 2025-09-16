import api from './index';

export const KoreanStock = async () => {
    try {
        const response = await api.get(`/api/child/stock/korean/rankings/market-cap`);
        return response.data;
    } catch (error) {
        console.error('Error fetching korean stock:', error);   
        throw error;
    }
};