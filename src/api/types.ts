// REST API에서 받는 데이터
export interface StockCodeResponse {
    stockCode: string;
    stockName: string;
    marketCap: number;
    profileImageUrl?: string | null;
  }
  
  // WebSocket에서 받는 데이터
  export interface StockPriceData {
    code: string;
    currentPrice: number;
    priceChange: number;
    priceChangeRate: number;
  }
  