import React,{useState, useEffect,useRef, useCallback} from 'react';
import { LayoutAnimation, View, Text, StyleSheet,ScrollView, TouchableOpacity, Animated, Image, RefreshControl  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

//utils
import { 
  saveRealtimeData, 
  loadRealtimeData, 
  getLastUpdateTime, 
  isDataStale,
  RealtimeStockData 
} from '../../utils/localStorage';


export default function StockMainScreen() {
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
      console.log(`${isKorean ? '국내' : '해외'} 장 마감 상태 - live-price API 호출 시작`);
      
      try {
        // 현재 선택된 탭에 따라 해당 주식들만 가져오기
        const stocksToFetch = isKorean 
          ? [...koreanMarketCapList, ...koreanRocList]
          : [...overseasMarketCapList, ...overseasRocList];

        const promises = stocksToFetch.map(async (stock) => {
          try {
            const response = isKorean 
              ? await getKoreanStock_livePrice(stock.stockCode)
              : await getOverseasStock_livePrice(stock.stockCode);
            
            return {
              code: stock.stockCode,
              currentPrice: response.data.currentPrice,
              priceChange: response.data.priceChange || 0,
              priceChangeRate: response.data.priceChangeRate || 0,
              timestamp: Date.now()
            };
          } catch (error) {
            console.error(`${isKorean ? '국내' : '해외'} 주식 ${stock.stockCode} live-price API 호출 실패:`, error);
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

        console.log(`${isKorean ? '국내' : '해외'} 장 마감 상태 - live-price API 호출 완료:`, Object.keys(apiData).length, '개');
      } catch (error) {
        console.error(`${isKorean ? '국내' : '해외'} 장 마감 상태 live-price API 호출 중 오류:`, error);
      }
    }
  };

  fetchLivePricesForClosedMarket();
}, [isConnected, marketStatus, koreanMarketCapList, koreanRocList, overseasMarketCapList, overseasRocList, isKorean]);


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
  // prices를 RealtimeStockData 형태로 변환
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
      }

    } catch {}
  };
  loadInitialData();
},[isKorean]);

//라이브를 스냅샷으로 저장
const commitSnapshot = useCallback(async () => {
  const allLiveData: RealtimeStockData = { ...livePricesRef.current };
  if (Object.keys(allLiveData).length === 0) {
    // 라이브가 아직 없으면 스냅샷 갱신 생략 (선택)
    return;
  }

  // 국내/해외 데이터 분리
  const koreanData: RealtimeStockData = {};
  const overseasData: RealtimeStockData = {};
  
  Object.entries(allLiveData).forEach(([code, data]) => {
    if (krCodeSet.has(code)) {
      koreanData[code] = data;
    } else if (ovCodeSet.has(code)) {
      overseasData[code] = data;
    }
  });

  // 1) 로컬스토리지 저장 (국내/해외 각각)
  await saveRealtimeData(koreanData, true);
  await saveRealtimeData(overseasData, false);

  // 2) 현재 선택된 시장의 데이터로 화면 스냅샷 교체
  const currentMarketData = isKorean ? koreanData : overseasData;
  setLocalRealtimeData(currentMarketData);

  // 3) 등락률 동기화 (현재 시장만)
  const rates: {[k: string]: number} = {};
  Object.entries(currentMarketData).forEach(([code, d]) => {
    rates[code] = d.priceChangeRate;
  });
  setPriceChangeRates(prev => ({ ...prev, ...rates }));
}, [isKorean, krCodeSet, ovCodeSet]);

