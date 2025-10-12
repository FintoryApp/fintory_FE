import api from './index';

export const getMoneyList = async () => {
    try {
        const response = await api.get(`/api/child/account/deposit-transaction-list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching money list:', error);
        throw error;
    }
};