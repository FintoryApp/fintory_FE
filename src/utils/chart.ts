import * as scale from "d3-scale";
import { parseISO } from "date-fns";

type StockPoint = {
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  time: string; // "yyyy-mm-dd"
};

type ChartDataResponse = {
  [key: string]: StockPoint[];
};


export function makeChartData(chartData: ChartDataResponse, period: string) {
  // chartData가 null이거나 undefined인 경우 처리
  if (!chartData || typeof chartData !== 'object') {
    console.log('chartData is null or invalid:', chartData);
    return [{ x: new Date(), y: 0 }];
  }

  let key: string;

  switch (period) {
    case "1일":
      key = "1D";
      break;
    case "1주":
      key = "1W";
      break;
    case "3달":
      key = "3M";
      break;
    case "1년":
      key = "1Y";
      break;
    case "5년":
      key = "5Y";
      break;
    case "전체":
      key = "total";
      break;
    default:
      key = "";
  }

  const source = chartData[key as keyof ChartDataResponse] ?? [];

  console.log("makeChartData => keys:", Object.keys(chartData));
  console.log("Requested period:", period, "mapped key:", key, "data length:", source.length);
  

  if (!Array.isArray(source) || source.length === 0) {
    return [{ x: new Date(), y: 0 }];
  }

  return source.map((d) => ({
    x: parseISO(d.time),
    y: Number(d.closePrice ?? 0),
  }));
}






/** X축 라벨 포맷 (기간별) */
export function formatXAxisLabel(date: Date, period: string): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  switch (period) {
    case "1일":
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    case "1주":
    case "3달":
      return `${date.getMonth() + 1}/${date.getDate()}`;
    case "1년":
      return `${date.getMonth() + 1}월`;
    case "5년":
    case "전체":
      return `${date.getFullYear()}`;
    default:
      return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}


/** X축은 scaleTime 고정 */
export const xScale = scale.scaleTime;
