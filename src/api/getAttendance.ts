import api from './index';

export const getAttendance = async () => {
    try {
        const response = await api.get(`/api/child/attendance/attendance-logs`);
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
};