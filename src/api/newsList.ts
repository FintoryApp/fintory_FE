import api from './index';

export const getNewsList = async () => {
    try {
        const response = await api.get(`/news/getNewsList`);
        return response.data;
    } catch (error) {
        console.error('Error fetching news list:', error);
        throw error;
    }
};