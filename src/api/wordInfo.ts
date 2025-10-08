import api from './index';

export const getWordInfo = async (id:number) => {
    try {
        const response = await api.get(`/api/child/financialword/get-word/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching word info:', error);
        throw error;
    }
};  