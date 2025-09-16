import React,{useState, useEffect,useRef} from 'react';
import { LayoutAnimation, View, Text, StyleSheet,ScrollView, TouchableOpacity, Animated, Image  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/StockMainScreen.styles';
import TopBar from '../components/TopBar';
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchContainer from '../components/SearchContainer';
import { KoreanStock } from '../api/marketcap_korean_stock';
import MarketCapStockList from '../components/MarketCapStockList';
import { OverseasStock_marketCap } from '../api/marketcap_overseas';
import {OverseasStockCodeResponse, getOverseasStockCodes} from '../api/stockCodes';
import { useStockWebSocket } from '../hook/useWebsocket';
const stockInfo = [
  {
    name: 'LG',
    price: 294698,
    percentage: 10.5,
    volume: 1234567,
    marketCap: 5000000000000,
  },
  {
    name: '삼성전자',
    price: 294698,
    percentage: -10.5,
    volume: 2345678,
    marketCap: 4000000000000,
  },
  {
    name: 'SK하이닉스',
    price: 156789,
    percentage: 5.2,
    volume: 3456789,
    marketCap: 1000000000000,
  },
  {
    name: '현대차',
    price: 234567,
    percentage: -3.1,
    volume: 4567890,
    marketCap: 2000000000000,
  },
  {
    name: '기아',
    price: 98765,
    percentage: 8.7,
    volume: 5678901,
    marketCap: 800000000000,
  },
];

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

  const[codes, setCodes] = useState<string[]>([]);
  const { prices, isConnected, connectionError } = useStockWebSocket(codes);

  useEffect(()=>{
    (async()=>{
      const overseas = await getOverseasStockCodes();
      setCodes(overseas.map((code: any) => code.stockCode));
    })();
  }, []);


  const [isDomestic, setIsDomestic] = useState(true);
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(false);
  const [isStockInfoExpanded, setIsStockInfoExpanded] = useState(false);
  
  // 버튼 상태 관리
  const [selectedButton, setSelectedButton] = useState<'거래량' | '등락률' | '시가총액'>('거래량');
  
  // 동적으로 높이 계산
  const baseUserInfoHeight = vScale(112); // 기본 높이 (제목 + 퍼센트 + 버튼)
  const expandedUserInfoHeight = vScale(238); // 확장된 높이 (추가 정보 포함)
  
 
  const stockContainerBaseHeight = vScale(224.72);
  
  // 주식 블록 하나당 높이 (블록 높이 + 마진)
  const stockBlockHeight = vScale(61.36) + vScale(24); // 53.36 + 8px 마진
  
  // 표시할 주식 개수 계산
  const visibleStockCount = isStockInfoExpanded ? stockInfo.length : 2;
  
  // 동적 높이 계산
  const currentStockInfoHeight = stockContainerBaseHeight + visibleStockCount * stockBlockHeight +vScale(48); 
  
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

  const stockInfoList = [
    {
      name: 'LG',
      price: 294698,
      percentage: 10.5,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '삼성전자',
      price: 294698,
      percentage: -10.5,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'SK하이닉스',
      price: 156789,
      percentage: 5.2,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '현대차',
      price: 234567,
      percentage: -3.1,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '기아',
      price: 98765,
      percentage: 8.7,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '네이버',
      price: 187654,
      percentage: 2.3,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '카카오',
      price: 456789,
      percentage: -5.8,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'LG화학',
      price: 345678,
      percentage: 7.2,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'POSCO',
      price: 234567,
      percentage: -2.1,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'KB금융',
      price: 123456,
      percentage: 4.5,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '신한지주',
      price: 98765,
      percentage: -1.8,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'LG생활건강',
      price: 567890,
      percentage: 6.7,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '아모레퍼시픽',
      price: 345678,
      percentage: -3.4,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '셀트리온',
      price: 789012,
      percentage: 9.1,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '삼성바이오로직스',
      price: 456789,
      percentage: -4.2,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'SK텔레콤',
      price: 234567,
      percentage: 1.5,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'KT&G',
      price: 123456,
      percentage: -2.7,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: '한국전력',
      price: 98765,
      percentage: 3.8,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'CJ제일제당',
      price: 345678,
      percentage: -1.2,
      image: require('../../assets/icons/red_circle.png'),
    },
    {
      name: 'LG디스플레이',
      price: 234567,
      percentage: 5.6,
      image: require('../../assets/icons/red_circle.png'),
    },
  ];

  
  const [overseasStock_marketCap, setOverseasStock_marketCap] = useState<any[]>([]);
  useEffect(()=>{
    (async()=>{
      try {
        const res = await OverseasStock_marketCap();
        const codes = res.data.map((stock: any) => stock.stockCode);
        setCodes(codes);        
        console.log(res);
        setOverseasStock_marketCap(res.data);
      } catch (error) {
        console.error('Error fetching!!!', error);
      }
    })();
  }, []);

  
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
          <Text style={styles.percentageText}>+22.3%</Text>

          {isUserInfoExpanded && (
              <View>            
              <View style={styles.totalPriceContainer}>
                <View style={styles.totalPriceTextContainer}>
                <Text style={styles.totalPriceText}>총 평가금액</Text>
                <Text style={styles.totalPriceValue}>1,000,200원</Text>
                </View>
                </View>

                <View style={styles.textContainer}>
                  <View style={styles.smallBox}>
                    <Text style={styles.smallBoxText}>총 매수</Text>
                    <Text style={styles.smallBoxText}>1,000,200원</Text>

                  </View>
                  <View style={styles.smallBox}>
                  <Text style={styles.smallBoxText}>내 보유 머니</Text>
                  <Text style={styles.smallBoxText}>1,000,200원</Text>
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
            {stockInfo.slice(0, visibleStockCount).map((stock, index) => (
              <StockInfoBlock 
                key={stock.name}
                name={stock.name} 
                price={stock.price} 
                percentage={stock.percentage} 
                style={{marginBottom: vScale(8)}}
              />
            ))}
            
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
                </View> //whereContainer

                <View style={styles.categoryContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.amountButton,
                      selectedButton === '거래량' && styles.selectedButton
                    ]}
                    onPress={() => setSelectedButton('거래량')}
                  >
                    <Text style={[
                      styles.buttonText,
                      selectedButton === '거래량' && styles.selectedButtonText
                    ]}>거래량</Text>
                  </TouchableOpacity>
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
                </View> //categoryContainer

              </View> //detailContainer

              <SearchContainer 
                onSearch={handleSearch}
                placeholder="주식 검색하기" 
                style={styles.searchContainer}>
                </SearchContainer>

              <View style={styles.stockListContainer}>
                
                {!isDomestic && overseasStock_marketCap.map((stock, index) => (
                  selectedButton === '시가총액' && (
                    <MarketCapStockList     
                      key={stock.stockCode}
                      name={stock.stockName} 
                      price={prices[stock.stockCode]?.currentPrice || stock.price}
                      marketCap={stock.marketCap} 
                      image={stock.image}
                      number={index+1}
                    />
                  )
                ))}
              </View>
        </View>
      </ScrollView>
      </View>
    );
}