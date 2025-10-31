import api from './index';
import { saveReportExists } from '../utils/reportStorage';

export const getReport = async (reportMonth:string) => {
    try {
        const response = await api.get(`/api/child/consulting/${reportMonth}`);
        const responseData = response.data;
        
        // 응답이 {"resultCode": "SUCCESS"}만 있고 데이터가 없는 경우
        if (responseData && responseData.resultCode === 'SUCCESS' && !responseData.data) {
            // 로컬에 report가 없다는 것을 false로 저장
            await saveReportExists(false);
        } else if (responseData && responseData.resultCode === 'SUCCESS' && responseData.data) {
            // 데이터가 있으면 true로 저장
            await saveReportExists(true);
        }
        
        return responseData;
    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
};