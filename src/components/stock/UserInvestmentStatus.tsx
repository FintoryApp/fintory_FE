import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutAnimation } from 'react-native';
import { styles } from '../../styles/StockMainScreen.styles';

interface UserInvestmentStatusProps {
    totalRate: number;
    totalPrice:number;
    totalPurchase:number;
    totalMoney:number;
}

export default function UserInvestmentStatus({totalRate, totalPrice, totalPurchase, totalMoney}: UserInvestmentStatusProps) {
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(false);

  const toggleUserInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsUserInfoExpanded(!isUserInfoExpanded);
  };

  return (
    <View style={styles.userInfoContainer}>
      <Text style={styles.topContainerText}>내 투자 현황</Text>
      <Text style={styles.percentageText}>{totalRate > 0 ? '+' + totalRate.toFixed(2) + '%' : totalRate.toFixed(2) + '%'}</Text>
      {isUserInfoExpanded && (
        <View>
          <View style={styles.totalPriceContainer}>
            <View style={styles.totalPriceTextContainer}>
              <Text style={styles.totalPriceText}>총 평가금액</Text>
              <Text style={styles.totalPriceValue}>{totalPrice.toLocaleString()+"원"}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.smallBox}>
              <Text style={styles.smallBoxText}>총 매수</Text>
              <Text style={styles.smallBoxText}>{totalPurchase.toLocaleString()+"원"}</Text>
            </View>
            <View style={styles.smallBox}>
              <Text style={styles.smallBoxText}>내 보유 머니</Text>
              <Text style={styles.smallBoxText}>{totalMoney.toLocaleString()+"원"}</Text>
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
  );
}
