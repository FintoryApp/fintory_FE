import api from './index';
import { API_CONFIG } from './config';

export const checkAttendance = async () => {

    try {
        const response = await api.post(API_CONFIG.ENDPOINTS.CHECK_ATTENDANCE);
        return response.data;
    } catch (error) {
        console.error('Error checking attendance:', error);
        throw error;
    }
};
