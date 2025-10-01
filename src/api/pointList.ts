import api from './index';

export const getPointList = async () => {
    try {
        const response = await api.get(`/api/child/point/point-transactions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching point list:', error);
        throw error;
    }
};