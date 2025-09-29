import { useEffect, useState, useRef } from "react";
import webSocketService from "../api/webSocketService";
import { StockPriceData } from "../api/types";

// 현재 훅의 상태를 추적하기 위한 Ref
// 이 훅은 단일 연결을 관리하며, codes가 변경되어도 연결은 유지되어야 합니다.
export function useStockWebSocket(codes: string[]) {
  const [prices, setPrices] = useState<Record<string, StockPriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const isInitialConnect = useRef(true); // 최초 연결 시만 connect()를 호출하도록 제어

  // 1. 가격 업데이트 핸들러 (코드 변경 여부와 상관없이 동일)
  const handlePriceUpdate = (data: StockPriceData) => {
    // 단일 채널로 모든 데이터가 들어오므로, data.code를 키로 사용하여 상태를 업데이트합니다.
    setPrices(prevPrices => ({
      ...prevPrices,
      [data.code]: data
    }));
  };
  
  // 2. 연결 및 초기 구독 명령 (최초 마운트 시에만)
  useEffect(() => {
    if (!codes || codes.length === 0) {
      return;
    }

    const connectAndSubscribe = async () => {
      try {
        // 최초 진입 시에만 connect() 시도
        if (isInitialConnect.current || !webSocketService.isWebSocketConnected()) {
          console.log('websocket connect started for StockMainScreen');
          await webSocketService.connect();
          setIsConnected(true);
          setConnectionError(null);
          isInitialConnect.current = false; // 연결 성공 후 플래그 해제
          
          // 연결 성공 후, 단일 채널 구독 요청 (SUBSCRIBE 명령 포함)
          webSocketService.subscribeAllStocks(codes, handlePriceUpdate);
          
        } else {
          // 이미 연결된 상태라면, codes만 서버에 다시 전송하여 구독 목록 갱신을 명령 (SEND 명령)
          console.log('codes changed, sending updated subscription list to server.');
          webSocketService.send("/app/stock/subscribe-all", { stockCodes: codes });
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
        webSocketService.unsubscribeAllStocks(); // 서버에 구독 해제 명령 (SEND)
        webSocketService.disconnect();           // SockJS 연결 종료 (DISCONNECT)
      }
    };
  }, [codes]); 
  // codes가 변경될 때마다 useEffect가 실행되어 connectAndSubscribe 내부의 else 문(SEND 명령)을 실행합니다.

  return {
    prices,
    isConnected,
    connectionError,
  };
}
