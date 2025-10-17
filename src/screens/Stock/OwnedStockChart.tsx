import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StockChart from '../../components/stock/StockChart';
import { useKoreanStockChart } from '../../hooks/useKoreanStockChart';
import { useOverseasStockChart } from '../../hooks/useOverseasStockChart';
import { useStockWebSocket } from '../../hooks/useWebsocket';
import { useState, useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import HugeButton from '../../components/button/HugeButton';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MiddleButton from '../../components/button/MiddleButton';

type OwnedStockChartScreenRouteProp = RouteProp<RootStackParamList, 'OwnedStockChart'>;
type OwnedStockChartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OwnedStockChart'>;

interface OwnedStockChartScreenProps {
  route: OwnedStockChartScreenRouteProp;
}

export default function OwnedStockChartScreen({route}: OwnedStockChartScreenProps) {
  const {stockCode, stockName, closePrice} = route.params;
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation<OwnedStockChartNavigationProp>();

  const [period, setPeriod] = useState('1일');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // stockCode가 알파벳으로 시작하면 해외주식, 숫자로 시작하면 국내주식
  const isOverseasStock = /^[A-Za-z]/.test(stockCode);
  
  const {data, loading, error, fetchData} = isOverseasStock 
    ? useOverseasStockChart(stockCode, period)
    : useKoreanStockChart(stockCode, period);
  
  // 웹소켓 훅 사용 (해당 주식만 구독)
  const { prices, isConnected, marketStatus, connectionError } = useStockWebSocket(
    isOverseasStock ? [] : [{stockCode}], 
    isOverseasStock ? [{stockCode}] : [],
    !isOverseasStock // 국내 주식이면 true, 해외 주식이면 false
  );

  // 장 상태에 따라 주식 시장 열림 여부 결정
  const isMarketOpen = isOverseasStock 
    ? (marketStatus === 'overseas' || marketStatus === 'both')
    : (marketStatus === 'korean' || marketStatus === 'both');

  // 1분마다 차트 데이터 새로고침
  useEffect(() => {
    // 컴포넌트 마운트 시 interval 설정
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 60000); // 1분 = 60000ms

    // 컴포넌트 언마운트 시 interval 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  if (loading) return <Text>차트 로딩중...</Text>;
  if (error) return <Text>에러: {error?.message || String(error)}</Text>

  return (
    

    <View style={styles.container}>
      <View style={[styles.headerContainer, {marginTop:top}]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../../assets/icons/left.png')}  />
        </TouchableOpacity>

        <TouchableOpacity style={styles.greenButton} onPress={() => navigation.navigate('WantPrice', {
                            stockCode: stockCode, 
                            stockName: stockName, 
                            closePrice: (isConnected && isMarketOpen && prices[stockCode]?.currentPrice) 
                              ? prices[stockCode].currentPrice 
                              : closePrice,
                            currentPrice: (isConnected && isMarketOpen && prices[stockCode]?.currentPrice) 
                              ? prices[stockCode].currentPrice 
                              : closePrice,
                            stockImageUrl: route.params.stockImageUrl || ''
                          })}>
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'center' }}>
            <Text style={styles.greenButtonText}>감시가 지정하기</Text>
            <Image style={styles.greenButtonImage} source={require('../../../assets/icons/info.png')}  />
            </View>
        </TouchableOpacity>
      </View>
      
      {/* 웹소켓 연결 오류 메시지 */}
      {connectionError && (
        <View style={styles.connectionErrorContainer}>
          <Text style={styles.connectionErrorText}>{connectionError}</Text>
        </View>
      )}
    
      <Text style={styles.name}>{stockName}</Text>
      <Text style={styles.price}>
        {(isConnected && isMarketOpen && prices[stockCode]?.currentPrice) 
          ? prices[stockCode].currentPrice.toLocaleString() 
          : closePrice.toLocaleString()
        }{isOverseasStock ? '$' : '원'}
      </Text>
      <Text style={styles.dollar}>$291.55</Text>
      <Text style={styles.longText}>
        현재 <Text style={[
          styles.highlightText,
          { color: (isConnected && isMarketOpen && prices[stockCode]?.priceChange) 
            ? (prices[stockCode].priceChange > 0 ? Colors.red : Colors.primary)
            : Colors.red
          }
        ]}>
          {(isConnected && isMarketOpen && prices[stockCode]?.priceChange) 
            ? (prices[stockCode].priceChange > 0 ? '올라가고' : '내려가고')
            : '올라가고'
          }
        </Text> 있는 주식이에요!{'\n'}
        실시간 기준 <Text style={[
          styles.highlightText,
          { color: (isConnected && isMarketOpen && prices[stockCode]?.priceChange) 
            ? (prices[stockCode].priceChange > 0 ? Colors.red : Colors.primary)
            : Colors.red
          }
        ]}>
          {(isConnected && isMarketOpen && prices[stockCode]?.priceChange) 
            ? `${prices[stockCode].priceChange > 0 ? '+' : ''}${prices[stockCode].priceChange.toLocaleString()}${isOverseasStock ? '$' : '원'} (${prices[stockCode].priceChangeRate > 0 ? '+' : ''}${prices[stockCode].priceChangeRate}%)`
            : isOverseasStock ? '+$8.03 (2.0%)' : '+8,036원 (2.0%)'
          }
        </Text>
      </Text>
    

     {/* 주식 차트 컴포넌트*/}
        <View style={{top: vScale(228),position: 'absolute',width: hScale(360),height: vScale(336),backgroundColor: Colors.white}}>
        <StockChart data={data} code={stockCode} period={period} onPeriodChange={setPeriod} />
        </View>

     
            <LinearGradient 
                colors={['rgba(148, 213, 133, 0)', 'rgba(148, 213, 133, 1)']}
                locations={[0,1]} 
                style={{
                    top: vScale(564),
                    position: 'absolute',
                    alignItems: 'center',
                    width: hScale(360),
                    height: vScale(176)}}
                > 
                <View style={{top: vScale(84)}}>
                    {isMarketOpen ? (
                      <View style={{flexDirection: 'row', gap: hScale(10)}}>
                      <MiddleButton
                          title='구매하기'
                          onPress={() => navigation.navigate('BuyStock', {
                            stockCode: stockCode, 
                            stockName: stockName, 
                            closePrice: (isConnected && isMarketOpen && prices[stockCode]?.currentPrice) 
                              ? prices[stockCode].currentPrice 
                              : closePrice,
                            currentPrice: (isConnected && isMarketOpen && prices[stockCode]?.currentPrice) 
                              ? prices[stockCode].currentPrice 
                              : closePrice,
                            stockImageUrl: route.params.stockImageUrl || ''
                          })}
                      />
                      <MiddleButton
                          title='판매하기'
                          buttonColor={Colors.secondary}
                          textColor={Colors.white}
                          onPress={() => navigation.navigate('SellStock', {
                            stockCode: stockCode, 
                            stockName: stockName, 
                            closePrice: (isConnected && isMarketOpen && prices[stockCode]?.currentPrice) 
                              ? prices[stockCode].currentPrice 
                              : closePrice,
                            currentPrice: (isConnected && isMarketOpen && prices[stockCode]?.currentPrice) 
                              ? prices[stockCode].currentPrice 
                              : closePrice,
                            stockImageUrl: route.params.stockImageUrl || ''
                          })}
                      />
                  </View>
                      
                
                ) : (
                    <HugeButton
                        title='아직 장 시장 전이에요'
                        pressable={false}
                        backgroundColor={Colors.primaryContainer}
                        textColor={Colors.primaryDark}
                        onPress={() => {}}
                    />
                )}
                </View>
                </LinearGradient>

       


    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        //paddingHorizontal: hScale(16),
        height: '100%',

        
    },
    headerContainer: {
        width: hScale(360),
        height: vScale(60),
        paddingVertical: vScale(8),
        paddingRight: hScale(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerButton: {
        width: hScale(44),
        height: vScale(44),
        justifyContent: 'center',
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(6),
    },
    greenButton: {
        width: hScale(117),
        height: vScale(36),
        paddingHorizontal: hScale(12),
        marginRight: hScale(16),
        borderRadius: hScale(8),
        backgroundColor: Colors.primaryDim,
        alignItems: 'center',
        justifyContent: 'center',
        

        
    },
    greenButtonText: {
        fontSize: hScale(12),
        fontWeight: 'bold',
        color: Colors.primaryDark,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    greenButtonImage: {
        marginTop: vScale(2),
        marginLeft: hScale(3),
        tintColor: Colors.primaryDark,
        
    },

    name: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        left: hScale(16),
        top: vScale(117),
        position: 'absolute',
    },

    price: {
        fontSize: hScale(36),
        fontWeight: 'bold',
        color: Colors.black,
        left: hScale(16),
        top: vScale(131),
        position: 'absolute',
    },

    dollar: {
        fontSize: hScale(12),
        color: Colors.outline,
        top: vScale(156),
        left: hScale(186),
        position: 'absolute',
    },

    longText: {
        fontSize: hScale(12),
        top: vScale(188),
        left: hScale(16),
        position: 'absolute',
    },

    highlightText: {
        color: Colors.red, // 또는 원하는 색상으로 변경
    },

    connectionErrorContainer: {
        backgroundColor: Colors.red,
        paddingHorizontal: hScale(16),
        paddingVertical: vScale(12),
        marginHorizontal: hScale(16),
        marginTop: vScale(8),
        borderRadius: hScale(8),
        alignItems: 'center',
    },
    
    connectionErrorText: {
        color: Colors.white,
        fontSize: hScale(14),
        fontWeight: '600',
        textAlign: 'center',
    },

});