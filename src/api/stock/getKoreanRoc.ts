import api from '../index';

export const getKoreanStock_roc = async () => {
    try {
        const response = await api.get(`/api/child/stock/korean/rankings/roc`);
        console.log('korean stock roc api success');
        return response.data;
    } catch (error) {
        console.error('Error fetching korean stock roc:', error);
        console.error('Error status:', (error as any).response?.status);
        console.error('Error data:', (error as any).response?.data);
        console.error('Error config:', (error as any).config);
        throw error;
    }
};