import { useEffect, useState } from "react";
import { overseasStockChart } from "../api/stock/overseasStockChart";


export const useOverseasStockChart = (code: string, period: string) => {
  const [data, setData] = useState<any>(null); // chartData 전체 객체
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await overseasStockChart(code);
      //console.log('API Response:', JSON.stringify(res, null, 2));

      // chartData 전체를 전달 (기간별 데이터가 포함된 객체)
      const chartData = res?.data?.chartData || {};
      setData(chartData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [code, period]);

  return { data, loading, error, fetchData };
};
