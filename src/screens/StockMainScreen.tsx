import React,{useState, useEffect,useRef} from 'react';
import { LayoutAnimation, View, Text, StyleSheet,ScrollView, TouchableOpacity, Animated, Image  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/StockMainScreen.styles';
import TopBar from '../components/TopBar';
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchContainer from '../components/SearchContainer';
import { KoreanStock_marketCap } from '../api/marketcap_korean_stock';
import MarketCapStockList from '../components/MarketCapStockList';
import { OverseasStock_marketCap } from '../api/marketcap_overseas';
import {OverseasStockCodeResponse, getOverseasStockCodes} from '../api/stockCodes';
import { useStockWebSocket } from '../hook/useWebsocket';


const StockInfoBlock = ({name, price, percentage, style}:{name:string, price:number, percentage:number, style?: any}) => {
  return(
    <View style={[simpleStyles.stockInfoBlock, style]}>
      <Image source={require('../../assets/icons/red_circle.png')} style={styles.stockImage} />
      <View style={simpleStyles.stockContainer}>
        <Text style={simpleStyles.stockNameText}>{name}</Text>
        <Text style={simpleStyles.stockPriceText}>{price.toLocaleString()+"원"}</Text>
        <Text style={[
          simpleStyles.stockPercentageText,
          { color: percentage > 0 ?  Colors.red : Colors.blue }
        ]}>
          {percentage > 0 ? '+' + percentage + '%' : percentage + '%'}
        </Text>
      </View>
    </View>
  );
};

const simpleStyles = StyleSheet.create({
  stockInfoBlock: {
    width: hScale(296),
    height: vScale(61.36),
    borderRadius: hScale(8),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginBottom: vScale(8),
  },

  stockContainer: {
    width: hScale(212),
    height: vScale(31.23),
    top: vScale(15.06),
    left: hScale(68.68),
    position: 'absolute',
  },

  stockNameText: {
    fontSize: hScale(16),
    color: Colors.black,
    top: vScale(4.62),
    position: 'absolute',
  },

  stockPriceText: {
    fontSize: hScale(12),
    color: Colors.black,
    top: vScale(1.12),
    right: hScale(0),
    position: 'absolute',
  },

  stockPercentageText: {
    fontSize: hScale(12),
    color: Colors.black,
    top: vScale(14.12),
    right: hScale(0),
    position: 'absolute',
  },
  expandedContent: {
    marginTop: vScale(10),
    paddingHorizontal: hScale(10),
    paddingVertical: vScale(5),
    backgroundColor: Colors.surface,
    borderRadius: hScale(5),
  },
  expandedText: {
    fontSize: hScale(12),
    color: Colors.outline,
    marginBottom: vScale(2),
  },
});

export default function StockMainScreen() {

  const[koreanCodes, setKoreanCodes] = useState<string[]>([]);
  const[overseasCodes, setOverseasCodes] = useState<string[]>([]);
  const {
    prices: koreanPrices,
    isConnected: koreanConnected,
    connectionError: koreanError,
  } = useStockWebSocket(koreanCodes, "korean");

  const {
    prices: overseasPrices,
    isConnected: overseasConnected,
    connectionError: overseasError,
  } = useStockWebSocket(overseasCodes, "overseas");



  const [isDomestic, setIsDomestic] = useState(true);
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(false);
  const [isStockInfoExpanded, setIsStockInfoExpanded] = useState(false);
  
  // 버튼 상태 관리
  const [selectedButton, setSelectedButton] = useState<'등락률' | '시가총액'>('등락률');
  
  // 동적으로 높이 계산
  const baseUserInfoHeight = vScale(112); // 기본 높이 (제목 + 퍼센트 + 버튼)
  const expandedUserInfoHeight = vScale(238); // 확장된 높이 (추가 정보 포함)
  
 
  const stockContainerBaseHeight = vScale(224.72);
  
  // 주식 블록 하나당 높이 (블록 높이 + 마진)
  const stockBlockHeight = vScale(61.36) + vScale(24); // 53.36 + 8px 마진
  
  // 표시할 주식 개수 계산 (하드코딩 제거로 임시 비활성화)
  // const visibleStockCount = isStockInfoExpanded ? stockInfo.length : 2;
  
  // 동적 높이 계산 (하드코딩 제거로 임시 비활성화)
  // const currentStockInfoHeight = stockContainerBaseHeight + visibleStockCount * stockBlockHeight +vScale(48); 
  
  const [userInfoHeight] = useState(new Animated.Value(baseUserInfoHeight));
  const [stockInfoHeight] = useState(new Animated.Value(stockContainerBaseHeight));

  // 1. 회전용 Animated.Value 추가
  const [rotateAnim] = useState(new Animated.Value(0));

  const toggleUserInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsUserInfoExpanded(!isUserInfoExpanded);
  };


  const toggleStockInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsStockInfoExpanded(!isStockInfoExpanded);
  };

  // 3. Animated.Image에 회전값 적용
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const {top} = useSafeAreaInsets();


  const handleSearch = (text: string) => {
  };

  // 하드코딩된 주식 리스트 데이터 제거 - API에서 가져올 예정

  
  const [overseasStock_marketCap, setOverseasStock_marketCap] = useState<any[]>([]);
  const [koreanStock_marketCap, setKoreanStock_marketCap] = useState<any[]>([]);
  
  useEffect(()=>{
    (async()=>{
      try {
        const resOverseas = await OverseasStock_marketCap();
        const resKorean = await KoreanStock_marketCap();

        // 👉 데이터 상태에 세팅 (빠졌던 부분)
        setKoreanStock_marketCap(resKorean.data);
        setOverseasStock_marketCap(resOverseas.data);

        // 👉 웹소켓 코드도 세팅
        setKoreanCodes(resKorean.data.map((stock: any) => stock.stockCode));
        setOverseasCodes(resOverseas.data.map((stock: any) => stock.stockCode));
        
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    })();
  }, []); // ✅ 의존성 배열을 빈 배열로 변경

  // 정렬 함수 (등락률만 정렬, 시가총액은 API에서 이미 정렬됨)
  const getSortedStocks = (stocks: any[], sortType: '등락률' | '시가총액') => {
    if (sortType === '시가총액') {
      // API에서 이미 시가총액순으로 정렬된 데이터 그대로 사용
      return stocks;
    } else {
      // 등락률 정렬 (실시간 가격 기준)
      return [...stocks].sort((a, b) => {
        const priceA = koreanPrices[a.stockCode]?.priceChangeRate || 0;
        const priceB = koreanPrices[b.stockCode]?.priceChangeRate || 0;
        return priceB - priceA;
      });
    }
  };
  

  // WebSocket 연결 상태 디버깅
  console.log('🔍 WebSocket 연결 상태:');
  console.log('한국 주식 연결:', koreanConnected);
  console.log('해외 주식 연결:', overseasConnected);
  console.log('한국 주식 오류:', koreanError);
  console.log('해외 주식 오류:', overseasError);
  console.log('한국 주식 코드 개수:', koreanCodes.length);
  console.log('해외 주식 코드 개수:', overseasCodes.length);
  
  
  return(
    <View >
      <TopBar title="모의 주식"/>
  
      <ScrollView 
        contentContainerStyle={{
          //alignItems:'center',
          paddingBottom: vScale(30),
          backgroundColor: Colors.surface,
          minHeight: '100%',
        }} // paddingBottom 추가
        showsVerticalScrollIndicator={true}
        style={[styles.wholeContainer, {marginTop:top}]}
        
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
            
          <TouchableOpacity 
           style={[
            styles.seeMoreButton,
            ]} 
            onPress={toggleUserInfo}>
            <Animated.Image 
              source={require('../../assets/icons/arrow_drop_down.png')} 
              style={[
                styles.seeMoreButtonImage,
                { transform: [{ rotate: isUserInfoExpanded ? '180deg' : '0deg' }] }
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
            <Text style={styles.stockInfoText}>보유 주식 데이터 로딩 중...</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.seeMoreButton} 
            onPress={toggleStockInfo}
          >
             <Animated.Image 
              source={require('../../assets/icons/arrow_drop_down.png')} 
              style={[
                styles.seeMoreButtonImage,
                { transform: [{ rotate: isStockInfoExpanded ? '180deg' : '0deg' }] }
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
                  <TouchableOpacity style={[styles.domesticButton, {backgroundColor: isDomestic ? Colors.primaryDim : Colors.white}]} onPress={() => setIsDomestic(true)}>
                    <Text style={[styles.domesticButtonText, {color: isDomestic ? Colors.primaryDark : Colors.outlineVariant}]}>국내</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.domesticButton, {backgroundColor: isDomestic ? Colors.white : Colors.primaryDim}]} onPress={() => setIsDomestic(false)}>
                    <Text style={[styles.domesticButtonText, {color: isDomestic ? Colors.outlineVariant : Colors.primaryDark}]}>해외</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.categoryContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.amountButton,
                      selectedButton === '등락률' && styles.selectedButton
                    ]}
                    onPress={() => setSelectedButton('등락률')}
                  >
                    <Text style={[
                      styles.buttonText,
                      selectedButton === '등락률' && styles.selectedButtonText
                    ]}>등락률</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.amountButton, 
                      {width: hScale(61)},
                      selectedButton === '시가총액' && styles.selectedButton
                    ]}
                    onPress={() => setSelectedButton('시가총액')}
                  >
                    <Text style={[
                      styles.buttonText,
                      selectedButton === '시가총액' && styles.selectedButtonText
                    ]}>시가총액</Text>
                  </TouchableOpacity>
                </View>

              </View>

              <SearchContainer 
                onSearch={handleSearch}
                placeholder="주식 검색하기" 
                style={styles.searchContainer}>
                </SearchContainer>

              <View style={styles.stockListContainer}>
                {isDomestic && getSortedStocks(koreanStock_marketCap, selectedButton).map((stock, index) => (
                  <MarketCapStockList     
                    key={stock.stockCode}
                    name={stock.stockName} 
                    price={koreanPrices[stock.stockCode]?.currentPrice || stock.currentPrice || 0}
                    marketCap={stock.marketCap} 
                    image={stock.profileImageUrl || require("../../assets/icons/red_circle.png")}
                    number={index+1}
                  />
                ))}
                
                {!isDomestic && getSortedStocks(overseasStock_marketCap, selectedButton).map((stock, index) => (
                  <MarketCapStockList     
                    key={stock.stockCode}
                    name={stock.stockName} 
                    price={overseasPrices[stock.stockCode]?.currentPrice || stock.currentPrice || 0}
                    marketCap={stock.marketCap} 
                    image={stock.profileImageUrl || require("../../assets/icons/red_circle.png")}
                    number={index+1}
                  />
                ))}
              </View>
        </View>
      </ScrollView>
      </View>
    );
}