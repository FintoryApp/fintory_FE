import * as scale from "d3-scale";
import { parseISO } from "date-fns";

type StockPoint = {
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  time: string; // "yyyy-MM-dd" 또는 "yyyy-MM-ddTHH:mm:ss" 등 ISO 호환
};

type ChartDataResponse = {
  [key: string]: StockPoint[];
};

type PeriodKey = "1D" | "1W" | "3M" | "1Y" | "5Y" | "total";

/** 차트용 데이터 만들기 */
export function makeChartData(chartData: ChartDataResponse, period: string) {
  // chartData 방어 코드
  if (!chartData || typeof chartData !== "object") {
    //console.log("chartData is null or invalid:", chartData);
    return [];
  }

  // period → key 매핑
  const periodToKey: Record<string, PeriodKey> = {
    "1일": "1D",
    "1주": "1W",
    "3달": "3M",
    "1년": "1Y",
    "5년": "5Y",
    "전체": "total",
  };

  const key: PeriodKey = periodToKey[period] ?? "total";
  const source = Array.isArray(chartData[key]) ? chartData[key] : [];

  if (source.length === 0) {
    return [];
  }

  // map → 유효값 필터 → 정렬(오름차순)
  const mapped = source
    .map((d, index) => {
      let x: Date;
      
      if (period === "1일") {
        // 1일 기간의 경우 한국 시간 기준으로 60분 전부터 시작
        const now = new Date();
        const kstOffset = 9 * 60; // 한국 시간대 UTC+9 (분 단위)
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const kstTime = new Date(utc + (kstOffset * 60000));
        
        // 현재 한국 시간에서 60분 전부터 시작 (최대 60개 데이터)
        const totalMinutes = 60; // 60분 전부터
        const minutesPerData = totalMinutes / Math.max(source.length, 1);
        const minutesFromStart = index * minutesPerData;
        
        // 시작 시간 계산 (현재 한국 시간 - 60분)
        const startTime = new Date(kstTime.getTime() - (totalMinutes * 60 * 1000));
        const dataTime = new Date(startTime.getTime() + (minutesFromStart * 60 * 1000));
        
        x = dataTime;
      } else {
        // 다른 기간은 기존 방식 사용
        x = parseISO(d.time);
      }
      
      const y = Number(d.closePrice ?? 0);
      return { x, y };
    })
    .filter(
      (p) =>
        p.x instanceof Date &&
        !isNaN(p.x.getTime()) &&
        typeof p.y === "number" &&
        isFinite(p.y)
    )
    .sort((a, b) => a.x.getTime() - b.x.getTime());

  return mapped;
}

/** X축 라벨 포맷 - 1일은 시간, 1주는 yyyy-mm-dd, 나머지는 yyyy.m 형식 */
export function formatXAxisLabel(date: Date, period: string, dataPoint?: any): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  
  if (period === "1일") {
    // 1일 기간은 시간 형식 (HH:mm)
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } else if (period === "1주") {
    // 1주 기간은 yyyy-mm-dd 형식
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } else {
    // 나머지 기간은 yyyy.m 형식
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}.${month}`;
  }
}

/** X축은 scaleTime 고정 (함수 참조를 그대로 export) */
export const xScale = scale.scaleTime;

/* =========================
 *  X축 라벨 간격 관련 유틸리티
 * ========================= */

/** 모든 기간에 대해 틱 개수를 3개로 고정 */
export function getNumberOfTicks(period: string): number {
  return 3;
}

/** 일반 기간용 X축 인덱스 선택 */
export function getSelectedXAxisIndices(chartData: any[], period: string): number[] {
  if (!chartData || chartData.length === 0) return [];
  const dataLength = chartData.length;
  const numberOfTicks = getNumberOfTicks(period);

  const indices = [0, dataLength - 1];
  if (dataLength > 2) {
    const step = (dataLength - 1) / (numberOfTicks - 1);
    for (let i = 1; i < numberOfTicks - 1; i++) {
      const idx = Math.round(i * step);
      if (idx > 0 && idx < dataLength - 1 && !indices.includes(idx)) {
        indices.push(idx);
      }
    }
  }
  return indices.sort((a, b) => a - b);
}
