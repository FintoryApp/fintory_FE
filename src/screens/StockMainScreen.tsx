import React,{useState, useEffect,useRef} from 'react';
import { LayoutAnimation, View, Text, StyleSheet,ScrollView, TouchableOpacity, Animated, Image  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/StockMainScreen.styles';
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

// component
import TopBar from '../components/TopBar';
import SearchContainer from '../components/SearchContainer';
import MarketCapStockList from '../components/stock/MarketCapStockList';
import StockList from '../components/stock/ChangeRateStockList';
import OwnedStockList from '../components/stock/OwnedStockList';

// api
import { getOwnedStockList } from '../api/stock/getOwnedStockList';
import { getKoreanStock_marketCap } from '../api/stock/getKoreanStockMarketCapList';
import { getOverseasStock_marketCap } from '../api/stock/getOverseasStockMarketCapList';

// hook
import { useStockWebSocket } from '../hook/useWebsocket';

export default function StockMainScreen() {

  const [koreanStocks, setKoreanStocks] = useState<any[]>([]);
  const [overseasStocks, setOverseasStocks] = useState<any[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [allStockCodes, setAllStockCodes] = useState<string[]>([]);

  const [isKorean, setIsKorean] = useState(true);
  const [selectedButton, setSelectedButton] = useState<'등락률' | '시가총액'>('등락률');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  
  // 초기 데이터 로딩: 화면이 처음 렌더링될 때 한 번만 실행
  useEffect(() => {
    (async () => {
      try {
        const [koreanRes, overseasRes] = await Promise.all([
          getKoreanStock_marketCap(),
          getOverseasStock_marketCap(),
          // getOwnedStockList(), // 임시 주석처리 - 로그인 스킵으로 인한 401 오류 방지
        ]);
        
        setKoreanStocks(koreanRes.data);
        setOverseasStocks(overseasRes.data);
        setHoldings([]); // 빈 배열로 초기화

        // 모든 종목 코드 통합 (보유주식 제외)
        const allCodes = [
          ...koreanRes.data.map((stock: any) => stock.stockCode),
          ...overseasRes.data.map((stock: any) => stock.stockCode),
          // ...holdingsRes.data.map((holding: any) => holding.stockCode) // 임시 주석처리
        ];
        const uniqueCodes = [...new Set(allCodes)]; // 중복 제거
        console.log('allStockCodes 설정됨:', uniqueCodes);
        setAllStockCodes(uniqueCodes);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    })();
  }, []);

  // Hook은 항상 호출되어야 하므로 조건부 호출 제거
  const { prices, isConnected, connectionError } = useStockWebSocket(
    isInitialized && allStockCodes.length > 0 ? allStockCodes : []
  );

  
  
  // 실시간 가격 기준 등락률 정렬
  const getSortedStocks = (stocks: any[], sortType: '등락률' | '시가총액') => {
    if (sortType === '시가총액') {
      return stocks;
    } else {
      return [...stocks].sort((a, b) => {
        const priceA = getCurrentPercentage(a);
        const priceB = getCurrentPercentage(b);
        return priceB - priceA;
      });
    }
  };
  
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

  // 조건부 렌더링: 실시간 데이터 우선, 없으면 직전 종가
  const getCurrentPrice = (stock: any) => {
    return prices[stock.stockCode]?.currentPrice || stock.currentPrice || stock.previousClosingPrice || 0;
  };

  const getCurrentPercentage = (stock: any) => {
    const realtimeData = prices[stock.stockCode];
    if (realtimeData) {
      // 실시간 데이터가 있으면 프론트에서 등락률 계산
      const previousPrice = stock.previousClosingPrice || stock.currentPrice || 0;
      return previousPrice > 0 ? ((realtimeData.currentPrice - previousPrice) / previousPrice) * 100 : 0;
    }
    // 실시간 데이터가 없으면 API 데이터 사용
    return stock.priceChangeRate || 0;
  };

  const filteredHoldings = holdings.filter(h => h.isKorean === isKorean);
  const filteredStocks = isKorean ? koreanStocks : overseasStocks;
  const sortedStocks = getSortedStocks(filteredStocks, selectedButton);

  const StockListToRender = selectedButton === '시가총액' ? MarketCapStockList : StockList;


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
              source={require('../../assets/icons/arrow_drop_down.png')}
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
              filteredHoldings.map((holding, index) => (
                <OwnedStockList
                  key={holding.stockCode}
                  name={holding.stockName}
                  price={getCurrentPrice(holding)}
                  percentage={getCurrentPercentage(holding)}
                  image={holding.profileImageUrl || require("../../assets/icons/red_circle.png")}
                />
              ))
            ) : (
              <Text style={styles.stockInfoText}>보유 주식이 없습니다.</Text>
            )}
          </View>
          <TouchableOpacity style={styles.seeMoreButton} onPress={toggleStockInfo}>
            <Animated.Image
              source={require('../../assets/icons/arrow_drop_down.png')}
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
            {sortedStocks.length > 0 ? (
              sortedStocks.map((stock, index) => (
                 <StockListToRender
                   key={stock.stockCode}
                   name={stock.stockName}
                   price={getCurrentPrice(stock)}
                   percentage={getCurrentPercentage(stock)}
                   image={stock.profileImageUrl || require("../../assets/icons/red_circle.png")}
                   number={index + 1}
                   marketCap={stock.marketCap}
                 />
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