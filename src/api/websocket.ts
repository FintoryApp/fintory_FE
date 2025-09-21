import { Client } from "@stomp/stompjs";

// React Native에서 사용할 수 있는 WebSocket
// @ts-ignore
const WebSocket = global.WebSocket || require('react-native-websocket');

export interface StockPriceData {
  code: string;
  currentPrice: number;
  priceChange: number;
  priceChangeRate: number;
}

class WebSocketService {
  private stompClient: Client | null = null;
  private isConnected: boolean = false;
  private subscriptions: Map<string, any> = new Map();


  private pendingSubscribes: (() => void)[] = [];


  //웹소켓 연결
  connect(): Promise<void> {
  return new Promise((resolve, reject) => {

    if (this.isConnected && this.stompClient) {
      console.log("이미 연결됨, connect 재호출 무시");
      resolve();
      return;
    }

    const wsUrl = "wss://fintory.xyz/ws";
    console.log("🔍 WebSocket 연결 시도 - URL:", wsUrl);

    
    try {
      this.stompClient = new Client({
        webSocketFactory: () => {
          const ws = new WebSocket(wsUrl);
          
          ws.onopen = (event: any) => {
            console.log("✅ WebSocket 연결 성공 - URL:", wsUrl);
          };
          
          ws.onerror = (error: any) => {
            console.error("❌ WebSocket 연결 실패 - URL:", wsUrl, "오류:", JSON.stringify(error));
          };
          
          ws.onclose = (event: any) => {
            console.log("🔌 WebSocket 연결 종료 - 코드:", event.code, "이유:", event.reason);
          };
          
          return ws;
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = (frame) => {
        console.log("🎉 STOMP 연결 성공!");
        this.isConnected = true;

        if (this.pendingSubscribes.length > 0) {
          this.pendingSubscribes.forEach((fn) => fn());
          this.pendingSubscribes = [];
        }

        resolve();
      };

      this.stompClient.onStompError = (frame) => {
        console.error("❌ STOMP 프로토콜 오류:", JSON.stringify(frame));
        this.isConnected = false;
        reject(frame);
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error("❌ WebSocket 레벨 오류:", JSON.stringify(error));
        this.isConnected = false;
        reject(error);
      };

      this.stompClient.onDisconnect = () => {
        console.log("🔌 STOMP 연결 해제됨");
        this.isConnected = false;
      };

      this.stompClient.activate();
    } catch (error) {
      console.error("❌ WebSocket 초기화 실패:", JSON.stringify(error));
      reject(error);
    }
  });
}


  //연결 해제 
  disconnect(): void {
    if (this.stompClient) {
      this.subscriptions.forEach((subscription, topic) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.stompClient.deactivate();
      this.isConnected = false;
      console.log("🔌 WebSocket 연결 해제 완료");
    }
  }

  //토픽 구독
  subscribe(topic: string, callback: (message: any) => void): void {
    if (!this.isConnected || !this.stompClient) {
      console.error("❌ WebSocket이 연결되지 않았습니다.");
      return;
    }

    try {
      const subscription = this.stompClient.subscribe(topic, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error("❌ 메시지 파싱 오류:", error);
          callback(message.body);
        }
      });

      this.subscriptions.set(topic, subscription);
    } catch (error) {
      console.error(`❌ 구독 실패 (${topic}):`, error);
    }
  }

  unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  // 메시지 전송 
  send(destination: string, body: any = {}, headers: any = {}): void {
    if (!this.isConnected || !this.stompClient) {
      console.error("❌ WebSocket이 연결되지 않았습니다.");
      return;
    }

    try {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body),
        headers,
      });
    } catch (error) {
      console.error(`❌ 메시지 전송 실패 (${destination}):`, error);
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  //한국 주식 일괄 구독
  subscribeAllKoreanStocks(
    codes: string[],
    callback: (data: StockPriceData) => void
  ): void {
    if (!this.isConnected || !this.stompClient) {
      this.pendingSubscribes.push(() =>
        this.subscribeAllKoreanStocks(codes, callback)
      );
      return;
    }

    //일괄 구독 요청 (딱 1번만 보냄)
    this.send("/app/stock/subscribe-all/korean", {});

    //종목별 토픽 구독
    codes.forEach((code) => {
      const topic = `/topic/stock/live-Price/${code}`;
      this.subscribe(topic, callback);
    });
  }

  unsubscribeAllKoreanStocks(codes: string[]): void {
    if (!this.isConnected || !this.stompClient) return;

    this.send("/app/stock/unsubscribe-all/korean", {});
    codes.forEach((code) => {
      this.unsubscribe(`/topic/stock/live-Price/${code}`);
    });
  }

  // === 해외 주식 일괄 구독 ===
  subscribeAllOverseasStocks(
    codes: string[],
    callback: (data: StockPriceData) => void
  ): void {
    if (!this.isConnected || !this.stompClient) {
      this.pendingSubscribes.push(() =>
        this.subscribeAllOverseasStocks(codes, callback)
      );
      return;
    }

    //일괄 구독 요청 (딱 1번만 보냄)
    this.send("/app/stock/subscribe-all/overseas", {});

    //종목별 토픽 구독
    codes.forEach((code) => {
      const topic = `/topic/stock/live-Price/${code}`;
      this.subscribe(topic, callback);
    });
  }

  unsubscribeAllOverseasStocks(codes: string[]): void {
    if (!this.isConnected || !this.stompClient) return;

    this.send("/app/stock/unsubscribe-all/overseas", {});
    codes.forEach((code) => {
      this.unsubscribe(`/topic/stock/live-Price/${code}`);
    });
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
