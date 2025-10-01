import api from './index';

export const getNewsDetail = async (id:number) => {
    try {
        const response = await api.get(`/api/child/news/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching news list:', error);
        throw error;
    }
};