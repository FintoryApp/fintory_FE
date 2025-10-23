import React,{useState, useEffect,useRef, useCallback} from 'react';
import { LayoutAnimation, View, Text, StyleSheet,ScrollView, TouchableOpacity, Animated, Image, RefreshControl  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/StockMainScreen.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';

// component
import TopBar from '../../components/ui/TopBar';
import SearchContainer from '../../components/ui/SearchContainer';
import MarketCapStockList from '../../components/stock/MarketCapStockList';
import ChangeRateStockList from '../../components/stock/ChangeRateStockList';
import OwnedStockList from '../../components/stock/OwnedStockList';
import UserInvestmentStatus from '../../components/stock/UserInvestmentStatus';

// api
import { getKoreanStock_marketCap } from '../../api/stock/getKoreanStockMarketCapList';
import { getOverseasStock_marketCap } from '../../api/stock/getOverseasStockMarketCapList';
import { getKoreanStock_roc } from '../../api/stock/getKoreanRoc';
import { getOverseasStock_roc } from '../../api/stock/getOverseasRoc';
import { getOverseasOwnedStockList } from '../../api/stock/overseasOwnedStock';
import { getKoreanOwnedStockList } from '../../api/stock/koreanOwnedStock';
import { getTotalMoney } from '../../api/totalMoney';
import { getExchangeRate } from '../../api/stock/getExchangeRate';
import { getKoreanStock_livePrice } from '../../api/stock/getKoreanStockLivePrice';
import { getOverseasStock_livePrice } from '../../api/stock/getOverseasStockLivePrice';


// types
import { MarketCapStockInfo, RocStockInfo, OwnedStockInfo } from '../../api/types';

// hook
import { useStockWebSocket } from '../../hooks/useWebsocket';

// webSocket service 직접 import
import webSocketService from '../../api/webSocketService';

//utils
import { 
  saveRealtimeData, 
  loadRealtimeData, 
  getLastUpdateTime, 
  isDataStale,
  RealtimeStockData 
} from '../../utils/localStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type StockMainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function StockMainScreen() {
  console.log('🔍 [DEBUG] StockMainScreen 컴포넌트 렌더링 시작');
  const navigation = useNavigation<StockMainScreenNavigationProp>();
  const {top} = useSafeAreaInsets();
  const [koreanMarketCapList, setKoreanMarketCapList] = useState<MarketCapStockInfo[]>([]);
  const [overseasMarketCapList, setOverseasMarketCapList] = useState<MarketCapStockInfo[]>([]);
  const [koreanHoldings, setKoreanHoldings] = useState<OwnedStockInfo[]>([]);
  const [overseasHoldings, setOverseasHoldings] = useState<OwnedStockInfo[]>([]);
  const [holdings, setHoldings] = useState<OwnedStockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isKorean, setIsKorean] = useState(true);
  const [selectedButton, setSelectedButton] = useState<'등락률' | '시가총액'>('시가총액');
  const [koreanRocList, setKoreanRocList] = useState<RocStockInfo[]>([]);
  const [overseasRocList, setOverseasRocList] = useState<RocStockInfo[]>([]);
  const [totalMoney, setTotalMoney] = useState<number>(0);
  const [showAllHoldings, setShowAllHoldings] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceChangeRates, setPriceChangeRates] = useState<{[key: string]: number}>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [localRealtimeData, setLocalRealtimeData] = useState<RealtimeStockData>({});
  const [marketStatus, setMarketStatus] = useState<string>('unknown'); // 장 상태 저장
  const [marketCapSnapshotRanking, setMarketCapSnapshotRanking] = useState<{[key: string]: number}>({}); // 시가총액 스냅샷 순위
  const [changeRateSnapshotRanking, setChangeRateSnapshotRanking] = useState<{[key: string]: number}>({}); // 등락률 스냅샷 순위
  // ref들
const rateBufferRef = useRef<{[k:string]: number}>({});
const flushTimerRef = useRef<NodeJS.Timeout | null>(null);
const livePricesRef=useRef<RealtimeStockData>({});

const [krCodeSet, setKrCodeSet] = useState<Set<string>>(new Set());
const [ovCodeSet, setOvCodeSet] = useState<Set<string>>(new Set());

useEffect(() => {
  // 한 번에 세트 구성 (대문자/소문자 섞임 방지 위해 통일)
  const kr = new Set<string>([
    ...koreanMarketCapList.map(s => s.stockCode.toString()),
    ...koreanRocList.map(s => s.stockCode.toString()),
  ]);
  const ov = new Set<string>([
    ...overseasMarketCapList.map(s => s.stockCode.toString()),
    ...overseasRocList.map(s => s.stockCode.toString()),
  ]);
  setKrCodeSet(kr);
  setOvCodeSet(ov);
}, [koreanMarketCapList, koreanRocList, overseasMarketCapList, overseasRocList]);



//웹소켓 훅 사용 - 현재 선택된 탭에 따라 구독
const { prices, isConnected, connectionError, marketStatus: wsMarketStatus, triggerReconnect } = useStockWebSocket(
  [...koreanMarketCapList, ...koreanRocList], 
  [...overseasMarketCapList, ...overseasRocList],
  isKorean // 현재 선택된 탭 전달
);

// 웹소켓에서 받은 장 상태를 로컬 상태에 동기화
useEffect(() => {
  if (wsMarketStatus !== 'unknown') {
    setMarketStatus(wsMarketStatus);
  }
}, [wsMarketStatus]);


