import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { hScale, vScale } from '../../styles/Scale.styles';
import Colors from '../../styles/Color.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StockChart from '../../components/stock/StockChart';
import { useStockChart } from '../../hook/useStockChart';
import { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import HugeButton from '../../components/button/HugeButton';

interface StockChartScreenProps {
  stockCode:string;
  stockName:string;
  stockPrice:number;
}

export default function StockChartScreen({stockCode}: StockChartScreenProps) {
  const {top} = useSafeAreaInsets();

  const [stockMarketOpen, setStockMarketOpen] = useState(true);

  //const stockCode='005930';
  const [period, setPeriod] = useState('1일');

  const {data, loading, error} = useStockChart(stockCode,period);

  if (loading) return <Text>차트 로딩중...</Text>;
  if (error) return <Text>에러: {error}</Text>

  return (
    

    <View style={styles.container}>
      <View style={[styles.headerContainer, {marginTop:top}]}>
        <TouchableOpacity style={styles.headerButton}>
            <Image source={require('../../../assets/icons/left.png')}  />
        </TouchableOpacity>

        <TouchableOpacity style={styles.greenButton}>
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'center' }}>
            <Text style={styles.greenButtonText}>감시가 지정하기</Text>
            <Image style={styles.greenButtonImage} source={require('../../../assets/icons/info.png')}  />
            </View>
        </TouchableOpacity>
      </View>
    
      <Text style={styles.name}>맥도날드</Text>
      <Text style={styles.price}>100,000원</Text>
      <Text style={styles.dollar}>$291.55</Text>
      <Text style={styles.longText}>현재 <Text style={styles.highlightText}>올라가고</Text> 있는 주식이에요!{'\n'}지난 정규장보다 <Text style={styles.highlightText}>+8,036원 (2.0%)</Text></Text>
    

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
                    {stockMarketOpen ? (
                <HugeButton
                    title='구매하기'
                    backgroundColor={Colors.primary}
                    textColor={Colors.white}
                    onPress={() => {}}
                />
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

});