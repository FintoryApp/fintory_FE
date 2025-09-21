import { useEffect, useState } from "react";
import webSocketService from "../api/websocket";
import { StockPriceData } from "../api/types";

export function useStockWebSocket(
  codes: string[],
  marketType: "korean" | "overseas",
  autoConnect = true
) {
  const [prices, setPrices] = useState<Record<string, StockPriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (autoConnect && codes.length > 0) {
      let mounted = true;

      const connectWebSocket = async () => {
        try {
          console.log(`🚀 [${marketType}] WebSocket 연결 시도 시작...`);
          
          // WebSocket 연결 시도 (최초 연결이거나 재연결)
          await webSocketService.connect();
          
          console.log(`✅ [${marketType}] WebSocket 연결 성공 - 구독 시작`);
          
          if (!mounted) return;

          setIsConnected(true);
          setConnectionError(null);

          // ✅ 연결 후 구독
          if (marketType === "korean") {
            webSocketService.subscribeAllKoreanStocks(codes, (data) => {
              setPrices((prev) => ({ ...prev, [data.code]: data }));
            });
          } else {
            webSocketService.subscribeAllOverseasStocks(codes, (data) => {
              setPrices((prev) => ({ ...prev, [data.code]: data }));
            });
          }
        } catch (error) {
          if (!mounted) return;

          setConnectionError("실시간 데이터를 받을 수 없습니다.");
          setIsConnected(false);

          // 기본값 세팅
          const defaultPrices: Record<string, StockPriceData> = {};
          codes.forEach((code) => {
            defaultPrices[code] = {
              code,
              currentPrice: 0,
              priceChange: 0,
              priceChangeRate: 0,
            };
          });
          setPrices(defaultPrices);
        }
      };

      connectWebSocket();

      return () => {
        mounted = false;
        console.log(`🔌 [${marketType}] 화면 벗어남 - 구독 해제 시작`);

        // 👉 구독 해제
        if (codes.length > 0) {
          if (marketType === "korean") {
            webSocketService.unsubscribeAllKoreanStocks(codes);
            console.log(`📤 [${marketType}] 한국 주식 구독 해제 완료`);
          } else {
            webSocketService.unsubscribeAllOverseasStocks(codes);
            console.log(`📤 [${marketType}] 해외 주식 구독 해제 완료`);
          }
        }

        // WebSocket 연결 해제 (화면 벗어날 때)
        console.log(`🔌 [${marketType}] WebSocket 연결 해제`);
        webSocketService.disconnect();
        console.log(`✅ [${marketType}] 구독 및 연결 해제 완료`);
      };
    }
  }, [autoConnect, codes, marketType]);


  return { prices, isConnected, connectionError };
}
