import api from '../index';

export const getOpenedMarket = async () => {
    try {
        const response = await api.get(`/api/child/stock/opened-market`);
        console.log('opened market api success');
        return response.data;
    } catch (error) {
        console.error('Error fetching opened market:', error);   
        throw error;
    }
};