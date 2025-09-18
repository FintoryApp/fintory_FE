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
    console.log(
      `[${marketType}] useStockWebSocket 실행됨 | autoConnect=${autoConnect} | codes.length=${codes.length}`,
      codes
    );

    if (autoConnect && codes.length > 0) {
      let mounted = true;

      const connectWebSocket = async () => {
        try {
          console.log(`🚀 [${marketType}] 웹소켓 연결 시도...`);
          await webSocketService.connect(); // ✅ 연결 시도
          if (!mounted) return;

          setIsConnected(true);
          setConnectionError(null);
          console.log(`[${marketType}] 웹소켓 연결 성공`);

          // ✅ 연결 후 구독
          if (marketType === "korean") {
            console.log(`[${marketType}] 구독 요청 코드:`, codes);
            webSocketService.subscribeAllKoreanStocks(codes, (data) => {
              console.log("[korean] 데이터 수신:", data);
              setPrices((prev) => ({ ...prev, [data.code]: data }));
            });
          } else {
            console.log(`[${marketType}] 구독 요청 코드:`, codes);
            webSocketService.subscribeAllOverseasStocks(codes, (data) => {
              console.log("[overseas] 데이터 수신:", data);
              setPrices((prev) => ({ ...prev, [data.code]: data }));
            });
          }
        } catch (error) {
          console.log(`[${marketType}] 웹소켓 연결 실패:`, error);
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
          console.log(`[${marketType}] 기본 가격 세팅`, defaultPrices);
          setPrices(defaultPrices);
        }
      };

      connectWebSocket();

      return () => {
        mounted = false;
        console.log(`[${marketType}] cleanup 실행 | codes.length=${codes.length}`);

        // 👉 코드 변경 시에는 구독 해제만 실행
        if (codes.length > 0) {
          if (marketType === "korean") {
            webSocketService.unsubscribeAllKoreanStocks(codes);
          } else {
            webSocketService.unsubscribeAllOverseasStocks(codes);
          }
        }

        // 컴포넌트 unmount 될 때만 disconnect 실행
        // cleanup이 여러 번 호출되므로 setTimeout으로 unmount 타이밍 확인
        // 컴포넌트 언마운트 타이밍 확인
        setTimeout(() => {
          if (!mounted) {
            console.log(`[${marketType}] 컴포넌트 언마운트 → disconnect 실행`);
            webSocketService.disconnect();
          }
        }, 0);
      };
    }
  }, [autoConnect, codes, marketType]);

  // state 변화 추적 로그
  useEffect(() => {
    console.log(`[${marketType}] prices 업데이트:`, prices);
  }, [prices]);

  useEffect(() => {
    console.log(`[${marketType}] codes 변경됨:`, codes);
  }, [codes]);

  return { prices, isConnected, connectionError };
}
