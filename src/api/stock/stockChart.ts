import api from '../index';

export const StockChart = async (code: string) => {
    try {
        const response = await api.get(`/api/child/stock/korean/stockPriceHistory/${code}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock chart:', error);   
        throw error;
    }   
};