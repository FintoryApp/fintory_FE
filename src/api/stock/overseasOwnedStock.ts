import api from '../index';

export const getOverseasOwnedStockList = async () => {
    try {
        const response = await api.get(`/api/child/portfolio/overseas`);
        console.log('overseas owned stock api success');
        return response.data;
    } catch (error) {
        console.error('Error fetching overseas owned stock:', error);   
        throw error;
    }   
};