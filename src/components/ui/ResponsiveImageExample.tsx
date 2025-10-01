import React from 'react';
import { View, StyleSheet } from 'react-native';
import ResponsiveImage from './ResponsiveImage';
import { hScale, vScale, widthPercentage, heightPercentage, clampedSize } from '../../styles/Scale.styles';

const ResponsiveImageExample: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 기본 반응형 이미지 */}
      <ResponsiveImage
        source={require('../../../assets/icons/logo.gif')}
        width={100}
        height={100}
        resizeMode="contain"
      />

      {/* 화면 너비의 50%로 설정 */}
      <ResponsiveImage
        source={require('../../../assets/icons/home.png')}
        width={widthPercentage(50)}
        height={vScale(80)}
        resizeMode="contain"
      />

      {/* 정사각형 비율 유지 */}
      <ResponsiveImage
        source={require('../../../assets/characters/fire_character.png')}
        width={hScale(120)}
        aspectRatio={1}
        resizeMode="contain"
      />

      {/* 최소/최대 크기 제한 */}
      <ResponsiveImage
        source={require('../../../assets/icons/setting.png')}
        width={clampedSize(60, 40, 80)}
        height={clampedSize(60, 40, 80)}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: vScale(20),
  },
});

export default ResponsiveImageExample; 