import api from './index';

export const getWordRandom = async () => {
    try {
        const response = await api.get(`/api/child/financialword/get-random-word`);
        return response.data;
    } catch (error) {
        console.error('Error fetching word random:', error);
        throw error;
    }
};  