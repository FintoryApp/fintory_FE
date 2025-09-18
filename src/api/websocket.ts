import { Client } from "@stomp/stompjs";

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

    try {
      this.stompClient = new Client({
        webSocketFactory: () => new WebSocket("wss://fintory.xyz/ws"),
        debug: (str) => console.log("🐛 STOMP:", str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = (frame) => {
        console.log("웹소켓 연결 성공:", frame);
        this.isConnected = true;


        if (this.pendingSubscribes.length > 0) {
          console.log("대기 중이던 구독 실행...", this.pendingSubscribes.length);
          this.pendingSubscribes.forEach((fn) => fn());
          this.pendingSubscribes = [];
        }

        resolve();
      };

      this.stompClient.onStompError = (frame) => {
        console.error("웹소켓 STOMP 오류:", frame);
        this.isConnected = false;
        reject(frame);
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error("웹소켓 연결 오류 (RN):", JSON.stringify(error));
        this.isConnected = false;
        reject(error);
      };

      this.stompClient.onDisconnect = () => {
        console.log("웹소켓 연결 해제됨.");
        this.isConnected = false;
      };

      this.stompClient.activate();
    } catch (error) {
      console.error("웹소켓 초기화 실패:", error);
      reject(error);
    }
  });
}


  //연결 해제 
  disconnect(): void {
    if (this.stompClient) {
      this.subscriptions.forEach((subscription, topic) => {
        subscription.unsubscribe();
        console.log(`구독 해제: ${topic}`);
      });
      this.subscriptions.clear();

      this.stompClient.deactivate();
      this.isConnected = false;
      console.log("웹소켓 연결 해제 완료");
    }
  }

  //토픽 구독
  subscribe(topic: string, callback: (message: any) => void): void {
    if (!this.isConnected || !this.stompClient) {
      console.error("웹소켓이 연결되지 않았습니다.");
      return;
    }

    try {
      const subscription = this.stompClient.subscribe(topic, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error("메시지 파싱 오류:", error);
          callback(message.body);
        }
      });

      this.subscriptions.set(topic, subscription);
      console.log(`구독 시작: ${topic}`);
    } catch (error) {
      console.error(`구독 실패 (${topic}):`, error);
    }
  }

  unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`구독 해제: ${topic}`);
    }
  }

  // 메시지 전송 
  send(destination: string, body: any = {}, headers: any = {}): void {
    if (!this.isConnected || !this.stompClient) {
      console.error("웹소켓이 연결되지 않았습니다.");
      return;
    }

    try {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body),
        headers,
      });
      console.log(`메시지 전송 → ${destination}`, body);
    } catch (error) {
      console.error(`메시지 전송 실패 (${destination}):`, error);
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
      console.log("아직 연결 전, 구독 예약:", codes);
      this.pendingSubscribes.push(() =>
        this.subscribeAllKoreanStocks(codes, callback)
      );
      return;
    }

    //일괄 구독 요청 (딱 1번만 보냄)
    this.send("/app/stock/subscribe-all/korean", {});
    console.log("📤 한국 주식 일괄 구독 요청 보냄");

    //종목별 토픽 구독
    codes.forEach((code) => {
      const topic = `/topic/stock/live-Price/${code}`;
      this.subscribe(topic, callback);
    });

    console.log(`한국 주식 토픽 구독 (${codes.length}개)`, codes);
  }

  unsubscribeAllKoreanStocks(codes: string[]): void {
    if (!this.isConnected || !this.stompClient) return;

    this.send("/app/stock/unsubscribe-all/korean", {});
    codes.forEach((code) => {
      this.unsubscribe(`/topic/stock/live-Price/${code}`);
    });

    console.log(`한국 주식 일괄 구독 해제 (${codes.length}개)`, codes);
  }

  // === 해외 주식 일괄 구독 ===
  subscribeAllOverseasStocks(
    codes: string[],
    callback: (data: StockPriceData) => void
  ): void {
    if (!this.isConnected || !this.stompClient) {
      console.log("아직 연결 전, 구독 예약:", codes);
      this.pendingSubscribes.push(() =>
        this.subscribeAllOverseasStocks(codes, callback)
      );
      return;
    }

    //일괄 구독 요청 (딱 1번만 보냄)
    this.send("/app/stock/subscribe-all/overseas", {});
    console.log("해외 주식 일괄 구독 요청 보냄");

    //종목별 토픽 구독
    codes.forEach((code) => {
      const topic = `/topic/stock/live-Price/${code}`;
      this.subscribe(topic, callback);
    });

    console.log(`해외 주식 토픽 구독 (${codes.length}개)`, codes);
  }

  unsubscribeAllOverseasStocks(codes: string[]): void {
    if (!this.isConnected || !this.stompClient) return;

    this.send("/app/stock/unsubscribe-all/overseas", {});
    codes.forEach((code) => {
      this.unsubscribe(`/topic/stock/live-Price/${code}`);
    });

    console.log(`해외 주식 일괄 구독 해제 (${codes.length}개)`, codes);
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
