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
import { useStockWebSocket } from '../../hook/useWebsocket';

export default function StockMainScreen() {

  const [koreanMarketCapList, setKoreanMarketCapList] = useState<MarketCapStockInfo[]>([]);
  const [overseasMarketCapList, setOverseasMarketCapList] = useState<MarketCapStockInfo[]>([]);
  const [holdings, setHoldings] = useState<OwnedStockInfo[]>([]);
  // const [allStockCodes, setAllStockCodes] = useState<string[]>([]);

  const [isKorean, setIsKorean] = useState(true);
  const [selectedButton, setSelectedButton] = useState<'등락률' | '시가총액'>('등락률');
  const [koreanRocList, setKoreanRocList] = useState<RocStockInfo[]>([]);
  const [overseasRocList, setOverseasRocList] = useState<RocStockInfo[]>([]);
  // const [isInitialized, setIsInitialized] = useState<boolean>(false);

  
  // 초기 데이터 로딩: 화면이 처음 렌더링될 때 한 번만 실행
  useEffect(() => {
    console.log('useEffect 시작 - API 호출 준비');
    (async () => {
      try {
        console.log('API 호출 시작');
        const [koreanMarketCapRes, overseasMarketCapRes, ownedRes, koreanRocRes, overseasRocRes] = await Promise.all([
          getKoreanStock_marketCap(),
          getOverseasStock_marketCap(),
          getOwnedStockList(),
          getKoreanStock_roc(),
          getOverseasStock_roc()
        ]);
        
        console.log('API 응답 받음:', {
          koreanMarketCap: koreanMarketCapRes,
          overseasMarketCap: overseasMarketCapRes,
          owned: ownedRes,
          koreanRoc: koreanRocRes,
          overseasRoc: overseasRocRes
        });
        
        setKoreanMarketCapList(koreanMarketCapRes.data);
        setOverseasMarketCapList(overseasMarketCapRes.data);
        setHoldings(ownedRes.data);
        setKoreanRocList(koreanRocRes.data);
        setOverseasRocList(overseasRocRes.data);
        
        console.log('State 설정 완료');
        
        // 모든 종목 코드 통합
        const allCodes = [
          ...koreanMarketCapRes.data.map((stock: any) => stock.stockCode),
          ...overseasMarketCapRes.data.map((stock: any) => stock.stockCode),
          ...ownedRes.data.map((holding: any) => holding.stockCode),
          ...koreanRocList.map((stock: any) => stock.stockCode),
          ...overseasRocList.map((stock: any) => stock.stockCode)
        ];
        const uniqueCodes = [...new Set(allCodes)]; // 중복 제거
        console.log('allStockCodes 설정됨:', uniqueCodes);
        // setAllStockCodes(uniqueCodes);
        // setIsInitialized(true);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        console.error('Error details:', {
          message: (error as any).message,
          status: (error as any).response?.status,
          data: (error as any).response?.data
        });
      }
    })();
  }, []);

  // Hook은 항상 호출되어야 하므로 조건부 호출 제거
  // const { prices, isConnected, connectionError } = useStockWebSocket(
  //   koreanStocks, overseasStocks
  // );

  
  
  // 실시간 가격 기준 등락률 정렬 (현재 장마감으로 웹소켓 안됨 - 주석처리)
  // const getSortedStocks = (stocks: (MarketCapStockInfo | RocStockInfo)[], sortType: '등락률' | '시가총액') => {
  //   if (sortType === '시가총액') {
  //     return stocks;
  //   } else {
  //     return [...stocks].sort((a, b) => {
  //       const priceA = getCurrentPercentage(a);
  //       const priceB = getCurrentPercentage(b);
  //       return priceB - priceA;
  //     });
  //   }
  // };

  
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
            {holdings.length > 0 ? (
              filteredHoldings.map((holding, index) => {
                const currentPrice = 0;
                const percentage = 0;
                const averagePrice = holding.averagePrice || 0;
                const quantity = holding.quantity || 0;
                const profitLoss = quantity > 0 ? (currentPrice - averagePrice) * quantity : 0;
                const profitLossRate = averagePrice > 0 ? ((currentPrice - averagePrice) / averagePrice) * 100 : 0;
                
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
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock, index) => (
                selectedButton === '시가총액' ? (
                  <MarketCapStockList
                    key={stock.stockCode}
                    stockName={stock.stockName}
                    stockCode={stock.stockCode}
                    stockImage={stock.profileImageUrl || require("../../../assets/icons/red_circle.png")}
                    marketCap={(stock as MarketCapStockInfo).marketCap}
                    currentPrice={(stock as MarketCapStockInfo).currentPrice}
                  />
                ) : (
                  <ChangeRateStockList
                    key={stock.stockCode}
                    stockCode={stock.stockCode}
                    stockName={stock.stockName}
                    closePrice={(stock as RocStockInfo).closePrice}
                    stockImage={stock.profileImageUrl || require("../../../assets/icons/red_circle.png")}
                  />
                )
              ))
            ) : (
              <Text style={styles.stockInfoText}>주식 데이터를 불러오는 중...</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}