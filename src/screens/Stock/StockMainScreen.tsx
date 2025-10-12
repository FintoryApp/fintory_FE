import React,{useState, useEffect,useRef} from 'react';
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

// api
import { getOwnedStockList } from '../../api/stock/getOwnedStockList';
import { getKoreanStock_marketCap } from '../../api/stock/getKoreanStockMarketCapList';
import { getOverseasStock_marketCap } from '../../api/stock/getOverseasStockMarketCapList';
import { getKoreanStock_roc } from '../../api/stock/getKoreanRoc';
import { getOverseasStock_roc } from '../../api/stock/getOverseasRoc';

// types
import { MarketCapStockInfo, RocStockInfo, OwnedStockInfo } from '../../api/types';

// hook
// import { useStockWebSocket } from '../../hook/useWebsocket';

export default function StockMainScreen() {

  const [koreanMarketCapList, setKoreanMarketCapList] = useState<MarketCapStockInfo[]>([]);
  const [overseasMarketCapList, setOverseasMarketCapList] = useState<MarketCapStockInfo[]>([]);
  const [holdings, setHoldings] = useState<OwnedStockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isKorean, setIsKorean] = useState(true);
  const [selectedButton, setSelectedButton] = useState<'등락률' | '시가총액'>('등락률');
  const [koreanRocList, setKoreanRocList] = useState<RocStockInfo[]>([]);
  const [overseasRocList, setOverseasRocList] = useState<RocStockInfo[]>([]);


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
  
  


  
  const {top} = useSafeAreaInsets();
  const handleSearch = (text: string) => {};
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(false);
  const [isStockInfoExpanded, setIsStockInfoExpanded] = useState(false);
  
  const toggleUserInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsUserInfoExpanded(!isUserInfoExpanded);
  };

  const toggleStockInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsStockInfoExpanded(!isStockInfoExpanded);
  };
  
  const [rotateAnim] = useState(new Animated.Value(0));
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const [userInfoHeight] = useState(new Animated.Value(112));
  const [stockInfoHeight] = useState(new Animated.Value(224.72));

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

  const filteredHoldings = holdings.filter(h => h.isKorean === isKorean);

  // 국내 + 등락률 선택 시 koreanRocList 사용, 그 외에는 기존 로직 사용
  const getFilteredStocks = (): (MarketCapStockInfo | RocStockInfo)[] => {
    console.log('getFilteredStocks 호출:', { isKorean, selectedButton });
    console.log('현재 데이터 상태:', {
      koreanRocListLength: koreanRocList.length,
      koreanMarketCapListLength: koreanMarketCapList.length,
      overseasRocListLength: overseasRocList.length,
      overseasMarketCapListLength: overseasMarketCapList.length
    });
    
    if (isKorean && selectedButton === '등락률') {
      // 국내 + 등락률
      console.log('국내 + 등락률 선택, koreanRocList 반환:', koreanRocList);
      return koreanRocList;
    } else if (isKorean && selectedButton === '시가총액') {
      // 국내 + 시가총액
      console.log('국내 + 시가총액 선택, koreanMarketCapList 반환:', koreanMarketCapList);
      return koreanMarketCapList;
    } else if (!isKorean && selectedButton === '등락률') {
      // 해외 + 등락률
      console.log('해외 + 등락률 선택, overseasRocList 반환:', overseasRocList);
      return overseasRocList;
    } else {
      // 해외 + 시가총액
      console.log('해외 + 시가총액 선택, overseasMarketCapList 반환:', overseasMarketCapList);
      return overseasMarketCapList;
    }
  };
  
  const filteredStocks = getFilteredStocks();
  console.log('filteredStocks 결과:', filteredStocks);

  const StockListToRender = selectedButton === '시가총액' ? MarketCapStockList : ChangeRateStockList;


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
        <View style={styles.userInfoContainer}>
          <Text style={styles.topContainerText}>내 투자 현황</Text>
          <Text style={styles.percentageText}>로딩 중...</Text>
          {isUserInfoExpanded && (
            <View>
              <View style={styles.totalPriceContainer}>
                <View style={styles.totalPriceTextContainer}>
                  <Text style={styles.totalPriceText}>총 평가금액</Text>
                  <Text style={styles.totalPriceValue}>로딩 중...</Text>
                </View>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.smallBox}>
                  <Text style={styles.smallBoxText}>총 매수</Text>
                  <Text style={styles.smallBoxText}>로딩 중...</Text>
                </View>
                <View style={styles.smallBox}>
                  <Text style={styles.smallBoxText}>내 보유 머니</Text>
                  <Text style={styles.smallBoxText}>로딩 중...</Text>
                </View>
              </View>
            </View>
          )}
          <TouchableOpacity style={[styles.seeMoreButton]} onPress={toggleUserInfo}>
            <Animated.Image
              source={require('../../../assets/icons/arrow_drop_down.png')}
              style={[
                styles.seeMoreButtonImage,
                { transform: [{ rotate: isUserInfoExpanded ? '180deg' : '0deg' }] },
              ]}
            />
            <Text style={styles.seeMoreButtonText}>
              {isUserInfoExpanded ? '닫기' : '더보기'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stockInfoContainer}>
          <Text style={styles.stockInfoText}>나의 보유 주식</Text>
          <View style={[styles.stockInfoBlockContainer]}>
            {isLoading ? (
              <Text style={styles.stockInfoText}>로딩 중...</Text>
            ) : holdings.length > 0 ? (
              filteredHoldings.map((holding, index) => {
                const averagePrice = holding.averagePrice || 0;
                const priceChange = holding.priceChange || 0;
                const currentPrice = averagePrice + priceChange;
                const percentage = holding.priceChangeRate || 0;
                const quantity = holding.quantity || 0;
                const profitLoss = quantity > 0 ? (currentPrice - averagePrice) * quantity : 0;
                
                return (
                  <OwnedStockList
                    key={holding.stockCode}
                    name={holding.stockName}
                    price={currentPrice}
                    percentage={percentage}
                    image={holding.profileImageUrl || require("../../../assets/icons/red_circle.png")}
                    quantity={quantity}
                    profitLoss={profitLoss}
                  />
                );
              })
            ) : (
              <Text style={styles.stockInfoText}>보유 주식이 없습니다.</Text>
            )}
          </View>
          <TouchableOpacity style={styles.seeMoreButton} onPress={toggleStockInfo}>
            <Animated.Image
              source={require('../../../assets/icons/arrow_drop_down.png')}
              style={[
                styles.seeMoreButtonImage,
                { transform: [{ rotate: isStockInfoExpanded ? '180deg' : '0deg' }] },
              ]}
            />
            <Text style={styles.seeMoreButtonText}>
              {isStockInfoExpanded ? '닫기' : '더보기'}
            </Text>
          </TouchableOpacity>
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
            </View>
          </View>

          <SearchContainer
            onSearch={handleSearch}
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
                    stockImage={stock.profileImageUrl || require("../../../assets/icons/red_circle.png")}
                    marketCap={(stock as MarketCapStockInfo).marketCap}
                    currentPrice={(stock as MarketCapStockInfo).currentPrice}
                  />
                ) : (
                  <ChangeRateStockList
                    key={index + 1}
                    stockName={stock.stockName}
                    stockCode={stock.stockCode}
                    rank={index + 1}
                    closePrice={(stock as RocStockInfo).closePrice}
                    stockImage={stock.profileImageUrl || require("../../../assets/icons/red_circle.png")}
                  />
                )
              ))
            ) : (
              <Text style={styles.stockInfoText}>주식 데이터가 없습니다.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}