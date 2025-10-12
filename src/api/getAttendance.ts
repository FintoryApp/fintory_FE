import api from './index';
import { API_CONFIG } from './config';

export const getAttendance = async () => {
    try {
        const response = await api.get(API_CONFIG.ENDPOINTS.GET_ATTENDANCE);
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
};