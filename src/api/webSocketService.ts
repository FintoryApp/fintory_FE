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
        //console.log("이미 연결됨");
        resolve();
        return;
      }

      const wsUrl = "https://fintory.xyz/ws-sockjs";
      //console.log("WebSocket 연결 시도:", wsUrl);

      this.sock = new SockJS(wsUrl);

      this.sock.onopen = () => {
        //console.log("SockJS 열림");
        
        try {
          // STOMP CONNECT 프레임 전송
          const connectFrame = 
            "CONNECT\n" +
            "accept-version:1.0,1.1,1.2\n" +
            "heart-beat:50000,50000\n" +
            "\n" +
            "\x00";
          
          this.sock.send(connectFrame);
          //console.log("STOMP CONNECT 전송");
        } catch (error) {
          console.error("📡 [WEBSOCKET] STOMP CONNECT 프레임 전송 실패:", error);
          reject(error);
        }
      };

      this.sock.onmessage = (e: any) => {
        const data = e.data;
        // console.log("=== 웹소켓 메시지 수신 (원시) ===");
        // console.log("받은 데이터:", data);
        // console.log("데이터 타입:", typeof data);
        // console.log("데이터 길이:", data.length);
        // console.log("================================");
        
        if (data.startsWith("CONNECTED")) {
          //console.log("STOMP 연결 성공!");
          this.isConnected = true;
          
          if (this.pendingSubscribes.length > 0) {
            this.pendingSubscribes.forEach((fn) => fn());
            this.pendingSubscribes = [];
          }
          
          resolve();
          return;
        }

        if (data.startsWith("MESSAGE")) {
          //console.log("MESSAGE 프레임 감지 - handleMessage 호출");
          this.handleMessage(data);
        } else {
          //console.log("MESSAGE가 아닌 프레임:", data.substring(0, 50) + "...");
        }

        // Heartbeat 응답 처리
        if (data === "\n") {
          //console.log("Heartbeat 수신 - 응답 전송");
          this.sock.send("\n");
        }
      };

      this.sock.onerror = (error: any) => {
        //console.error("=== 웹소켓 에러 상세 ===");
        // console.error("에러 타입:", typeof error);
        // console.error("에러 객체:", error);
        // console.error("에러 메시지:", error?.message);
        // console.error("에러 코드:", error?.code);
        // console.error("에러 타입:", error?.type);
        // console.error("========================");
        reject(error);
      };

      this.sock.onclose = (event: any) => {
        // console.log("=== 웹소켓 연결 종료 ===");
        // console.log("종료 코드:", event?.code);
        // console.log("종료 이유:", event?.reason);
        // console.log("정상 종료:", event?.wasClean);
        // console.log("========================");
        this.isConnected = false;
      };
    });
  }

  private handleMessage(frame: string): void {
    try {
      // console.log("=== 웹소켓 메시지 수신 ===");
      // console.log("전체 프레임:", frame);
      
      const destMatch = frame.match(/destination:([^\n]+)/);
      if (!destMatch) {
        console.log("destination 매치 실패");
        return;
      }
      
      const destination = destMatch[1];
      console.log("destination:", destination);
      
      const parts = frame.split("\n\n");
      if (parts.length < 2) {
        console.log("프레임 파싱 실패 - parts 길이:", parts.length);
        return;
      }
      
      const body = parts[1].replace(/\x00$/, "");
      console.log("메시지 body:", body);
      
      const data = JSON.parse(body);
      // console.log("파싱된 데이터:", data);
      // console.log("데이터 타입:", typeof data);
      // console.log("데이터 키들:", Object.keys(data));
      
      // /topic/stock/live-Price/* 패턴으로 들어오는 모든 데이터 처리
      if (destination.startsWith("/topic/stock/live-Price/") && this.priceUpdateCallback) {
        // console.log("✅ 가격 업데이트 콜백 호출:", data);
        // console.log("✅ 주식 코드:", data.code);
        // console.log("✅ 현재 가격:", data.currentPrice);
        // console.log("✅ 가격 변화:", data.priceChange);
        // console.log("✅ 등락률:", data.priceChangeRate);
        this.priceUpdateCallback(data as StockPriceData);
      } else {
        // console.log("❌ 콜백 호출 안됨");
        // console.log("❌ destination:", destination);
        // console.log("❌ destination이 live-Price로 시작하는가:", destination.startsWith("/topic/stock/live-Price/"));
        // console.log("❌ callback 존재:", !!this.priceUpdateCallback);
      }
      //console.log("========================");

    } catch (error) {
      // console.error("파싱 오류:", error);
    }
  }

  // 이 메서드는 외부에서는 사용하지 않고 내부에서만 사용됩니다.
  private subscribe(topic: string): void {
    if (!this.isConnected || !this.sock) {
      //console.error("📡 [WEBSOCKET] 연결되지 않음 - 구독 실패");
      return;
    }

    // SockJS 연결 상태 추가 체크
    if (this.sock.readyState !== 1) { // 1 = OPEN
      //console.error("📡 [WEBSOCKET] SockJS 연결 상태가 OPEN이 아님:", this.sock.readyState);
      return;
    }

    // console.log("=== 구독 요청 ===");
    // console.log("구독할 토픽:", topic);

    // 메시지 브로커에 구독 요청
    const subscribeFrame =
      "SUBSCRIBE\n" +
      `id:sub-live-prices\n` + // 고정된 ID 사용 (단일 구독)
      `destination:${topic}\n` +
      "\n" +
      "\x00";

    try {
      // console.log("구독 프레임:", subscribeFrame);
      this.sock.send(subscribeFrame);
      // console.log("구독 요청 전송 완료");
      // console.log("==================");
    } catch (error) {
      console.error("📡 [WEBSOCKET] 구독 프레임 전송 실패:", error);
    }
    // subscriptions 맵 사용 로직은 제거됨
  }

  send(destination: string, body: any = {}): void {
    if (!this.isConnected || !this.sock) {
      console.error("📡 [WEBSOCKET] 연결되지 않음 - 메시지 전송 실패");
      return;
    }

    // SockJS 연결 상태 추가 체크
    if (this.sock.readyState !== 1) { // 1 = OPEN
      console.error("📡 [WEBSOCKET] SockJS 연결 상태가 OPEN이 아님:", this.sock.readyState);
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

    try {
      this.sock.send(sendFrame);
    } catch (error) {
      console.error("📡 [WEBSOCKET] 메시지 전송 실패:", error);
    }
  }

  disconnect(): void {
    console.log('📡 [WEBSOCKET] disconnect() 호출됨');
    
    if (this.sock) {
      try {
        // 1. 서버에 DISCONNECT 프레임 전송 (구독 해제)
        if (this.sock.readyState === 1) { // OPEN 상태일 때만
          this.sock.send("DISCONNECT\n\n\x00");
          console.log('📡 [WEBSOCKET] DISCONNECT 프레임 전송 완료');
        }
      } catch (error) {
        console.error("📡 [WEBSOCKET] DISCONNECT 프레임 전송 실패:", error);
      }
      
      try {
        // 2. SockJS 연결 종료
        this.sock.close(); 
        console.log('📡 [WEBSOCKET] SockJS 연결 종료 완료');
      } catch (error) {
        console.error("📡 [WEBSOCKET] SockJS 연결 종료 실패:", error);
      }
      
      // 3. 상태 정리
      this.isConnected = false;
      this.priceUpdateCallback = null; // 콜백 정리
      this.sock = null;
      console.log('📡 [WEBSOCKET] 웹소켓 상태 정리 완료');
    } else {
      console.log('📡 [WEBSOCKET] 이미 연결이 해제된 상태');
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * 열린 장에 따라 해당 주식들만 구독합니다.
   * @param openedMarket - 열린 장 정보 ('korean', 'overseas', 'both', 'no' 중 하나)
   * @param koreanStocks - 국내 주식 리스트 (API에서 가져온 데이터)
   * @param overseasStocks - 해외 주식 리스트 (API에서 가져온 데이터)
   * @param callback - 가격 업데이트 콜백
   */
  subscribeToOpenedMarkets(openedMarket: string, koreanStocks: any[], overseasStocks: any[], callback: (data: StockPriceData) => void): void {
    // console.log('=== 구독 시작 ===');
    // console.log('openedMarket:', openedMarket);
    // console.log('koreanStocks 개수:', koreanStocks.length);
    // console.log('overseasStocks 개수:', overseasStocks.length);
    console.log('isConnected:', this.isConnected);
    
    if (!this.isConnected) {
      //console.log('웹소켓 연결되지 않음 - pending에 추가');
      this.pendingSubscribes.push(() => this.subscribeToOpenedMarkets(openedMarket, koreanStocks, overseasStocks, callback));
      return;
    }
    
    // 1. 클라이언트 콜백 등록
    this.priceUpdateCallback = callback;
    //console.log('콜백 등록 완료');
    
    // 2. 열린 장에 따라 해당 주식들만 구독
    if (openedMarket === 'korean' && koreanStocks.length > 0) {
      //console.log('국내 주식만 구독 시작');
      koreanStocks.forEach(stock => {
        //console.log('국내 주식 구독:', stock.stockCode);
        this.subscribe(`/topic/stock/live-Price/${stock.stockCode}`);
      });
      //console.log('국내 주식 구독 완료:', koreanStocks.length, '개');
    }
    
    if (openedMarket === 'overseas' && overseasStocks.length > 0) {
      // console.log('해외 주식만 구독 시작');
      overseasStocks.forEach(stock => {
        // console.log('해외 주식 구독:', stock.stockCode);
        this.subscribe(`/topic/stock/live-Price/${stock.stockCode}`);
      });
      // console.log('해외 주식 구독 완료:', overseasStocks.length, '개');
    }
    
    // 두 장이 모두 열려있는 경우 추가
    if (openedMarket === 'both') {
      // console.log('국내/해외 주식 모두 구독 시작');
      
      if (koreanStocks.length > 0) {
        koreanStocks.forEach(stock => {
          // console.log('국내 주식 구독:', stock.stockCode);
          this.subscribe(`/topic/stock/live-Price/${stock.stockCode}`);
        });
        // console.log('국내 주식 구독 완료:', koreanStocks.length, '개');
      }
      
      if (overseasStocks.length > 0) {
        overseasStocks.forEach(stock => {
          // console.log('해외 주식 구독:', stock.stockCode);
          this.subscribe(`/topic/stock/live-Price/${stock.stockCode}`);
        });
        // console.log('해외 주식 구독 완료:', overseasStocks.length, '개');
      }
    }
    
    if (openedMarket === 'no') {
      // console.log('모든 장이 닫혀있음 - 구독하지 않음');
    }
    
    // console.log('=== 구독 완료 ===');
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
