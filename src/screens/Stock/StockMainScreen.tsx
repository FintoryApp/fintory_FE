import React,{useState, useEffect,useRef, useCallback} from 'react';
import { LayoutAnimation, View, Text, StyleSheet,ScrollView, TouchableOpacity, Animated, Image  } from 'react-native';
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

// types
import { MarketCapStockInfo, RocStockInfo, OwnedStockInfo } from '../../api/types';

// hook
import { useStockWebSocket } from '../../hooks/useWebsocket';
import { getExchangeRate } from '../../api/stock/getExchangeRate';

//utils


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
  // 상단에 ref 2개 추가
const rateBufferRef = useRef<{[k:string]: number}>({});
const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  async function safeCall<T>(label: string, call: () => Promise<T>, fallbackValue: T) {
    try {
      const res = await call();
      console.log(`[OK] ${label}`, { url: (res as any)?.config?.url, status: (res as any)?.status });
      return res;
    } catch (err: any) {
      console.error(`[FAIL] ${label}`, {
        message: err?.message,
        status: err?.response?.status,
        url: err?.config?.url,
        method: err?.config?.method,
        params: err?.config?.params,
        data: err?.response?.data,
      });
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
        const overseasRocRes = await safeCall('overseas roc', getOverseasStock_roc, { data: [] });
        if (!mounted) return;
        setKoreanRocList(koreanRocRes.data ?? []);
        setOverseasRocList(overseasRocRes.data ?? []);
      } catch (e) {
        console.error('API 호출 중 예상치 못한 오류:', e);
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
        console.error('Error fetching holdings:', error);
      }
    })();
  },[]);


  
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  const toggleShowAllHoldings = () => {
    setShowAllHoldings(!showAllHoldings);
  };

  // 현재 장마감으로 웹소켓 안됨 - API 데이터 우선 사용
  // const getCurrentPrice = (stock: MarketCapStockInfo | RocStockInfo | OwnedStockInfo) => {
  //   return stock.currentPrice || prices[stock.stockCode]?.currentPrice || 0;
  // };

  // const getCurrentPercentage = (stock: MarketCapStockInfo | RocStockInfo | OwnedStockInfo) => {
  //   // 현재 장마감으로 웹소켓 안됨 - API 데이터 그대로 사용
  //   return (stock as any).priceChangeRate || 0;
    
    // 웹소켓 정상 작동 시 사용할 코드 (주석처리)
    // const realtimeData = prices[stock.stockCode];
    // if (realtimeData) {
    //   // 실시간 데이터가 있으면 프론트에서 등락률 계산
    //   const previousPrice = stock.currentPrice - (stock as any).priceChange;
    //   return previousPrice > 0 ? ((realtimeData.currentPrice - previousPrice) / previousPrice) * 100 : 0;
    // }
    // // 실시간 데이터가 없으면 API 데이터 사용
    // return (stock as any).priceChangeRate || 0;
  // };


  // 국내 + 등락률 선택 시 koreanRocList 사용, 그 외에는 기존 로직 사용
  const getFilteredStocks = (): (MarketCapStockInfo | RocStockInfo)[] => {
    console.log('getFilteredStocks 호출:', { isKorean, selectedButton });
    console.log('현재 데이터 상태:', {
      koreanRocListLength: koreanRocList.length,
      koreanMarketCapListLength: koreanMarketCapList.length,
      overseasRocListLength: overseasRocList.length,
      overseasMarketCapListLength: overseasMarketCapList.length
    });
    
    let stocks: (MarketCapStockInfo | RocStockInfo)[] = [];
    
    if (isKorean && selectedButton === '등락률') {
      // 국내 + 등락률
      console.log('국내 + 등락률 선택, koreanRocList 반환:', koreanRocList);
      stocks = koreanRocList;
    } else if (isKorean && selectedButton === '시가총액') {
      // 국내 + 시가총액
      console.log('국내 + 시가총액 선택, koreanMarketCapList 반환:', koreanMarketCapList);
      stocks = koreanMarketCapList;
    } else if (!isKorean && selectedButton === '등락률') {
      // 해외 + 등락률
      console.log('해외 + 등락률 선택, overseasRocList 반환:', overseasRocList);
      stocks = overseasRocList;
    } else {
      // 해외 + 시가총액
      console.log('해외 + 시가총액 선택, overseasMarketCapList 반환:', overseasMarketCapList);
      stocks = overseasMarketCapList;
    }

    // 등락률 선택 시 priceChangeRate 기준으로 내림차순 정렬
    if (selectedButton === '등락률') {
      stocks = [...stocks].sort((a, b) => {
        const aPriceChangeRate = priceChangeRates[a.stockCode] || 0;
        const bPriceChangeRate = priceChangeRates[b.stockCode] || 0;
        return bPriceChangeRate - aPriceChangeRate;
      });
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
      priceChangeRates,
      koreanRocList,
      overseasRocList,
      koreanMarketCapList,
      overseasMarketCapList,
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
        console.log('=== getExchangeRate API 호출 시작 ===');
        const res = await getExchangeRate();
        console.log('getExchangeRate API 응답:', res);
        console.log('환율 데이터:', res.data?.exchangeRate);
        setExchangeRate(res.data.exchangeRate);
        console.log('환율 설정 완료:', res.data.exchangeRate);
      } catch (error) {
        console.error('getExchangeRate API 에러:', error);
        console.error('에러 상세:', {
          message: (error as any)?.message,
          status: (error as any)?.response?.status,
          data: (error as any)?.response?.data
        });
        setExchangeRate(0); // 에러 시 기본값 설정
      }
      console.log('=== getExchangeRate API 호출 완료 ===');
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
    console.log('=== totalPrice 계산 ===');
    console.log('현재 acc:', acc);
    console.log('holding 정보:', {
      stockName: holding.stockName,
      isKorean: holding.isKorean,
      currentPrice: holding.currentPrice,
      quantity: holding.quantity,
      exchangeRate: exchangeRate
    });
    
    let newAcc;
    if (holding.isKorean) {
      newAcc = acc + holding.currentPrice * holding.quantity;
      console.log('국내주식 계산:', acc, '+ (', holding.currentPrice, '*', holding.quantity, ') =', newAcc);
    } else {
      newAcc = acc + holding.currentPrice * holding.quantity * exchangeRate;
      console.log('해외주식 계산:', acc, '+ (', holding.currentPrice, '*', holding.quantity, '*', exchangeRate, ') =', newAcc);
    }
    
    console.log('새로운 acc:', newAcc);
    console.log('====================');
    return newAcc;
  }, 0);
  
  const totalPurchase = filteredHoldingsToRender.reduce((acc, holding) => {
    console.log('=== totalPurchase 계산 ===');
    console.log('현재 acc:', acc);
    console.log('holding 정보:', {
      stockName: holding.stockName,
      isKorean: holding.isKorean,
      purchaseamount: holding.purchaseamount,
      exchangeRate: exchangeRate
    });
    
    let newAcc;
    if (holding.isKorean) {
      newAcc = acc + holding.purchaseamount;  // 국내주식: 그대로
      console.log('국내주식 계산:', acc, '+', holding.purchaseamount, '=', newAcc);
    } else {
      newAcc = acc + holding.purchaseamount * exchangeRate;
      console.log('해외주식 계산:', acc, '+ (', holding.purchaseamount, '*', exchangeRate, ') =', newAcc);
    }
    
    console.log('새로운 acc:', newAcc);
    console.log('=======================');
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
                  />
                ) : (
                  <ChangeRateStockList
                    key={index + 1}
                    stockName={stock.stockName}
                    stockCode={stock.stockCode}
                    rank={index + 1}
                    closePrice={(stock as RocStockInfo).closePrice}
                    // openPrice={(stock as RocStockInfo).openPrice}
                    openPrice={100000}
                    stockImage={stock.profileImageUrl || ''}
                    onPriceChangeRateCalculated={(rate: number) =>
                    handlePriceChangeRateCalculated(stock.stockCode, rate)
                    }
                    isKorean={isKorean}
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