import SockJS from "sockjs-client";
import { StockPriceData } from "./types";

const LIVE_PRICES_TOPIC = "/topic/stock/live-prices";

class WebSocketService {
  private sock: any = null;
  private isConnected: boolean = false;
  // 단일 채널 구독 모델이므로, 콜백을 Map 대신 단일 속성에 저장합니다.
  private priceUpdateCallback: ((data: StockPriceData) => void) | null = null;
  
  private messageId = 0;
  private pendingSubscribes: (() => void)[] = [];

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.sock) {
        console.log("이미 연결됨");
        resolve();
        return;
      }

      const wsUrl = "http://10.0.2.2:8080/ws-sockjs";
      console.log("WebSocket 연결 시도:", wsUrl);

      this.sock = new SockJS(wsUrl);

      this.sock.onopen = () => {
        console.log("SockJS 열림");
        
        // STOMP CONNECT 프레임 전송
        const connectFrame = 
          "CONNECT\n" +
          "accept-version:1.0,1.1,1.2\n" +
          "heart-beat:50000,50000\n" +
          "\n" +
          "\x00";
        
        this.sock.send(connectFrame);
        console.log("STOMP CONNECT 전송");
      };

      this.sock.onmessage = (e: any) => {
        const data = e.data;
        
        if (data.startsWith("CONNECTED")) {
          console.log("STOMP 연결 성공!");
          this.isConnected = true;
          
          if (this.pendingSubscribes.length > 0) {
            this.pendingSubscribes.forEach((fn) => fn());
            this.pendingSubscribes = [];
          }
          
          resolve();
          return;
        }

        if (data.startsWith("MESSAGE")) {
          this.handleMessage(data);
        }

        // Heartbeat 응답 처리
        if (data === "\n") {
          console.log("Heartbeat 수신 - 응답 전송");
          this.sock.send("\n");
        }
      };

      this.sock.onerror = (error: any) => {
        console.error("오류:", error);
        reject(error);
      };

      this.sock.onclose = () => {
        console.log("연결 종료");
        this.isConnected = false;
      };
    });
  }

  private handleMessage(frame: string): void {
    try {
      const destMatch = frame.match(/destination:([^\n]+)/);
      if (!destMatch) return;
      
      const destination = destMatch[1];
      const parts = frame.split("\n\n");
      if (parts.length < 2) return;
      
      const body = parts[1].replace(/\x00$/, "");
      const data = JSON.parse(body);
      
      // /topic/stock/live-Price/* 패턴으로 들어오는 모든 데이터 처리
      if (destination.startsWith("/topic/stock/live-Price/") && this.priceUpdateCallback) {
        this.priceUpdateCallback(data as StockPriceData);
      }

    } catch (error) {
      console.error("파싱 오류:", error);
    }
  }

  // 이 메서드는 외부에서는 사용하지 않고 내부에서만 사용됩니다.
  private subscribe(topic: string): void {
    if (!this.isConnected || !this.sock) {
      console.error("연결되지 않음");
      return;
    }

    // 메시지 브로커에 구독 요청
    const subscribeFrame =
      "SUBSCRIBE\n" +
      `id:sub-live-prices\n` + // 고정된 ID 사용 (단일 구독)
      `destination:${topic}\n` +
      "\n" +
      "\x00";

    this.sock.send(subscribeFrame);
    // subscriptions 맵 사용 로직은 제거됨
  }

  send(destination: string, body: any = {}): void {
    if (!this.isConnected || !this.sock) {
      console.error("연결되지 않음");
      return;
    }

    const bodyStr = JSON.stringify(body);
    const sendFrame =
      "SEND\n" +
      `destination:${destination}\n` +
      "content-type:application/json\n" +
      `content-length:${bodyStr.length}\n` +
      "\n" +
      bodyStr +
      "\x00";

    this.sock.send(sendFrame);
  }

  disconnect(): void {
    if (this.sock) {
      // 1. 서버에 DISCONNECT 프레임 전송 (구독 해제)
      this.sock.send("DISCONNECT\n\n\x00");
      // 2. SockJS 연결 종료
      this.sock.close(); 
      // 3. 상태 정리
      this.isConnected = false;
      this.priceUpdateCallback = null; // 콜백 정리
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * 열린 장에 따라 해당 주식들만 구독합니다.
   * @param openedMarket - 열린 장 정보 ('korean', 'overseas', 'no' 중 하나)
   * @param koreanStocks - 국내 주식 리스트 (API에서 가져온 데이터)
   * @param overseasStocks - 해외 주식 리스트 (API에서 가져온 데이터)
   * @param callback - 가격 업데이트 콜백
   */
  subscribeToOpenedMarkets(openedMarket: string, koreanStocks: any[], overseasStocks: any[], callback: (data: StockPriceData) => void): void {
    if (!this.isConnected) {
      this.pendingSubscribes.push(() => this.subscribeToOpenedMarkets(openedMarket, koreanStocks, overseasStocks, callback));
      return;
    }
    
    // 1. 클라이언트 콜백 등록
    this.priceUpdateCallback = callback;
    
    // 2. 열린 장에 따라 해당 주식들만 구독
    if (openedMarket === 'korean' && koreanStocks.length > 0) {
      // 국내 주식만 구독
      koreanStocks.forEach(stock => {
        this.subscribe(`/topic/stock/live-Price/${stock.stockCode}`);
      });
      console.log('국내 주식 구독 완료:', koreanStocks.length, '개');
    }
    
    if (openedMarket === 'overseas' && overseasStocks.length > 0) {
      console.log('해외 주식 구독 시작:', overseasStocks.length, '개');
      // 해외 주식만 구독
      overseasStocks.forEach(stock => {
        this.subscribe(`/topic/stock/live-Price/${stock.stockCode}`);
      });
      console.log('해외 주식 구독 완료:', overseasStocks.length, '개');
    }
    
    if (openedMarket === 'no') {
      // 모든 장이 닫힘 - 구독하지 않음
      console.log('모든 장이 닫혀있음 - 구독하지 않음');
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
