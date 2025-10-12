import api from '../index';

export const getOverseasStock_roc = async () => {
    try {
        const response = await api.get(`/api/child/stock/overseas/rankings/roc`);
        console.log('overseas stock roc api success');
        return response.data;
    } catch (error) {
        console.error('Error fetching overseas stock roc:', error);   
        throw error;
    }
};
