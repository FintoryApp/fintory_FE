// CircleGraph.tsx
import React from 'react';
import {
  View,
  Text,                   // ← 추가
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import { hScale, vScale } from '../styles/Scale.styles';

type CircleGraphProps = {
  data: number[];
  colors: string[];
  labels?: string[];         // ← 이미 선택적 prop
  size?: number;
  innerSize?: number;
};



const CircleGraph = ({
  data,
  colors,
  labels,
  size = hScale(156),
  innerSize = hScale(62.4),
}: CircleGraphProps) => {
  // v4용 데이터 변환
  const series = data.map((value, i) => ({ value, color: colors[i] }));

  return (
    <View style={styles.row}>
      {/* 원형 그래프 */}
      <PieChart
        widthAndHeight={size}
        series={series}
        cover={{ radius: innerSize / size, color: '#FFF' }}
      />

      {/* 범례: labels가 올바르게 넘어왔을 때만 렌더링 */}
      {labels && labels.length === data.length && (
        <View style={styles.legendContainer}>
          {labels.map((label, i) => (
            <View key={i} style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: colors[i] }]}
              />
              <Text style={styles.legendText}>
                {label} ({data[i]})
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CircleGraph;

/* ---------- Style ---------- */
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',    // 그래프 왼쪽, 범례 오른쪽
    alignItems: 'center',
  },
  legendContainer: {
    right:hScale(0),  // 그래프와의 간격
    position:'absolute',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vScale(16),
  },
  colorBox: {
    width: hScale(8),
    height: hScale(8),
    borderRadius: hScale(4),
    marginRight: hScale(8),
  },
  legendText: {
    fontSize: hScale(12),
    color: '#000000',
  },
});
