import { useEffect, useState, useRef } from "react";
import webSocketService from "../api/webSocketService";
import { StockPriceData } from "../api/types";
import { getOpenedMarket } from "../api/stock/getOpenedMarket";

// 현재 훅의 상태를 추적하기 위한 Ref
// 이 훅은 단일 연결을 관리하며, codes가 변경되어도 연결은 유지되어야 합니다.
export function useStockWebSocket(koreanStocks: any[], overseasStocks: any[]) {
  const [prices, setPrices] = useState<Record<string, StockPriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const isInitialConnect = useRef(true); // 최초 연결 시만 connect()를 호출하도록 제어

  // 1. 가격 업데이트 핸들러
  const handlePriceUpdate = (data: StockPriceData) => {
    setPrices(prevPrices => ({
      ...prevPrices,
      [data.code]: data
    }));
  };
  
  // 2. 연결 및 구독 (최초 마운트 시에만)
  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        // 최초 진입 시에만 connect() 시도
        if (isInitialConnect.current || !webSocketService.isWebSocketConnected()) {
          console.log('websocket connect started for StockMainScreen');
          await webSocketService.connect();
          setIsConnected(true);
          setConnectionError(null);
          isInitialConnect.current = false; // 연결 성공 후 플래그 해제
          
          // 장 검사 API 호출하여 열린 장 확인
          const openedMarketResponse = await getOpenedMarket();
          console.log('열린 장:', openedMarketResponse);
          
          // API 응답에서 실제 상태값 추출
          const openedMarket = openedMarketResponse.data?.status;
          console.log('추출된 장 상태:', openedMarket);
          
          // 열린 장에 따라 해당 주식들만 구독
          webSocketService.subscribeToOpenedMarkets(openedMarket, koreanStocks, overseasStocks, handlePriceUpdate);
        }
        
      } catch (error) {
        setIsConnected(false);
        setConnectionError('실시간 데이터를 받을 수 없습니다.');
        console.error("WebSocket connection error:", error);
      }
    };

    connectAndSubscribe();
    
    // 3. 정리 함수 (화면 언마운트 시에만)
    return () => {
      // 훅이 언마운트될 때만 전체 구독 해제 및 연결 종료
      if (!isInitialConnect.current) {
        console.log('StockMainScreen unmounting. Disconnecting WebSocket.');
        webSocketService.disconnect(); // SockJS 연결 종료
      }
    };
  }, []); // 의존성 배열 제거 - 한 번만 실행

  return {
    prices,
    isConnected,
    connectionError,
  };
}
