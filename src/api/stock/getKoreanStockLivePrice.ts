import api from '../index';

export const getKoreanStock_livePrice = async (code: string) => {
    console.log('🔍 [DEBUG] getKoreanStock_livePrice called with code:', code);
    console.log('🔍 [DEBUG] API URL:', `/api/child/stock/korean/live-price/${code}`);
    
    try {
        console.log('🚀 [DEBUG] Making API request...');
        const response = await api.get(`/api/child/stock/korean/live-price/${code}`);
        console.log('✅ [DEBUG] korean stock live price api success');
        console.log('📊 [DEBUG] Response data:', response.data);
        console.log('📊 [DEBUG] Response status:', response.status);
        return response.data;
    } catch (error: any) {
        console.error('❌ [ERROR] Error fetching korean stock live price');
        console.error('❌ [ERROR] Stock code:', code);
        console.error('❌ [ERROR] Full error object:', error);
        console.error('❌ [ERROR] Error message:', error.message);
        console.error('❌ [ERROR] Error status:', error.response?.status);
        console.error('❌ [ERROR] Error data:', error.response?.data);
        console.error('❌ [ERROR] Error config:', error.response?.config);
        console.error('❌ [ERROR] Error request URL:', error.config?.url);
        console.error('❌ [ERROR] Error request method:', error.config?.method);
        throw error;
    }
};