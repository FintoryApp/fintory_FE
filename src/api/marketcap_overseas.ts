import api from './index';

export const OverseasStock_marketCap = async () => {
    try {
        const response = await api.get(`/api/child/stock/overseas/rankings/market-cap`);
        return response.data;
    } catch (error) {
        console.error('Error fetching overseas stock:', error);   
        throw error;
    }   
};