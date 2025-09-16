import { useEffect, useState } from "react";
import webSocketService from "../api/websocket";
import { StockPriceData } from "../api/types";

export function useStockWebSocket(codes: string[], autoConnect = true) {
  const [prices, setPrices] = useState<Record<string, StockPriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (autoConnect && codes.length > 0) {
      const connectWebSocket = async () => {
        try {
          // 웹소켓 연결 시도
          await webSocketService.connect();
          setIsConnected(true);
          setConnectionError(null);
          console.log("웹소켓 연결 성공");

          // 구독 시작
          codes.forEach((code) => {
            webSocketService.subscribeToStockPrice(code, (data) => {
              setPrices((prev) => ({ ...prev, [data.code]: data }));
            });
          });

        } catch (error) {
          console.log("웹소켓 연결 실패 (장 마감 등):", error);
          setConnectionError("장 마감으로 실시간 데이터를 받을 수 없습니다.");
          setIsConnected(false);
          
          // 기본 데이터로 초기화
          const defaultPrices: Record<string, StockPriceData> = {};
          codes.forEach((code) => {
            defaultPrices[code] = {
              code,
              currentPrice: 0,
              priceChange: 0,
              priceChangeRate: 0
            };
          });
          setPrices(defaultPrices);
        }
      };

      connectWebSocket();
    }

    return () => {
      codes.forEach((code) => {
        webSocketService.unsubscribeFromStockPrice(code);
      });
      webSocketService.disconnect();
    };
  }, [autoConnect, codes]);

  return { prices, isConnected, connectionError };
}