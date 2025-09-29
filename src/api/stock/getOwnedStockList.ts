import api from '../index';

export const getOwnedStockList = async () => {
    try {
        const response = await api.get(`/api/child/portfolio/stocks`);
        console.log('owned stock api success');
        return response.data;
    } catch (error) {
        console.error('Error fetching owned stock:', error);   
        throw error;
    }   
};