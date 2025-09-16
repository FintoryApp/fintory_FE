import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// 웹소켓 설정
const WEBSOCKET_CONFIG = {
  // 개발 환경 (Android 에뮬레이터용)
  BASE_URL: 'https://fintory.xyz/ws',
  
  // iOS 시뮬레이터용 (필요시 주석 해제)
  // BASE_URL: 'http://localhost:8080/ws',
  
  // 프로덕션 환경
  // BASE_URL: 'https://your-production-server.com/ws',
  
  // 연결 옵션
  OPTIONS: {
    debug: true, // 개발 시에만 true
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  }
};

// 주식 종목 코드 상수


// 주식 데이터 타입
export interface StockPriceData {
  code: string;
  currentPrice: number;
  priceChange: number;
  priceChangeRate: number;
}

class WebSocketService {
  private stompClient: any = null;
  private socket: any = null;
  private isConnected: boolean = false;
  private subscriptions: Map<string, any> = new Map();

  // 웹소켓 연결
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // SockJS 연결 생성
        this.socket = new SockJS(WEBSOCKET_CONFIG.BASE_URL);
        
        // STOMP 클라이언트 생성
        this.stompClient = Stomp.over(this.socket);
        
        // 디버그 모드 설정
        this.stompClient.debug = WEBSOCKET_CONFIG.OPTIONS.debug ? 
          (str: string) => console.log('STOMP: ' + str) : 
          () => {};

        // 연결 설정
        this.stompClient.connect(
          {}, // 헤더 (인증 토큰 등이 필요하면 여기에 추가)
          (frame: any) => {
            console.log('웹소켓 연결 성공:', frame);
            this.isConnected = true;
            resolve();
          },
          (error: any) => {
            console.error('웹소켓 연결 실패:', error);
            this.isConnected = false;
            reject(error);
          }
        );

      } catch (error) {
        console.error('웹소켓 초기화 실패:', error);
        reject(error);
      }
    });
  }

  // 웹소켓 연결 해제
  disconnect(): void {
    if (this.stompClient && this.isConnected) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription, topic) => {
        subscription.unsubscribe();
        console.log(`구독 해제: ${topic}`);
      });
      this.subscriptions.clear();

      // 연결 해제
      this.stompClient.disconnect(() => {
        console.log('웹소켓 연결 해제');
        this.isConnected = false;
      });
    }
  }

  // 토픽 구독
  subscribe(topic: string, callback: (message: any) => void): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    try {
      const subscription = this.stompClient.subscribe(topic, (message: any) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
          callback(message.body);
        }
      });

      this.subscriptions.set(topic, subscription);
      console.log(`구독 시작: ${topic}`);
    } catch (error) {
      console.error(`구독 실패 (${topic}):`, error);
    }
  }

  // 토픽 구독 해제
  unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`구독 해제: ${topic}`);
    }
  }

  // 메시지 전송
  send(destination: string, body: any, headers: any = {}): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    try {
      this.stompClient.send(destination, headers, JSON.stringify(body));
      console.log(`메시지 전송: ${destination}`, body);
    } catch (error) {
      console.error(`메시지 전송 실패 (${destination}):`, error);
    }
  }

  // 연결 상태 확인
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  // 재연결
  reconnect(): Promise<void> {
    console.log('웹소켓 재연결 시도...');
    this.disconnect();
    return this.connect();
  }

  // === 주식 구독 관련 메서드들 ===

  // 개별 한국 주식 구독
  subscribeKoreanStock(code: string): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    const payload = { code };
    this.send('/app/stock/subscribe/korean', payload);
    console.log(`한국 주식 구독 요청: ${code}`);
  }

  // 개별 해외 주식 구독
  subscribeOverseasStock(code: string): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    const payload = { code };
    this.send('/app/stock/subscribe/overseas', payload);
    console.log(`해외 주식 구독 요청: ${code}`);
  }

  // 한국 주식 전체 구독
  subscribeAllKoreanStocks(): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    this.send('/app/stock/subscribe-all/korean', {});
    console.log('한국 주식 전체 구독 요청');
  }

  // 해외 주식 전체 구독
  subscribeAllOverseasStocks(): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    this.send('/app/stock/subscribe-all/overseas', {});
    console.log('해외 주식 전체 구독 요청');
  }

  // 개별 한국 주식 구독 해제
  unsubscribeKoreanStock(code: string): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    const payload = { code };
    this.send('/app/stock/unsubscribe/korean', payload);
    console.log(`한국 주식 구독 해제 요청: ${code}`);
  }

  // 개별 해외 주식 구독 해제
  unsubscribeOverseasStock(code: string): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    const payload = { code };
    this.send('/app/stock/unsubscribe/overseas', payload);
    console.log(`해외 주식 구독 해제 요청: ${code}`);
  }

  // 한국 주식 전체 구독 해제
  unsubscribeAllKoreanStocks(): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    this.send('/app/stock/unsubscribe-all/korean', {});
    console.log('한국 주식 전체 구독 해제 요청');
  }

  // 해외 주식 전체 구독 해제
  unsubscribeAllOverseasStocks(): void {
    if (!this.isConnected) {
      console.error('웹소켓이 연결되지 않았습니다.');
      return;
    }

    this.send('/app/stock/unsubscribe-all/overseas', {});
    console.log('해외 주식 전체 구독 해제 요청');
  }

  // 특정 종목 실시간 가격 구독 (토픽 구독)
  subscribeToStockPrice(code: string, callback: (data: StockPriceData) => void): void {
    const topic = `/topic/stock/live-Price/${code}`;
    this.subscribe(topic, callback);
  }

  // 특정 종목 실시간 가격 구독 해제
  unsubscribeFromStockPrice(code: string): void {
    const topic = `/topic/stock/live-Price/${code}`;
    this.unsubscribe(topic);
  }

  // 한국 주식 전체 실시간 가격 구독
  
}

// 싱글톤 인스턴스 생성
const webSocketService = new WebSocketService();

export default webSocketService;

// 웹소켓 토픽 상수
export const WEBSOCKET_TOPICS = {
  // 주식 실시간 가격 (종목별)
  STOCK_LIVE_PRICE: (code: string) => `/topic/stock/live-Price/${code}`,
  
  // 사용자 관련
  USER_NOTIFICATION: '/topic/user/notification',
  USER_PORTFOLIO: '/topic/user/portfolio',
  
  // 뉴스 관련
  NEWS_UPDATE: '/topic/news/update',
  
  // 채팅 관련 (필요시)
  CHAT_MESSAGE: '/topic/chat/message',
};

// 웹소켓 메시지 타입
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  userId?: string;
}

// 주식 구독 요청 타입
export interface StockSubscriptionRequest {
  code: string;
}

// 주식 구독 해제 요청 타입
export interface StockUnsubscriptionRequest {
  code: string;
}
