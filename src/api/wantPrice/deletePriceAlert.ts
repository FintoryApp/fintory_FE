import api from '../index';

export const deletePriceAlert = async (priceAlertId:number) => {
    try {
        const response = await api.delete(`/api/child/price-alerts/${priceAlertId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting price alert:', error);   
        throw error;
    }
};