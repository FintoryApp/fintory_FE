import api from './index';

export const getReport = async (reportMonth:string) => {
    try {
        const response = await api.get(`/consulting/${reportMonth}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
};