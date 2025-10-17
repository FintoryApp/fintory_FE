import api from '../index';

export const watchPriceAlert = async (stockCode:string) => {
    try {
        const response = await api.get(`/api/child/price-alerts/${stockCode}`);
        return response.data;
    } catch (error) {
        console.error('Error watching price alert:', error);   
        throw error;
    }
};