// 장이 마감된 경우 live-price API로 종가 데이터 가져오기 (현재 선택된 탭만)
useEffect(() => {
  const fetchLivePricesForClosedMarket = async () => {
    // 웹소켓이 연결되지 않았거나 장이 마감된 경우에만 API 호출
    if (!isConnected && marketStatus === 'no') {
      try {
        // 현재 선택된 탭에 따라 해당 주식들만 가져오기 + 보유 주식은 항상 포함
        const stocksToFetch = isKorean 
          ? [...koreanMarketCapList, ...koreanRocList, ...koreanHoldings, ...overseasHoldings]
          : [...overseasMarketCapList, ...overseasRocList, ...koreanHoldings, ...overseasHoldings];

        const promises = stocksToFetch.map(async (stock) => {
          try {
            // 보유 주식인지 확인 (stockCode로 구분: 숫자로 시작하면 국내, 알파벳으로 시작하면 해외)
            const isOverseasStock = /^[A-Za-z]/.test(stock.stockCode);
            const response = isOverseasStock 
              ? await getOverseasStock_livePrice(stock.stockCode)
              : await getKoreanStock_livePrice(stock.stockCode);
            
            return {
              code: stock.stockCode,
              currentPrice: response.data.currentPrice,
              priceChange: response.data.priceChange || 0,
              priceChangeRate: response.data.priceChangeRate || 0,
              timestamp: Date.now()
            };
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(promises);

        // 결과를 RealtimeStockData 형태로 변환
        const apiData: RealtimeStockData = {};
        results
          .filter(result => result !== null)
          .forEach(result => {
            if (result) {
              apiData[result.code] = result;
            }
          });

        // 로컬 스토리지에 저장
        await saveRealtimeData(apiData, isKorean);
        setLocalRealtimeData(apiData);

        // 등락률 업데이트
        const rates: {[k: string]: number} = {};
        Object.entries(apiData).forEach(([code, data]) => {
          rates[code] = data.priceChangeRate;
        });
        setPriceChangeRates(prev => ({ ...prev, ...rates }));

        const timestamp = new Date().toLocaleString('ko-KR');
        console.log(`📸 [SNAPSHOT] ${isKorean ? '국내' : '해외'} 장 마감 스냅샷 생성 - ${Object.keys(apiData).length}개 주식, ${timestamp}`);
      } catch (error) {
        console.error('장 마감 상태 live-price API 호출 중 오류:', error);
      }
    }
  };

  fetchLivePricesForClosedMarket();
}, [isConnected, marketStatus, koreanMarketCapList, koreanRocList, overseasMarketCapList, overseasRocList, koreanHoldings, overseasHoldings, isKorean]);


const handlePriceChangeRateCalculated = useCallback((stockCode: string, rate: number) => {
  rateBufferRef.current[stockCode] = rate;

  if (!flushTimerRef.current) {
    flushTimerRef.current = setTimeout(() => {
      // 한 번에 머지
      setPriceChangeRates(prev => ({ ...prev, ...rateBufferRef.current }));
      rateBufferRef.current = {};
      flushTimerRef.current = null;
    }, 100); // 필요시 50~200ms로 조정
  }
}, []);



useEffect(() => {
  // prices를 RealtimeStockData 형태로 변환하고 실시간으로 화면에 반영
  if (prices && typeof prices === 'object') {
    const convertedData: RealtimeStockData = {};
    Object.entries(prices).forEach(([code, data]) => {
      convertedData[code] = {
        code: data.code,
        currentPrice: data.currentPrice,
        priceChange: data.priceChange,
        priceChangeRate: data.priceChangeRate,
        timestamp: Date.now()
      };
    });
    livePricesRef.current = convertedData;
    
    // 🔥 실시간으로 화면에 반영 (등락률과 현재가만)
    setLocalRealtimeData(prevData => ({
      ...prevData, // 기존 스냅샷 데이터 유지
      ...convertedData // 웹소켓 실시간 데이터로 덮어쓰기
    }));
    
    // 등락률도 실시간으로 업데이트
    const rates: {[k: string]: number} = {};
    Object.entries(convertedData).forEach(([code, data]) => {
      rates[code] = data.priceChangeRate;
    });
    setPriceChangeRates(prev => ({ ...prev, ...rates }));
  }
}, [prices]);

//첫 로딩은 로컬 스냅샷만만
useEffect(()=>{
  const loadInitialData = async () => {
    try {
      const snapshot=await loadRealtimeData(isKorean);
      setLocalRealtimeData(snapshot);

      if (Object.keys(snapshot).length > 0) {
        const rates: {[key: string]: number} = {};
        Object.entries(snapshot).forEach(([stockCode, data]) => {
          rates[stockCode] = data.priceChangeRate;
        });
        setPriceChangeRates(prev => ({ ...prev, ...rates }));
        
        const timestamp = new Date().toLocaleString('ko-KR');
        console.log(`📸 [SNAPSHOT] ${isKorean ? '국내' : '해외'} 초기 스냅샷 로드 - ${Object.keys(snapshot).length}개 주식, ${timestamp}`);
      }

    } catch {}
  };
  loadInitialData();
},[isKorean]);

// 시가총액 스냅샷 순위 저장
useEffect(() => {
  const saveMarketCapSnapshotRanking = () => {
    let stocks: MarketCapStockInfo[] = [];
    
    if (isKorean) {
      stocks = koreanMarketCapList;
    } else {
      stocks = overseasMarketCapList;
    }

    // 시가총액 기준으로 내림차순 정렬 (이미 API에서 정렬되어 오지만 확실히 하기 위해)
    stocks = [...stocks].sort((a, b) => b.marketCap - a.marketCap);

    const ranking: {[key: string]: number} = {};
    stocks.forEach((stock, index) => {
      ranking[stock.stockCode] = index + 1; // 1부터 시작하는 순위
    });
    
    setMarketCapSnapshotRanking(ranking);
    console.log('📊 [SNAPSHOT] 시가총액 스냅샷 순위 저장 완료:', Object.keys(ranking).length, '개');
  };
  
  const hasStockData = (isKorean ? koreanMarketCapList.length > 0 : overseasMarketCapList.length > 0);
  
  if (hasStockData && Object.keys(marketCapSnapshotRanking).length === 0) {
    saveMarketCapSnapshotRanking();
  }
}, [koreanMarketCapList, overseasMarketCapList, isKorean, marketCapSnapshotRanking]);

// 등락률 스냅샷 순위 저장 (웹소켓 데이터가 충분히 쌓인 후)
useEffect(() => {
  const saveChangeRateSnapshotRanking = () => {
    let stocks: RocStockInfo[] = [];
    
    if (isKorean) {
      stocks = koreanRocList;
    } else {
      stocks = overseasRocList;
    }

    // 웹소켓 priceChangeRate 기준으로 내림차순 정렬
    stocks = [...stocks].sort((a, b) => {
      const aPriceChangeRate = priceChangeRates[a.stockCode] || 0;
      const bPriceChangeRate = priceChangeRates[b.stockCode] || 0;
      return bPriceChangeRate - aPriceChangeRate;
    });

    const ranking: {[key: string]: number} = {};
    stocks.forEach((stock, index) => {
      ranking[stock.stockCode] = index + 1; // 1부터 시작하는 순위
    });
    
    setChangeRateSnapshotRanking(ranking);
    console.log('📊 [SNAPSHOT] 등락률 스냅샷 순위 저장 완료:', Object.keys(ranking).length, '개');
  };
  
  const hasEnoughData = Object.keys(priceChangeRates).length > 0;
  const hasStockData = (isKorean ? koreanRocList.length > 0 : overseasRocList.length > 0);
  
  if (hasStockData && hasEnoughData && Object.keys(changeRateSnapshotRanking).length === 0) {
    saveChangeRateSnapshotRanking();
  }
}, [koreanRocList, overseasRocList, isKorean, priceChangeRates, changeRateSnapshotRanking]);

//라이브를 스냅샷으로 저장하고 화면에 반영
const commitSnapshot = useCallback(async () => {
  // 🔥 핵심: 웹소켓 실시간 데이터를 localRealtimeData에 병합하여 화면에 반영
  const webSocketData = { ...livePricesRef.current };
  const mergedData: RealtimeStockData = {
    ...localRealtimeData, // 기존 스냅샷 데이터
    ...webSocketData // 웹소켓 실시간 데이터로 덮어쓰기
  };
  
  // 화면에 병합된 데이터 반영
  setLocalRealtimeData(mergedData);
  
  // 등락률도 업데이트
  const rates: {[k: string]: number} = {};
  Object.entries(mergedData).forEach(([code, data]) => {
    rates[code] = data.priceChangeRate;
  });
  setPriceChangeRates(prev => ({ ...prev, ...rates }));

  // 국내/해외 데이터 분리하여 로컬스토리지에 저장
  const koreanData: RealtimeStockData = {};
  const overseasData: RealtimeStockData = {};
  
  Object.entries(mergedData).forEach(([code, data]) => {
    if (krCodeSet.has(code)) {
      koreanData[code] = data;
    } else if (ovCodeSet.has(code)) {
      overseasData[code] = data;
    }
  });

  // 로컬스토리지 저장 (국내/해외 각각)
  await saveRealtimeData(koreanData, true);
  await saveRealtimeData(overseasData, false);

  // 스냅샷 순위 초기화 (새로고침 시 순위 재계산을 위해)
  setMarketCapSnapshotRanking({});
  setChangeRateSnapshotRanking({});

  const timestamp = new Date().toLocaleString('ko-KR');
  console.log(`📸 [SNAPSHOT] 새로고침 스냅샷 생성 - 국내 ${Object.keys(koreanData).length}개, 해외 ${Object.keys(overseasData).length}개, ${timestamp}`);
}, [localRealtimeData, krCodeSet, ovCodeSet]);

// Pull-to-refresh 핸들러
const handleRefresh = useCallback(async () => {
  setIsRefreshing(true);
  try {
    const startTime = Date.now();
    
    // 1. 현재 라이브 데이터를 스냅샷으로 저장
    await commitSnapshot();
    
    // 2. 기본 주식 데이터 재로드 (시가총액, 등락률 리스트) - 병렬 처리
    const [koreanMarketCapRes, overseasMarketCapRes, koreanRocRes, overseasRocRes] = await Promise.all([
      safeCall('korean market-cap refresh', getKoreanStock_marketCap, { data: [] }),
      safeCall('overseas market-cap refresh', getOverseasStock_marketCap, { data: [] }),
      safeCall('korean roc refresh', getKoreanStock_roc, { data: [] }),
      safeCall('overseas roc refresh', getOverseasStock_roc, { data: [] })
    ]);
    
    // 상태 업데이트
    setKoreanMarketCapList(koreanMarketCapRes.data ?? []);
    setOverseasMarketCapList(overseasMarketCapRes.data ?? []);
    setKoreanRocList(koreanRocRes.data ?? []);
    setOverseasRocList(overseasRocRes.data ?? []);
    
    // 3. 보유 주식 데이터도 재로드 - 병렬 처리
    const [koreanRes, overseasRes, exchangeRes, totalMoneyRes] = await Promise.allSettled([
      getKoreanOwnedStockList(),
      getOverseasOwnedStockList(),
      getExchangeRate(),
      getTotalMoney()
    ]);
    
    // 보유 주식 데이터 업데이트 (live-price API로 currentPrice 업데이트)
    if (koreanRes.status === 'fulfilled' && koreanRes.value.data) {
      const koreanHoldingsData = koreanRes.value.data.ownedStockDetails ?? [];
      if (koreanHoldingsData.length > 0) {
        const updatedKoreanHoldings = await Promise.all(
          koreanHoldingsData.map(async (holding: any) => {
            try {
              const response = await getKoreanStock_livePrice(holding.stockCode);
              return {
                ...holding,
                currentPrice: response.data.currentPrice
              };
            } catch (error) {
              return holding;
            }
          })
        );
        setKoreanHoldings(updatedKoreanHoldings);
      } else {
        setKoreanHoldings([]);
      }
    } else {
      setKoreanHoldings([]);
    }
    
    if (overseasRes.status === 'fulfilled' && overseasRes.value.data) {
      const overseasHoldingsData = overseasRes.value.data.ownedStockDetails ?? [];
      if (overseasHoldingsData.length > 0) {
        const updatedOverseasHoldings = await Promise.all(
          overseasHoldingsData.map(async (holding: any) => {
            try {
              const response = await getOverseasStock_livePrice(holding.stockCode);
              return {
                ...holding,
                currentPrice: response.data.currentPrice
              };
            } catch (error) {
              return holding;
            }
          })
        );
        setOverseasHoldings(updatedOverseasHoldings);
      } else {
        setOverseasHoldings([]);
      }
    } else {
      setOverseasHoldings([]);
    }
    
    // 환율 및 총 자산 업데이트
    if (exchangeRes.status === 'fulfilled') {
      setExchangeRate(exchangeRes.value.data.exchangeRate);
    }
    if (totalMoneyRes.status === 'fulfilled') {
      setTotalMoney(totalMoneyRes.value.data);
    }
    
    // 4. 웹소켓 재연결 트리거
    triggerReconnect();
    
    // 5. 새로고침 후 순위 재계산 (등락률 기준)
    setTimeout(() => {
      const recalculateRanking = () => {
        let stocks: (MarketCapStockInfo | RocStockInfo)[] = [];
        
        if (isKorean && selectedButton === '등락률') {
          stocks = koreanRocRes.data ?? [];
        } else if (isKorean && selectedButton === '시가총액') {
          stocks = koreanMarketCapRes.data ?? [];
        } else if (!isKorean && selectedButton === '등락률') {
          stocks = overseasRocRes.data ?? [];
        } else {
          stocks = overseasMarketCapRes.data ?? [];
        }

        // 등락률 선택 시 웹소켓 priceChangeRate 기준으로 내림차순 정렬
        if (selectedButton === '등락률') {
          stocks = [...stocks].sort((a, b) => {
            const aPriceChangeRate = priceChangeRates[a.stockCode] || 0;
            const bPriceChangeRate = priceChangeRates[b.stockCode] || 0;
            return bPriceChangeRate - aPriceChangeRate;
          });
        }

        const ranking: {[key: string]: number} = {};
        stocks.forEach((stock, index) => {
          ranking[stock.stockCode] = index + 1;
        });
        
        // 선택된 정렬 기준에 따라 적절한 스냅샷 순위 업데이트
        if (selectedButton === '시가총액') {
          setMarketCapSnapshotRanking(ranking);
        } else {
          setChangeRateSnapshotRanking(ranking);
        }
        console.log(`📸 [RANKING] 새로고침 후 ${selectedButton} 순위 재계산 - ${Object.keys(ranking).length}개 주식`);
      };
      
      recalculateRanking();
    }, 100); // 약간의 지연을 두어 상태 업데이트 완료 후 실행
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`🔄 [REFRESH] 새로고침 완료 - ${duration}ms`);
  } catch (error) {
    console.error('새로고침 중 오류:', error);
  } finally {
    setIsRefreshing(false);
  }
  }, [commitSnapshot, triggerReconnect]);

  // 화면 포커스 관리 - 화면 진입 시 웹소켓 재연결, 나갈 때 disconnect
  useFocusEffect(
    useCallback(() => {
      // 화면에 포커스가 있을 때 - 웹소켓 재연결
      console.log('📱 [STOCK_MAIN] StockMainScreen 포커스 - 웹소켓 재연결');

      setIsKorean(true);
      setSelectedButton('시가총액');
      setSearchQuery('');
      triggerReconnect(); // 웹소켓 재연결 트리거
      
      return () => {
        // 화면에서 포커스를 잃을 때
        console.log('📱 [STOCK_MAIN] StockMainScreen 포커스 해제 - 웹소켓 연결 해제');
        // 직접 웹소켓 disconnect 호출
        console.log('📡 [STOCK_MAIN] 직접 웹소켓 disconnect 호출');
        webSocketService.disconnect();
      };
    }, []) // 의존성 배열을 빈 배열로 변경
  );

  // 컴포넌트 언마운트 시 정리 작업
  useEffect(() => {
    return () => {
      // 타이머 정리
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      console.log('📱 [STOCK_MAIN] StockMainScreen 언마운트 - 정리 작업 완료');
    };
  }, []);

  async function safeCall<T>(label: string, call: () => Promise<T>, fallbackValue: T) {
    try {
      const res = await call();
      // console.log(`[OK] ${label}`, { url: (res as any)?.config?.url, status: (res as any)?.status });
      return res;
    } catch (err: any) {
      // console.error(`[FAIL] ${label}`, {
      //   message: err?.message,
      //   status: err?.response?.status,
      //   url: err?.config?.url,
      //   method: err?.config?.method,
      //   params: err?.config?.params,
      //   data: err?.response?.data,
      // });
      return fallbackValue;
    }
  }
  
  useEffect(() => {
    console.log('🔍 [DEBUG] 첫 번째 useEffect 실행 (주식 데이터 로딩)');
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        
        // API 호출 시 실패하면 빈 배열로 fallback
        const koreanMarketCapRes = await safeCall('korean market-cap', getKoreanStock_marketCap, { data: [] });
        // const ownedRes = await safeCall('owned list', getOwnedStockList, { data: [] });
        if (!mounted) return;
        setKoreanMarketCapList(koreanMarketCapRes.data ?? []);
        // setHoldings(ownedRes.data ?? []);
  
        const overseasMarketCapRes = await safeCall('overseas market-cap', getOverseasStock_marketCap, { data: [] });
        if (!mounted) return;
        setOverseasMarketCapList(overseasMarketCapRes.data ?? []);
  
        const koreanRocRes = await safeCall('korean roc', getKoreanStock_roc, { data: [] });
        //console.log('koreanRocRes', koreanRocRes);
        const overseasRocRes = await safeCall('overseas roc', getOverseasStock_roc, { data: [] });
        if (!mounted) return;
        setKoreanRocList(koreanRocRes.data ?? []);
        setOverseasRocList(overseasRocRes.data ?? []);
      } catch (e) {
        // console.error('API 호출 중 예상치 못한 오류:', e);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);
  
  useEffect(()=>{
    (async()=>{
      try {
        console.log('🔍 [DEBUG] 보유 주식 API 호출 시작');
        
        // 보유 주식 API 호출을 안전하게 처리
        const [koreanRes, overseasRes] = await Promise.allSettled([
          getKoreanOwnedStockList(),
          getOverseasOwnedStockList()
        ]);
        
        console.log('🔍 [DEBUG] 보유 주식 API 응답:', {
          koreanRes: koreanRes.status === 'fulfilled' ? koreanRes.value.data : null,
          overseasRes: overseasRes.status === 'fulfilled' ? overseasRes.value.data : null
        });
        
        // 국내 보유 주식 처리
        let koreanHoldingsData: any[] = [];
        if (koreanRes.status === 'fulfilled' && koreanRes.value.data) {
          koreanHoldingsData = koreanRes.value.data.ownedStockDetails ?? [];
        } else {
          console.log('🔍 [DEBUG] 국내 보유 주식 없음 또는 API 에러');
        }
        
        // 해외 보유 주식 처리
        let overseasHoldingsData: any[] = [];
        if (overseasRes.status === 'fulfilled' && overseasRes.value.data) {
          overseasHoldingsData = overseasRes.value.data.ownedStockDetails ?? [];
        } else {
          console.log('🔍 [DEBUG] 해외 보유 주식 없음 또는 API 에러');
        }
        
        // 보유 주식의 currentPrice를 live-price API로 업데이트
        const updateHoldingsWithLivePrice = async (holdings: any[], isKorean: boolean) => {
          if (holdings.length === 0) {
            console.log(`🔍 [DEBUG] ${isKorean ? '국내' : '해외'} 보유 주식이 없어 live-price API 호출 생략`);
            return [];
          }
          
          console.log(`🔍 [DEBUG] ${isKorean ? '국내' : '해외'} 보유 주식 live-price API 호출 시작:`, holdings.length, '개');
          const updatedHoldings = await Promise.all(
            holdings.map(async (holding) => {
              try {
                console.log(`🔍 [DEBUG] ${isKorean ? '국내' : '해외'} 주식 live-price API 호출:`, holding.stockCode, holding.stockName);
                const response = isKorean 
                  ? await getKoreanStock_livePrice(holding.stockCode)
                  : await getOverseasStock_livePrice(holding.stockCode);
                
                console.log(`✅ [DEBUG] ${isKorean ? '국내' : '해외'} 주식 live-price API 성공:`, {
                  stockCode: holding.stockCode,
                  originalPrice: holding.currentPrice,
                  newPrice: response.data.currentPrice
                });
                
                return {
                  ...holding,
                  currentPrice: response.data.currentPrice
                };
              } catch (error) {
                console.log(`❌ [DEBUG] ${isKorean ? '국내' : '해외'} 주식 live-price API 실패:`, holding.stockCode, error);
                // API 호출 실패 시 원래 currentPrice 유지
                return holding;
              }
            })
          );
          return updatedHoldings;
        };
        
        // 국내/해외 보유 주식의 currentPrice 업데이트
        koreanHoldingsData = await updateHoldingsWithLivePrice(koreanHoldingsData, true);
        overseasHoldingsData = await updateHoldingsWithLivePrice(overseasHoldingsData, false);
        
        setKoreanHoldings(koreanHoldingsData);
        setOverseasHoldings(overseasHoldingsData);
        
        console.log('🔍 [DEBUG] 보유 주식 처리 완료:', {
          koreanHoldings: koreanHoldingsData.length,
          overseasHoldings: overseasHoldingsData.length
        });
      } catch (error) {
        console.log('🔍 [DEBUG] 보유 주식 API 호출 중 예상치 못한 오류:', error);
        // 에러가 발생해도 빈 배열로 초기화
        setKoreanHoldings([]);
        setOverseasHoldings([]);
      }
    })();
  },[]);


  
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  const toggleShowAllHoldings = () => {
    setShowAllHoldings(!showAllHoldings);
  };

  
    
  // //   웹소켓 정상 작동 시 사용할 코드 (주석처리)
  //   const realtimeData = prices[stock.stockCode];
  //   if (realtimeData) {
  //     // 실시간 데이터가 있으면 프론트에서 등락률 계산
  //     const previousPrice = stock.currentPrice - (stock as any).priceChange;
  //     return previousPrice > 0 ? ((realtimeData.currentPrice - previousPrice) / previousPrice) * 100 : 0;
  //   }
  //   // 실시간 데이터가 없으면 API 데이터 사용
  //   return (stock as any).priceChangeRate || 0;
  // };


  // 국내 + 등락률 선택 시 koreanRocList 사용, 그 외에는 기존 로직 사용
  const getFilteredStocks = (): (MarketCapStockInfo | RocStockInfo)[] => {
    let stocks: (MarketCapStockInfo | RocStockInfo)[] = [];
    
    if (isKorean && selectedButton === '등락률') {
      stocks = koreanRocList;
    } else if (isKorean && selectedButton === '시가총액') {
      stocks = koreanMarketCapList;
    } else if (!isKorean && selectedButton === '등락률') {
      stocks = overseasRocList;
    } else {
      stocks = overseasMarketCapList;
    }

    // 🔥 선택된 정렬 기준에 따라 적절한 스냅샷 순위 사용
    const currentSnapshotRanking = selectedButton === '시가총액' ? marketCapSnapshotRanking : changeRateSnapshotRanking;
    
    if (Object.keys(currentSnapshotRanking).length > 0) {
      stocks = [...stocks].sort((a, b) => {
        const aRank = currentSnapshotRanking[a.stockCode] || 999;
        const bRank = currentSnapshotRanking[b.stockCode] || 999;
        return aRank - bRank; // 순위 오름차순 정렬
      });
    } else {
      // 스냅샷이 없으면 기본 정렬
      if (selectedButton === '등락률') {
        stocks = [...stocks].sort((a, b) => {
          const aPriceChangeRate = priceChangeRates[a.stockCode] || 0;
          const bPriceChangeRate = priceChangeRates[b.stockCode] || 0;
          return bPriceChangeRate - aPriceChangeRate;
        });
      }
      // 시가총액은 이미 API에서 정렬되어 옴
    }

    // 검색어가 있으면 필터링 적용
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      stocks = stocks.filter(stock => 
        stock.stockName.toLowerCase().includes(query) || 
        stock.stockCode.toLowerCase().includes(query)
      );
    }

    return stocks;
  };
  
  const filteredStocks = React.useMemo(
    () => getFilteredStocks(),
    [
      isKorean,
      selectedButton,
      searchQuery,
      marketCapSnapshotRanking, // 시가총액 스냅샷 순위가 변경될 때만 재정렬
      changeRateSnapshotRanking, // 등락률 스냅샷 순위가 변경될 때만 재정렬
      koreanRocList,
      overseasRocList,
      koreanMarketCapList,
      overseasMarketCapList,
      // priceChangeRates 제거: 실시간으로 변동되지만 순위는 고정
    ]
  );


  // 국내와 해외 보유 주식을 모두 합쳐서 사용 (국내/해외 구분 정보 포함)
  const koreanHoldingsWithFlag = koreanHoldings.map(holding => ({ ...holding, isKorean: true }));
  const overseasHoldingsWithFlag = overseasHoldings.map(holding => ({ ...holding, isKorean: false }));
  const allHoldings = [...koreanHoldingsWithFlag, ...overseasHoldingsWithFlag];
  
  console.log('🔍 [DEBUG] 보유 주식 데이터 상태:', {
    koreanHoldings: koreanHoldings.length,
    overseasHoldings: overseasHoldings.length,
    allHoldings: allHoldings.length,
    koreanHoldingsData: koreanHoldings,
    overseasHoldingsData: overseasHoldings
  });
  
  // 보유 주식 코드 목록 생성
  const ownedStockCodes = allHoldings.map(holding => holding.stockCode);
  
  // filteredHoldingsToRender를 const로 저장하여 여러 곳에서 재사용
  const filteredHoldingsToRender = allHoldings.map((holding, index) => {
    const stockCode = holding.stockCode;
    const stockName = holding.stockName;
    const quantity = holding.quantity;
    const purchaseamount = holding.purchaseamount;
    const profileImageUrl = holding.profileImageUrl;
    const averagePurchasePrice = holding.averagePurchasePrice;
    const currentPrice = holding.currentPrice;
    const isKorean = holding.isKorean;

    return {
      stockCode,
      stockName,
      quantity,
      purchaseamount,
      profileImageUrl,
      averagePurchasePrice,
      currentPrice,
      isKorean,
      index
    };
  });

  // 보유 주식 표시 개수 제한 (최대 2개)
  const holdingsToDisplay = showAllHoldings ? filteredHoldingsToRender : filteredHoldingsToRender.slice(0, 2);
  const hasMoreHoldings = filteredHoldingsToRender.length > 2;
  
  console.log('🔍 [DEBUG] 보유 주식 렌더링 상태:', {
    filteredHoldingsToRender: filteredHoldingsToRender.length,
    holdingsToDisplay: holdingsToDisplay.length,
    showAllHoldings,
    hasMoreHoldings,
    isLoading
  });

  useEffect(() => {
    const exchangeRate = async () => {
      try {
        // console.log('=== getExchangeRate API 호출 시작 ===');
        const res = await getExchangeRate();
        // console.log('getExchangeRate API 응답:', res);
        // console.log('환율 데이터:', res.data?.exchangeRate);
        setExchangeRate(res.data.exchangeRate);
        // console.log('환율 설정 완료:', res.data.exchangeRate);
      } catch (error) {
        // console.error('getExchangeRate API 에러:', error);
        // console.error('에러 상세:', {
        //   message: (error as any)?.message,
        //   status: (error as any)?.response?.status,
        //   data: (error as any)?.response?.data
        // });
        setExchangeRate(0); // 에러 시 기본값 설정
      }
      // console.log('=== getExchangeRate API 호출 완료 ===');
    };
    exchangeRate();
  }, []);

  useEffect(() => {
    const totalMoney = async () => {
      const res = await getTotalMoney();
      setTotalMoney(res.data);
    };
    totalMoney();
  }, []);

  const totalPrice = React.useMemo(() => {
    return filteredHoldingsToRender.reduce((acc, holding) => {
      // 웹소켓이 연결되어 있고 실시간 가격이 있으면 실시간 가격 사용, 아니면 API 종가 사용
      const displayPrice = (isConnected && localRealtimeData[holding.stockCode]?.currentPrice) 
        ? localRealtimeData[holding.stockCode].currentPrice 
        : holding.currentPrice;
      
      let newAcc;
      if (holding.isKorean) {
        newAcc = acc + displayPrice * holding.quantity;
      } else {
        newAcc = acc + displayPrice * holding.quantity * exchangeRate;
      }
      
      return newAcc;
    }, 0);
  }, [filteredHoldingsToRender, isConnected, localRealtimeData, exchangeRate]);
  
  const totalPurchase = filteredHoldingsToRender.reduce((acc, holding) => {
    // console.log('=== totalPurchase 계산 ===');
    // console.log('현재 acc:', acc);
    // console.log('holding 정보:', {
    //   stockName: holding.stockName,
    //   isKorean: holding.isKorean,
    //   purchaseamount: holding.purchaseamount,
    //   exchangeRate: exchangeRate
    // });
    
    let newAcc;
    if (holding.isKorean) {
      newAcc = acc + holding.purchaseamount;  // 국내주식: 그대로
      // console.log('국내주식 계산:', acc, '+', holding.purchaseamount, '=', newAcc);
    } else {
      newAcc = acc + holding.purchaseamount * exchangeRate;
      // console.log('해외주식 계산:', acc, '+ (', holding.purchaseamount, '*', exchangeRate, ') =', newAcc);
    }
    
    // console.log('새로운 acc:', newAcc);
    // console.log('=======================');
    return newAcc;
  }, 0);
  
  const totalRate = totalPurchase > 0 ? (totalPrice - totalPurchase) / totalPurchase * 100 : 0;

  console.log('🔍 [DEBUG] StockMainScreen 렌더링 직전 상태:', {
    isLoading,
    koreanHoldings: koreanHoldings.length,
    overseasHoldings: overseasHoldings.length,
    filteredHoldingsToRender: filteredHoldingsToRender.length,
    holdingsToDisplay: holdingsToDisplay.length
  });

  return (
    <View style={styles.wholeContainer}>
      <TopBar title="모의 주식" />
      
      
      
      <ScrollView
        contentContainerStyle={{
          paddingBottom: vScale(30),
          backgroundColor: Colors.surface,
          minHeight: '100%',
        }}
        showsVerticalScrollIndicator={true}
        style={{ marginTop: top }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            title="새로고침 중..."
            titleColor={Colors.black}
          />
        }
      >
        
          <UserInvestmentStatus 
            totalRate={totalRate}
            totalPrice={totalPrice}
            totalPurchase={totalPurchase}
            totalMoney={totalMoney}
          />
        
        

        <View style={styles.stockInfoContainer}>
          <Text style={styles.stockInfoText}>나의 보유 주식</Text>
          <View style={[styles.stockInfoBlockContainer]}>
            {isLoading ? (
              <Text style={styles.stockInfoText}>로딩 중...</Text>
            ) : filteredHoldingsToRender.length > 0 ? (
              holdingsToDisplay.map((holding) => {
                console.log('🔍 [DEBUG] Holding 정보:', {
                  stockCode: holding.stockCode,
                  stockName: holding.stockName,
                  currentPrice: holding.currentPrice,
                  realtimePrice: localRealtimeData[holding.stockCode]?.currentPrice,
                  isKorean: holding.isKorean,
                  isWebSocketConnected: isConnected
                });
                return (
                  <OwnedStockList
                    key={holding.index + 1}
                    stockCode={holding.stockCode}
                    stockName={holding.stockName}
                    quantity={holding.quantity}
                    purchaseamount={holding.purchaseamount}
                    profileImageUrl={holding.profileImageUrl}
                    averagePurchasePrice={holding.averagePurchasePrice}
                    currentPrice={holding.currentPrice}
                    isKorean={holding.isKorean}
                    realtimePrice={localRealtimeData[holding.stockCode]?.currentPrice}
                    isWebSocketConnected={isConnected}
                    onPress={() => navigation.navigate('OwnedStockChart', {stockCode: holding.stockCode, stockName: holding.stockName, closePrice: holding.currentPrice, stockImageUrl: holding.profileImageUrl || ''})}
                  />
                );
              })
            ) : (
              <Text style={styles.stockInfoText}>보유 주식이 없습니다.</Text>
            )}
          </View>
          {hasMoreHoldings && (
            <TouchableOpacity style={styles.seeMoreButton} onPress={toggleShowAllHoldings}>
              <Animated.Image
                source={require('../../../assets/icons/arrow_drop_down.png')}
                style={[
                  styles.seeMoreButtonImage,
                  { transform: [{ rotate: showAllHoldings ? '180deg' : '0deg' }] },
                ]}
              />
              <Text style={styles.seeMoreButtonText}>
                {showAllHoldings ? '닫기' : '더보기'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.detailContainer}>
            <View style={styles.whereContainer}>
              <TouchableOpacity
                style={[styles.domesticButton, { backgroundColor: isKorean ? Colors.primaryDim : Colors.white }]}
                onPress={() => setIsKorean(true)}
              >
                <Text style={[styles.domesticButtonText, { color: isKorean ? Colors.primaryDark : Colors.outlineVariant }]}>국내</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.domesticButton, { backgroundColor: isKorean ? Colors.white : Colors.primaryDim }]}
                onPress={() => setIsKorean(false)}
              >
                <Text style={[styles.domesticButtonText, { color: isKorean ? Colors.outlineVariant : Colors.primaryDark }]}>해외</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryContainer}>
            <TouchableOpacity
                style={[
                  styles.amountButton,
                  { width: hScale(61) },
                  selectedButton === '시가총액' && styles.selectedButton,
                ]}
                onPress={() => setSelectedButton('시가총액')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === '시가총액' && styles.selectedButtonText,
                  ]}
                >
                  시가총액
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.amountButton,
                  selectedButton === '등락률' && styles.selectedButton,
                ]}
                onPress={() => setSelectedButton('등락률')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === '등락률' && styles.selectedButtonText,
                  ]}
                >
                  등락률
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>

          <SearchContainer
            onSearch={handleSearch}
            onChangeText={handleSearch}
            placeholder="주식 검색하기"
            style={styles.searchContainer}
          />

          <View style={styles.stockListContainer}>
            {isLoading ? (
              <Text style={styles.stockInfoText}>주식 데이터를 불러오는 중...</Text>
            ) : filteredStocks.length > 0 ? (
              filteredStocks.map((stock, index) => {
                // 🔥 선택된 정렬 기준에 따라 적절한 스냅샷 순위 사용
                const currentSnapshotRanking = selectedButton === '시가총액' ? marketCapSnapshotRanking : changeRateSnapshotRanking;
                const snapshotRank = currentSnapshotRanking[stock.stockCode] || (index + 1);
                
                return selectedButton === '시가총액' ? (
                  <MarketCapStockList
                    key={index + 1}
                    stockName={stock.stockName}
                    stockCode={stock.stockCode}
                    rank={snapshotRank}
                    stockImage={stock.profileImageUrl || ''}
                    marketCap={(stock as MarketCapStockInfo).marketCap}
                    currentPrice={(stock as MarketCapStockInfo).currentPrice}
                    isKorean={isKorean}
                    isWebSocketConnected={isConnected}
                    realtimePrice={localRealtimeData[stock.stockCode]?.currentPrice}
                    realtimePriceChangeRate={localRealtimeData[stock.stockCode]?.priceChangeRate}
                    isMarketCapSelected={selectedButton === '시가총액'}
                    marketStatus={marketStatus}
                    ownedStockCodes={ownedStockCodes}
                  />
                ) : (
                  <ChangeRateStockList
                    key={index + 1}
                    stockName={stock.stockName}
                    stockCode={stock.stockCode}
                    rank={snapshotRank}
                    closePrice={(stock as RocStockInfo).closePrice}
                    openPrice={(stock as RocStockInfo).openPrice}
                    // openPrice={100000}
                    stockImage={stock.profileImageUrl || ''}
                    onPriceChangeRateCalculated={(rate: number) =>
                    handlePriceChangeRateCalculated(stock.stockCode, rate)
                    }
                    isKorean={isKorean}
                    isWebSocketConnected={isConnected}
                    realtimePrice={
                      localRealtimeData[stock.stockCode]?.currentPrice
                    }
                    realtimePriceChangeRate={
                      localRealtimeData[stock.stockCode]?.priceChangeRate
                    }
                    isChangeRateSelected={selectedButton === '등락률'}
                    marketStatus={marketStatus}
                    ownedStockCodes={ownedStockCodes}
                  />
                );
              })
            ) : searchQuery.trim() ? (
              <Text style={styles.stockInfoText}>'{searchQuery}'에 대한 검색 결과가 없습니다.</Text>
            ) : (
              <Text style={styles.stockInfoText}>주식 데이터가 없습니다.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}