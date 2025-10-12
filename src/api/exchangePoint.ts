import api from './index';
import { getTokens } from './auth';


export const exchangePoint = async (point: number) => {
    try {
        const token = await getTokens();
        const response = await api.post(`/api/child/point/exchange-point?point=${point}`, {},
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error exchanging point:', error);
        throw error;
    }
};