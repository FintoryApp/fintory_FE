import React,{useState} from 'react';
import { View, Text, StyleSheet,ScrollView, Image, TouchableOpacity, ImageBackground  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/StockMainScreen.styles';
import CustomCalendar from '../components/Calendar';
import TopBar from '../components/TopBar';
import { hScale, vScale } from '../styles/Scale.style';
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
    height: vScale(53.36),
    borderRadius: hScale(8),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.outline,
  },

  stockContainer: {
    width: hScale(216),
    height: vScale(31.23),
    top: vScale(11.06),
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
});

export default function StockMainScreen() {
  return(
    <View style={styles.wholeContainer}>
      <TopBar title="모의 주식"/>
  <View style={styles.topContainer}>  
    <View style={styles.userInfoContainer}>
    <Text style={styles.topContainerText}>내 투자 현황</Text>
    <Text style={styles.percentageText}>+22.3%</Text>
    <TouchableOpacity style={styles.seeMoreButton}>
      <Image source={require('../../assets/icons/arrow_drop_down.png')} style={styles.seeMoreButtonImage}/>
      <Text style={styles.seeMoreButtonText}>더보기</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.stockInfoContainer}>
      <Text style={styles.stockInfoText}>나의 보유 주식</Text>
      <View style={styles.stockInfoBlockContainer}>
      <StockInfoBlock 
      name={stockInfo[0].name} 
      price={stockInfo[0].price} 
      percentage={stockInfo[0].percentage} 
      style={{position:'absolute'}}/>

      <StockInfoBlock 
      name={stockInfo[1].name} 
      price={stockInfo[1].price} 
      percentage={stockInfo[1].percentage} 
      style={{position:'absolute',top:vScale(61.36)}}/>
    </View>

    <TouchableOpacity style={[styles.seeMoreButton, {position:'absolute',top:vScale(177),left:hScale(144)}]}>
      <Image source={require('../../assets/icons/arrow_drop_down.png')} style={styles.seeMoreButtonImage}/>
      <Text style={styles.seeMoreButtonText}>더보기</Text>
    </TouchableOpacity>
    </View>
  </View>
  </View>//wholeContainer end
  );
}