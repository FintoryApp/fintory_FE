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

      const wsUrl = "http://10.0.2.2:8080/ws-stomp";
      console.log("WebSocket 연결 시도:", wsUrl);

      this.sock = new SockJS(wsUrl);

      this.sock.onopen = () => {
        console.log("SockJS 열림");
        
        // STOMP CONNECT 프레임 전송
        const connectFrame = 
          "CONNECT\n" +
          "accept-version:1.0,1.1,1.2\n" +
          "heart-beat:10000,10000\n" +
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
      
      // 단일 채널로 들어오는 데이터이므로 destination 체크 후 단일 콜백 실행
      if (destination === LIVE_PRICES_TOPIC && this.priceUpdateCallback) {
        this.priceUpdateCallback(data as StockPriceData);
      } else {
        // 기존의 개별 구독(topic/...)을 처리하던 로직은 제거 (현재 플로우 불필요)
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
   * 클라이언트의 모든 주식(보유, 국내, 해외)에 대한 구독을 시작합니다.
   * 서버에 SEND 명령을 보내고, 단일 채널(/topic/stock/live-prices)을 구독합니다.
   */
  subscribeAllStocks(codes: string[], callback: (data: StockPriceData) => void): void {
    if (!this.isConnected) {
      this.pendingSubscribes.push(() => this.subscribeAllStocks(codes, callback));
      return;
    }
    
    // 1. 클라이언트 콜백 등록 (단일)
    this.priceUpdateCallback = callback;
    
    // 2. 메시지 브로커에 단일 채널 구독 요청 (STOMP SUBSCRIBE)
    // 이 채널로 모든 실시간 데이터가 들어옵니다.
    this.subscribe(LIVE_PRICES_TOPIC); 

    // 3. 서버의 /app 컨트롤러에 구독 시작 명령 전송 (STOMP SEND)
    // 서버는 이 코드를 받고 외부 API 연동 및 데이터 전송을 시작합니다.
    this.send("/app/stock/subscribe-all", { stockCodes: codes });
  }

  /**
   * 서버에 모든 주식 구독 해제 명령을 전송합니다.
   */
  unsubscribeAllStocks(): void {
    // 1. 서버에게 구독 중지 명령 전송 (서버는 외부 API 연결 정리 및 자원 해제)
    this.send("/app/stock/unsubscribe-all", {});
    
    // 2. 클라이언트 내부 상태 정리 (실제 연결은 useEffect cleanup에서 disconnect로 끊음)
    this.priceUpdateCallback = null;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
