import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../styles/Color.styles';
import { hScale, vScale } from '../styles/Scale.styles';
import { PointCardProps, InvestmentItemProps, VirtualMoneyCardProps, ChallengeCardProps } from '../types/MyPageTypes';
import { MY_PAGE_CONSTANTS } from '../constants/MyPageConstants';

// 가상 머니 카드 컴포넌트
export const VirtualMoneyCard = ({ onPress }: VirtualMoneyCardProps) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{MY_PAGE_CONSTANTS.UI_TEXT.MY_VIRTUAL_MONEY}</Text>
    <TouchableOpacity style={styles.cardButton} onPress={onPress}>
      <Text style={styles.cardButtonText}>{MY_PAGE_CONSTANTS.UI_TEXT.ACCOUNT_VIEW}</Text>
      <Image 
        source={require('../../assets/icons/right.png')} 
        style={[styles.arrowIcon, { tintColor: Colors.primaryDark }]} 
      />
    </TouchableOpacity>
  </View>
);

// 포인트 카드 컴포넌트
export const PointCard = ({ 
  totalPoint, 
  onPress, 
  isLoading = false, 
  hasError = false 
}: PointCardProps) => {
  const getPointDisplayText = () => {
    if (isLoading) return MY_PAGE_CONSTANTS.UI_TEXT.LOADING;
    if (hasError) return MY_PAGE_CONSTANTS.UI_TEXT.ERROR;
    return `${totalPoint} P`;
  };

  const getPointTextStyle = () => {
    if (isLoading) return [styles.pointText, { color: Colors.outline, opacity: 0.6 }];
    if (hasError) return [styles.pointText, { color: '#FF6B6B' }];
    return styles.pointText;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{MY_PAGE_CONSTANTS.UI_TEXT.MY_POINT}</Text>
      <TouchableOpacity style={styles.cardButton} onPress={onPress} disabled={isLoading}>
        <Text style={getPointTextStyle()}>{getPointDisplayText()}</Text>
        <Image 
          source={require('../../assets/icons/right.png')} 
          style={[styles.arrowIcon, { tintColor: Colors.outline }]} 
        />
      </TouchableOpacity>
    </View>
  );
};

// 투자 항목 컴포넌트
const InvestmentItem = ({ label, value }: InvestmentItemProps) => (
  <View style={styles.investmentItem}>
    <Text style={styles.investmentLabel}>{label}</Text>
    <Text style={styles.investmentValue}>{value}</Text>
  </View>
);

// 세로 구분선 컴포넌트
const VerticalDivider = () => <View style={styles.verticalDivider} />;

// 투자 요약 카드 컴포넌트
export const InvestmentSummaryCard = () => (
  <View style={styles.investmentCard}>
    <InvestmentItem label="평가금액" value={MY_PAGE_CONSTANTS.INVESTMENT_DATA.EVALUATION_AMOUNT} />
    <VerticalDivider />
    <InvestmentItem label="수익률" value={MY_PAGE_CONSTANTS.INVESTMENT_DATA.RETURN_RATE} />
    <VerticalDivider />
    <InvestmentItem label="총 매수" value={MY_PAGE_CONSTANTS.INVESTMENT_DATA.TOTAL_PURCHASE} />
  </View>
);

// 챌린지 카드 컴포넌트
export const ChallengeCard = ({ onPress }: ChallengeCardProps = {}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{MY_PAGE_CONSTANTS.UI_TEXT.CHALLENGE_TITLE}</Text>
    <TouchableOpacity style={styles.cardButton} onPress={onPress}>
      <Image 
        source={require('../../assets/icons/right.png')} 
        style={[styles.arrowIcon, { tintColor: Colors.outline }]} 
      />
    </TouchableOpacity>
  </View>
);

// 스타일 정의
const styles = StyleSheet.create({
  card: {
    width: hScale(328),
    height: vScale(56),
    backgroundColor: Colors.white,
    borderRadius: hScale(16),
    paddingVertical: vScale(16),
    paddingHorizontal: hScale(16),
    marginBottom: vScale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  cardTitle: {
    fontSize: hScale(16),
    color: Colors.black,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: hScale(16),
    color: Colors.primaryDark,
  },
  pointText: {
    fontSize: hScale(24),
    color: Colors.outline,
  },
  arrowIcon: {
    width: hScale(24),
    height: vScale(24),
  },
  investmentCard: {
    width: hScale(328),
    height: vScale(92),
    backgroundColor: Colors.primaryDim,
    borderRadius: hScale(16),
    paddingVertical: vScale(16),
    paddingHorizontal: hScale(16),
    marginBottom: vScale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  investmentItem: {
    width: hScale(98),
    height: vScale(54),
    alignItems: 'center',
    justifyContent: 'center',
  },
  investmentLabel: {
    fontSize: hScale(12),
    color: Colors.primaryDark,
  },
  investmentValue: {
    fontSize: hScale(16),
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  verticalDivider: {
    width: hScale(1),
    height: vScale(60),
    backgroundColor: Colors.white,
  },
});
