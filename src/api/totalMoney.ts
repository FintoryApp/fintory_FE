import api from './index';

export const getTotalMoney = async () => {
    try {
        const response = await api.get(`/api/child/account/total-cash`);
        return response.data;
    } catch (error) {
        console.error('Error fetching total money:', error);
        throw error;
    }
};