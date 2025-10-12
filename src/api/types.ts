// API 응답 기본 구조
export interface ApiResponse<T> {
  resultCode: string;
  data: T;
  message: string;
}

// 주식 기본 정보
export interface StockInfo {
  stockCode: string;
  stockName: string;
  profileImageUrl?: string | null;
  rank:number;
}

// 시가총액 주식 정보 (marketCap, priceChange, priceChangeRate 추가)
export interface MarketCapStockInfo extends StockInfo {
  marketCap: number;
  currentPrice: number;
}

// 등락률 주식 정보 (rank, priceChange, priceChangeRate 추가)
export interface RocStockInfo extends StockInfo {
  closePrice: number;
}

// 보유 주식 정보
export interface OwnedStockInfo extends StockInfo {
  averagePrice: number;
  quantity: number;
  isKorean: boolean;
  priceChange: number;
  priceChangeRate: number;
}

// WebSocket에서 받는 실시간 가격 데이터
export interface StockPriceData {
  code: string;
  currentPrice: number;
}

// 기존 호환성을 위한 타입 (deprecated)
export interface StockCodeResponse {
  stockCode: string;
  stockName: string;
  marketCap: number;
  profileImageUrl?: string | null;
}
  