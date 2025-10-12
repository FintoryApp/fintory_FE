import { API_CONFIG } from '../config';
import api from '../index';

export const getExchangeRate = async () => {
    try {
        console.log('=== getExchangeRate API 요청 시작 ===');
        console.log('요청 URL:', API_CONFIG.ENDPOINTS.EXCHANGE_RATE);
        const response = await api.get(API_CONFIG.ENDPOINTS.EXCHANGE_RATE);
        console.log('exchange rate api success');
        console.log('응답 데이터:', response.data);
        console.log('응답 상태:', response.status);
        return response.data;
    } catch (error) {
        console.error('=== getExchangeRate API 에러 ===');
        console.error('Error fetching exchange rate:', error);
        console.error('Error status:', (error as any).response?.status);
        console.error('Error data:', (error as any).response?.data);
        console.error('Error config:', (error as any).config);
        console.error('Error message:', (error as any).message);
        throw error;
    }
};