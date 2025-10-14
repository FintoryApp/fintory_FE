import api from '../index';

export const overseasStockChart = async (code: string) => {
    try {
        const response = await api.get(`/api/child/stock/overseas/stockPriceHistory/${code}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching overseas stock chart:', error);   
        throw error;
    }   
};