import React,{useState} from 'react';
import { View, Text, StyleSheet,ScrollView, Image, TouchableOpacity, ImageBackground, Animated  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/StockMainScreen.styles';
import CustomCalendar from '../components/Calendar';
import TopBar from '../components/TopBar';
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

const stockInfo = [
  {
    name: 'LG',
    price: 294698,
    percentage: 10.5,
  },
  {
    name: '삼성전자',
    price: 294698,
    percentage: -10.5,
  },
  {
    name: 'SK하이닉스',
    price: 156789,
    percentage: 5.2,
  },
  {
    name: '현대차',
    price: 234567,
    percentage: -3.1,
  },
  {
    name: '기아',
    price: 98765,
    percentage: 8.7,
  },
];

const StockInfoBlock = ({name, price, percentage, style}:{name:string, price:number, percentage:number, style?: any}) => {
  return(
    <View style={[simpleStyles.stockInfoBlock, style]}>
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
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(false);
  const [isStockInfoExpanded, setIsStockInfoExpanded] = useState(false);
  
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
    const toValue = isUserInfoExpanded ? baseUserInfoHeight : expandedUserInfoHeight;
    Animated.timing(userInfoHeight, {
      toValue,
      useNativeDriver: false,
    }).start();
    setIsUserInfoExpanded(!isUserInfoExpanded);
  };

  // 2. toggleStockInfo에서 동시에 애니메이션
  const toggleStockInfo = () => {
    const toValue = isStockInfoExpanded ? stockContainerBaseHeight : currentStockInfoHeight;
    const rotateToValue = isStockInfoExpanded ? 0 : 1;
    Animated.parallel([
      Animated.timing(stockInfoHeight, {
        toValue,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: rotateToValue,
        useNativeDriver: true,
      }),
    ]).start();
    setIsStockInfoExpanded(!isStockInfoExpanded);
  };

  // 3. Animated.Image에 회전값 적용
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return(
    <View style={styles.wholeContainer}>
      <TopBar title="모의 주식"/>
      <View style={styles.topContainer}>  
        <Animated.View style={[styles.userInfoContainer, { height: userInfoHeight }]}>
          <Text style={styles.topContainerText}>내 투자 현황</Text>
          <Text style={styles.percentageText}>+22.3%</Text>
          
          {/* {isUserInfoExpanded && (
            
          )} */}
          
          <TouchableOpacity style={[
            styles.seeMoreButton,
            {
              position:'absolute',
              top:isUserInfoExpanded ? vScale(214) : vScale(88),
            }]} onPress={toggleUserInfo}>
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
        </Animated.View>

        <Animated.View style={[styles.stockInfoContainer, { height: stockInfoHeight }]}>
          <Text style={styles.stockInfoText}>나의 보유 주식</Text>
          <View style={[styles.stockInfoBlockContainer]}>
            {stockInfo.slice(0, visibleStockCount).map((stock, index) => (
              <StockInfoBlock 
                key={stock.name}
                name={stock.name} 
                price={stock.price} 
                percentage={stock.percentage} 
                style={{position:'absolute',top:index*(stockBlockHeight-vScale(16))}}
              />
            ))}
            
          </View>
          <TouchableOpacity 
            style={[styles.seeMoreButton, 
              {
                bottom:vScale(16),
                position:'absolute',
                }]} 
            onPress={toggleStockInfo}
          >
            <Animated.Image 
              source={require('../../assets/icons/arrow_drop_down.png')} 
              style={[
                styles.seeMoreButtonImage,
                { transform: [{ rotate }] }
              ]}
            />
            <Text style={styles.seeMoreButtonText}>
              {isStockInfoExpanded ? '닫기' : '더보기'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}