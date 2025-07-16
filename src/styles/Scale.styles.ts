import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const guidelineW = 360;
const guidelineH = 740;

const hScale = (s: number) => {
    const newSize = (W / guidelineW) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
  
const vScale = (s: number) => {
    const newSize = (H / guidelineH) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// 화면 비율에 따른 동적 크기 조정
const responsiveSize = (size: number, baseWidth: number = guidelineW) => {
    const scale = W / baseWidth;
    return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// 화면 너비의 퍼센트로 크기 설정
const widthPercentage = (percentage: number) => {
    return (W * percentage) / 100;
};

// 화면 높이의 퍼센트로 크기 설정
const heightPercentage = (percentage: number) => {
    return (H * percentage) / 100;
};

// 최소/최대 크기 제한이 있는 반응형 크기
const clampedSize = (size: number, min: number, max: number) => {
    const scaledSize = hScale(size);
    return Math.max(min, Math.min(max, scaledSize));
};

export { hScale, vScale, responsiveSize, widthPercentage, heightPercentage, clampedSize };