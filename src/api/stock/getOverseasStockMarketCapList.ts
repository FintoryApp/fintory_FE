import api from '../index';

export const getOverseasStock_marketCap = async () => {
    try {
        const response = await api.get(`/api/child/stock/overseas/rankings/market-cap`);
        console.log('overseas stock market cap api success');
        return response.data;
    } catch (error) {
        console.error('Error fetching overseas stock:', error);   
        throw error;
    }   
};