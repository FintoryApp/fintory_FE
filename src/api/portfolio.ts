import api from './index';

export const getPortfolio = async () => {
    try {
        const response = await api.get(`/api/child/portfolio`);
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        throw error;
    }
};