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
    setPrices(prevPrices => {
      const newPrices = {
        ...prevPrices,
        [data.code]: data
      };
      return newPrices;
    });
  };
  
  // 새로고침 시 웹소켓 재연결을 위한 함수
  const triggerReconnect = () => {
    setRefreshTrigger(prev => prev + 1);
    isInitialConnect.current = true; // 재연결 허용
  };

  // 2. 연결 및 구독 (주식 데이터가 로드된 후)
  useEffect(() => {
    // 주식 데이터가 없으면 웹소켓 연결하지 않음
    if (koreanStocks.length === 0 && overseasStocks.length === 0) {
      return;
    }

    const connectAndSubscribe = async () => {
      try {
        // 장 검사 API 호출하여 열린 장 확인
        const openedMarketResponse = await getOpenedMarket();
        const openedMarket = openedMarketResponse.data?.status;
        setMarketStatus(openedMarket); // 장 상태 저장
        
        // 모든 장이 닫혀있으면 웹소켓 연결하지 않음 (에러 아님)
        if (openedMarket === 'no') {
          setIsConnected(false);
          setConnectionError(null); // 장이 닫혀있는 것은 에러가 아님
          isInitialConnect.current = false;
          console.log('📡 [WEBSOCKET] 모든 장이 닫혀있어서 웹소켓 연결하지 않음');
          return;
        }
        
        // 최초 진입 시에만 connect() 시도
        if (isInitialConnect.current || !webSocketService.isWebSocketConnected()) {
          await webSocketService.connect();
          setIsConnected(true);
          setConnectionError(null);
          isInitialConnect.current = false; // 연결 성공 후 플래그 해제
        }
        
        // 현재 선택된 탭에 따라 해당 주식들만 구독
        const stocksToSubscribe = isKoreanTab ? koreanStocks : overseasStocks;
        const marketToCheck = isKoreanTab ? 'korean' : 'overseas';
        
        // 해당 시장이 열려있는지 확인
        const isMarketOpen = openedMarket === marketToCheck || openedMarket === 'both';
        
        if (isMarketOpen && stocksToSubscribe.length > 0) {
          webSocketService.subscribeToOpenedMarkets(
            openedMarket, 
            isKoreanTab ? koreanStocks : [], 
            isKoreanTab ? [] : overseasStocks, 
            handlePriceUpdate
          );
          console.log(`📡 [WEBSOCKET] ${marketToCheck} 시장 구독 완료`);
        } else {
          console.log(`📡 [WEBSOCKET] ${marketToCheck} 시장이 닫혀있어서 구독하지 않음`);
          // 시장이 닫혀있어서 구독하지 않는 것은 에러가 아님
          setConnectionError(null);
        }
        
      } catch (error) {
        setIsConnected(false);
        console.error('📡 [WEBSOCKET] 연결 실패:', error);
        setConnectionError('증권사 서버 점검 중입니다. 잠시 후 다시 시도해주세요.');
      }
    };

    connectAndSubscribe();
    
    // 3. 정리 함수 (화면 언마운트 시에만)
    return () => {
      // 훅이 언마운트될 때 항상 구독 해제 및 연결 종료
      console.log('📡 [WEBSOCKET] useWebsocket cleanup 함수 실행됨');
      webSocketService.disconnect(); // SockJS 연결 종료
      setIsConnected(false); // 연결 상태도 false로 설정
    };
  }, [koreanStocks.length, overseasStocks.length, isKoreanTab, refreshTrigger]); // 주식 데이터가 로드된 후 실행

  // 컴포넌트 언마운트 시 확실한 cleanup을 위한 별도 useEffect
  useEffect(() => {
    return () => {
      console.log('📡 [WEBSOCKET] useWebsocket 컴포넌트 언마운트 - 강제 disconnect');
      webSocketService.disconnect();
      setIsConnected(false);
    };
  }, []); // 빈 의존성 배열로 컴포넌트 언마운트 시에만 실행

  return {
    prices,
    isConnected,
    connectionError,
    marketStatus,
    triggerReconnect, // 새로고침 시 재연결을 위한 함수 노출
  };
}
