import api from './index';

export const getWordList = async () => {
    try {
        const response = await api.get(`/api/child/financialword/get-word-list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching word list:', error);
        throw error;
    }
};