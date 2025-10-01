import api from './index';

export const checkAttendance = async () => {
    try {
        // 인증 토큰 가져오기 (AsyncStorage에서)
        const token = await getAuthToken();
        
        const response = await api.post(`/api/child/attendance/check-in`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error checking attendance:', error);
        
        // 더 자세한 에러 정보 로깅
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request error:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        
        throw error;
    }   
};

// AsyncStorage에서 토큰 가져오는 함수
const getAuthToken = async (): Promise<string | null> => {
    try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};