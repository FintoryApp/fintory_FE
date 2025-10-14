import { useEffect, useState, useRef } from "react";
import webSocketService from "../api/webSocketService";
import { StockPriceData } from "../api/types";
import { getOpenedMarket } from "../api/stock/getOpenedMarket";

// 현재 훅의 상태를 추적하기 위한 Ref
// 이 훅은 단일 연결을 관리하며, codes가 변경되어도 연결은 유지되어야 합니다.
export function useStockWebSocket(koreanStocks: any[], overseasStocks: any[], isKoreanTab: boolean = true) {
  const [prices, setPrices] = useState<Record<string, StockPriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [marketStatus, setMarketStatus] = useState<string>('unknown');
  const isInitialConnect = useRef(true); // 최초 연결 시만 connect()를 호출하도록 제어
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 새로고침 트리거

  // 1. 가격 업데이트 핸들러
  const handlePriceUpdate = (data: StockPriceData) => {
    console.log("=== 가격 업데이트 수신 ===");
    console.log("받은 데이터:", data);
    console.log("주식 코드:", data.code);
    console.log("현재 가격:", data.currentPrice);
    console.log("가격 변화:", data.priceChange);
    console.log("등락률:", data.priceChangeRate);
    console.log("데이터 타입:", typeof data);
    console.log("데이터 키들:", Object.keys(data));
    
    setPrices(prevPrices => {
      const newPrices = {
        ...prevPrices,
        [data.code]: data
      };
      console.log("업데이트된 prices:", newPrices);
      console.log("업데이트된 prices 키들:", Object.keys(newPrices));
      return newPrices;
    });
    console.log("========================");
  };
  
  // 새로고침 시 웹소켓 재연결을 위한 함수
  const triggerReconnect = () => {
    console.log('새로고침으로 인한 웹소켓 재연결 트리거');
    setRefreshTrigger(prev => prev + 1);
    isInitialConnect.current = true; // 재연결 허용
  };

  // 2. 연결 및 구독 (주식 데이터가 로드된 후)
  useEffect(() => {
    // 주식 데이터가 없으면 웹소켓 연결하지 않음
    if (koreanStocks.length === 0 && overseasStocks.length === 0) {
      console.log('주식 데이터가 없음 - 웹소켓 연결하지 않음');
      return;
    }

    const connectAndSubscribe = async () => {
      try {
        // 장 검사 API 호출하여 열린 장 확인
        const openedMarketResponse = await getOpenedMarket();
        console.log('=== 장 상태 확인 ===');
        console.log('열린 장 응답:', openedMarketResponse);
        console.log('응답 전체 구조:', JSON.stringify(openedMarketResponse, null, 2));
        
        // API 응답에서 실제 상태값 추출
        const openedMarket = openedMarketResponse.data?.status;
        console.log('추출된 장 상태:', openedMarket);
        setMarketStatus(openedMarket); // 장 상태 저장
        console.log('국내 주식 개수:', koreanStocks.length);
        console.log('해외 주식 개수:', overseasStocks.length);
        console.log('국내 주식 코드들:', koreanStocks.map(s => s.stockCode));
        console.log('해외 주식 코드들:', overseasStocks.map(s => s.stockCode));
        console.log('==================');
        
        // 모든 장이 닫혀있으면 웹소켓 연결하지 않음
        if (openedMarket === 'no') {
          console.log('모든 장이 닫혀있음 - 웹소켓 연결하지 않음');
          setIsConnected(false);
          setConnectionError(null);
          isInitialConnect.current = false;
          return;
        }
        
        // 최초 진입 시에만 connect() 시도
        if (isInitialConnect.current || !webSocketService.isWebSocketConnected()) {
          console.log('websocket connect started for StockMainScreen');
          await webSocketService.connect();
          setIsConnected(true);
          setConnectionError(null);
          isInitialConnect.current = false; // 연결 성공 후 플래그 해제
        }
        
        // 현재 선택된 탭에 따라 해당 주식들만 구독
        console.log('=== 구독 시작 ===');
        console.log('현재 탭:', isKoreanTab ? '국내' : '해외');
        console.log('구독할 주식들:', { koreanStocks: koreanStocks.length, overseasStocks: overseasStocks.length });
        
        // 선택된 탭에 따라 구독할 주식 결정
        const stocksToSubscribe = isKoreanTab ? koreanStocks : overseasStocks;
        const marketToCheck = isKoreanTab ? 'korean' : 'overseas';
        
        // 해당 시장이 열려있는지 확인
        const isMarketOpen = openedMarket === marketToCheck || openedMarket === 'both';
        
        if (isMarketOpen && stocksToSubscribe.length > 0) {
          console.log(`${isKoreanTab ? '국내' : '해외'} 주식 구독 시작:`, stocksToSubscribe.length, '개');
          webSocketService.subscribeToOpenedMarkets(
            openedMarket, 
            isKoreanTab ? koreanStocks : [], 
            isKoreanTab ? [] : overseasStocks, 
            handlePriceUpdate
          );
        } else {
          console.log(`${isKoreanTab ? '국내' : '해외'} 장이 닫혀있거나 주식이 없음 - 구독하지 않음`);
        }
        
        console.log('구독 완료');
        console.log('===============');
        
      } catch (error) {
        setIsConnected(false);
        console.error("=== 웹소켓 연결 실패 상세 ===");
        console.error("에러 타입:", typeof error);
        console.error("에러 객체:", error);
        console.error("에러 메시지:", (error as any)?.message);
        console.error("에러 스택:", (error as any)?.stack);
        console.error("=============================");
        setConnectionError(`연결 실패: ${(error as any)?.message || '알 수 없는 오류'}`);
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
  }, [koreanStocks.length, overseasStocks.length, isKoreanTab, refreshTrigger]); // 주식 데이터가 로드된 후 실행

  return {
    prices,
    isConnected,
    connectionError,
    marketStatus,
    triggerReconnect, // 새로고침 시 재연결을 위한 함수 노출
  };
}