// Pull-to-refresh 핸들러
const handleRefresh = useCallback(async () => {
  setIsRefreshing(true);
  try {
    console.log('=== 새로고침 시작 ===');
    
    // 1. 현재 라이브 데이터를 스냅샷으로 저장
    await commitSnapshot();
    
    // 2. 기본 주식 데이터 재로드 (시가총액, 등락률 리스트)
    console.log('기본 주식 데이터 재로드 시작...');
    
    const koreanMarketCapRes = await safeCall('korean market-cap refresh', getKoreanStock_marketCap, { data: [] });
    const overseasMarketCapRes = await safeCall('overseas market-cap refresh', getOverseasStock_marketCap, { data: [] });
    const koreanRocRes = await safeCall('korean roc refresh', getKoreanStock_roc, { data: [] });
    const overseasRocRes = await safeCall('overseas roc refresh', getOverseasStock_roc, { data: [] });
    
    // 상태 업데이트
    setKoreanMarketCapList(koreanMarketCapRes.data ?? []);
    setOverseasMarketCapList(overseasMarketCapRes.data ?? []);
    setKoreanRocList(koreanRocRes.data ?? []);
    setOverseasRocList(overseasRocRes.data ?? []);
    
    // 3. 보유 주식 데이터도 재로드
    try {
      const koreanRes = await getKoreanOwnedStockList();
      const overseasRes = await getOverseasOwnedStockList();
      setKoreanHoldings(koreanRes.data.ownedStockDetails ?? []);
      setOverseasHoldings(overseasRes.data.ownedStockDetails ?? []);
    } catch (error) {
      console.error('보유 주식 데이터 재로드 실패:', error);
    }
    
    // 4. 환율 및 총 자산 재로드
    try {
      const exchangeRes = await getExchangeRate();
      setExchangeRate(exchangeRes.data.exchangeRate);
      
      const totalMoneyRes = await getTotalMoney();
      setTotalMoney(totalMoneyRes.data);
    } catch (error) {
      console.error('환율/총자산 데이터 재로드 실패:', error);
    }
    
    // 5. 웹소켓 재연결 트리거
    triggerReconnect();
    
    console.log('=== 새로고침 완료 ===');
  } catch (error) {
    console.error('새로고침 중 오류:', error);
  } finally {
    setIsRefreshing(false);
  }
}, [commitSnapshot, triggerReconnect]);




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
      const koreanRes = await getKoreanOwnedStockList();
      const overseasRes = await getOverseasOwnedStockList();
        setKoreanHoldings(koreanRes.data.ownedStockDetails ?? []);
        setOverseasHoldings(overseasRes.data.ownedStockDetails ?? []);
      } catch (error) {
        // console.error('Error fetching holdings:', error);
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
    // console.log('getFilteredStocks 호출:', { isKorean, selectedButton });
    // console.log('현재 데이터 상태:', {
    //   koreanRocListLength: koreanRocList.length,
    //   koreanMarketCapListLength: koreanMarketCapList.length,
    //   overseasRocListLength: overseasRocList.length,
    //   overseasMarketCapListLength: overseasMarketCapList.length
    // });
    
    let stocks: (MarketCapStockInfo | RocStockInfo)[] = [];
    
    if (isKorean && selectedButton === '등락률') {
      // 국내 + 등락률
      //console.log('국내 + 등락률 선택, koreanRocList 반환:', koreanRocList);
      stocks = koreanRocList;
    } else if (isKorean && selectedButton === '시가총액') {
      // 국내 + 시가총액
      // console.log('국내 + 시가총액 선택, koreanMarketCapList 반환:', koreanMarketCapList);
      stocks = koreanMarketCapList;
    } else if (!isKorean && selectedButton === '등락률') {
      // 해외 + 등락률
      // console.log('해외 + 등락률 선택, overseasRocList 반환:', overseasRocList);
      stocks = overseasRocList;
    } else {
      // 해외 + 시가총액
      // console.log('해외 + 시가총액 선택, overseasMarketCapList 반환:', overseasMarketCapList);
      stocks = overseasMarketCapList;
    }

    // 등락률 선택 시 priceChangeRate 기준으로 내림차순 정렬
    if (selectedButton === '등락률') {
      // console.log('🔄 [SORT] 등락률 정렬 시작:', {
      //   isKorean,
      //   stocksCount: stocks.length,
      //   priceChangeRatesCount: Object.keys(priceChangeRates).length,
      //   priceChangeRatesKeys: Object.keys(priceChangeRates)
      // });
      
      stocks = [...stocks].sort((a, b) => {
        const aPriceChangeRate = priceChangeRates[a.stockCode] || 0;
        const bPriceChangeRate = priceChangeRates[b.stockCode] || 0;
        
        // 디버깅 로그 (처음 5개만)
        // if (stocks.indexOf(a) < 5) {
        //   console.log(`🔄 [SORT] ${a.stockCode}(${a.stockName}): ${aPriceChangeRate}%`);
        // }
        
        return bPriceChangeRate - aPriceChangeRate;
      });
      
      // console.log('🔄 [SORT] 등락률 정렬 완료:', stocks.slice(0, 3).map(s => ({
      //   stockCode: s.stockCode,
      //   stockName: s.stockName,
      //   rate: priceChangeRates[s.stockCode] || 0
      // })));
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
      priceChangeRates, // priceChangeRates가 변경될 때만 재정렬
      koreanRocList,
      overseasRocList,
      koreanMarketCapList,
      overseasMarketCapList,
      // prices 제거: priceChangeRates를 통해 간접적으로 반영됨
    ]
  );


  // 국내와 해외 보유 주식을 모두 합쳐서 사용 (국내/해외 구분 정보 포함)
  const koreanHoldingsWithFlag = koreanHoldings.map(holding => ({ ...holding, isKorean: true }));
  const overseasHoldingsWithFlag = overseasHoldings.map(holding => ({ ...holding, isKorean: false }));
  const allHoldings = [...koreanHoldingsWithFlag, ...overseasHoldingsWithFlag];
  
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

  const totalPrice = filteredHoldingsToRender.reduce((acc, holding) => {
    // console.log('=== totalPrice 계산 ===');
    // console.log('현재 acc:', acc);
    // console.log('holding 정보:', {
    //   stockName: holding.stockName,
    //   isKorean: holding.isKorean,
    //   currentPrice: holding.currentPrice,
    //   quantity: holding.quantity,
    //   exchangeRate: exchangeRate
    // });
    
    let newAcc;
    if (holding.isKorean) {
      newAcc = acc + holding.currentPrice * holding.quantity;
      // console.log('국내주식 계산:', acc, '+ (', holding.currentPrice, '*', holding.quantity, ') =', newAcc);
    } else {
      newAcc = acc + holding.currentPrice * holding.quantity * exchangeRate;
      // console.log('해외주식 계산:', acc, '+ (', holding.currentPrice, '*', holding.quantity, '*', exchangeRate, ') =', newAcc);
    }
    
    // console.log('새로운 acc:', newAcc);
    // console.log('====================');
    return newAcc;
  }, 0);
  
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
              holdingsToDisplay.map((holding) => (
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
                />
              ))
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
              filteredStocks.map((stock, index) => (
                selectedButton === '시가총액' ? (
                  <MarketCapStockList
                    key={index + 1}
                    stockName={stock.stockName}
                    stockCode={stock.stockCode}
                    rank={index + 1}
                    stockImage={stock.profileImageUrl || ''}
                    marketCap={(stock as MarketCapStockInfo).marketCap}
                    currentPrice={(stock as MarketCapStockInfo).currentPrice}
                    isKorean={isKorean}
                    isWebSocketConnected={isConnected}
                    realtimePrice={localRealtimeData[stock.stockCode]?.currentPrice}
                    realtimePriceChangeRate={localRealtimeData[stock.stockCode]?.priceChangeRate}
                    isMarketCapSelected={selectedButton === '시가총액'}
                    marketStatus={marketStatus}
                  />
                ) : (
                  <ChangeRateStockList
                    key={index + 1}
                    stockName={stock.stockName}
                    stockCode={stock.stockCode}
                    rank={index + 1}
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
                  />
                )
              ))
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