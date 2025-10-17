import api from '../index';

export const createPriceAlerts = async (data: {stockCode:string,targetPrice:number}) => {
    try {
        const response = await api.post(`/api/child/price-alerts`, data);
        console.log('create price alerts api success');
        return response.data;
    } catch (error) {
        console.error('Error creating price alerts:', error);   
        throw error;
    }
};