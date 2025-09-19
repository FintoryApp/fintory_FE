import { LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { makeChartData, formatXAxisLabel, xScale } from "../utils/chart";
import { Text, TouchableOpacity, View } from "react-native";
import Colors from "../styles/Color.styles";
import { hScale, vScale } from "../styles/Scale.styles";
import { Line as SvgLine, Circle, G, Text as SvgText } from "react-native-svg";
import React, { useMemo, useRef, useState } from "react";
import * as d3Scale from "d3-scale";
import LinearGradient from 'react-native-linear-gradient';

interface StockChartProps {
  data: any;
  period: string;
  onPeriodChange: (period: string) => void;
  code: string;
}

export default function StockChart({ data, period, onPeriodChange, code }: StockChartProps) {
  const periods = ["1일", "1주", "3달", "1년", "5년", "전체"];
  if (!data) {
    return (
      <View style={{ width: hScale(360), height: vScale(336), justifyContent: "center", alignItems: "center", backgroundColor: Colors.white }}>
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  const chartData = makeChartData(data, period);
  const [selectedY, setSelectedY] = useState<number | null>(null);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const contentInset = { top : 20, bottom : 20 };
  const chartHeightRef = useRef(0);

  // min / max 계산
  const { minY, maxY, minPoint, maxPoint } = useMemo(() => {
    if (!chartData || chartData.length === 0) return { minY: 0, maxY: 1, minPoint: null, maxPoint: null };
    const ys = chartData.map((p: any) => Number(p.y ?? 0));
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    return {
      minY: min,
      maxY: max === min ? min + 1 : max,
      minPoint: chartData.find((d: any) => d.y === min) || null,
      maxPoint: chartData.find((d: any) => d.y === max) || null,
    };
  }, [chartData]);

  // 터치 시 Y값 보간
  const handleTouch = (evt: any, width: number, height: number) => {
    const { locationX, locationY } = evt.nativeEvent;
    setTouchPosition({ x: locationX, y: locationY });
    const yVal = interpolateY(locationX, width);
    if (yVal != null && locationY >= 0 && locationY <= height) {
      setSelectedY(yVal);
    }
  };

  const interpolateY = (touchX: number, width: number) => {
    if (!chartData || chartData.length === 0) return null;
    const xDomain = [chartData[0].x, chartData[chartData.length - 1].x];
    const xScaleFn = d3Scale.scaleTime().domain(xDomain as [Date, Date]).range([0, width]);
    const xValue: Date = xScaleFn.invert(touchX);

    let left: any = null;
    let right: any = null;
    for (let i = 0; i < chartData.length - 1; i++) {
      const p1 = chartData[i];
      const p2 = chartData[i + 1];
      if (p1.x <= xValue && xValue <= p2.x) {
        left = p1;
        right = p2;
        break;
      }
    }
    if (!left || !right) return null;
    const t = (xValue.getTime() - left.x.getTime()) / (right.x.getTime() - left.x.getTime());
    return left.y + t * (right.y - left.y);
  };

  // ✅ 가로바 표시
  const YMarker = ({ x, y, width }: any) => {
    if (selectedY == null) return null;
    const yy = y(selectedY);
    if (isNaN(yy)) return null;
    return (
      <G>
        <SvgLine x1={0} x2={width} y1={yy} y2={yy} stroke={Colors.outline} strokeWidth={1} strokeDasharray={[4, 4]} />
        <SvgText x={width + 6} y={yy} fontSize={10} fill={Colors.outline} alignmentBaseline="middle">
          {Math.round(selectedY).toLocaleString()}원
        </SvgText>
      </G>
    );
  };

  // ✅ 최대/최소 표시
  // ✅ 최대/최소 표시
const ExtremesMarker = ({ x, y, width, height }: any) => {
    if (!minPoint && !maxPoint) return null;
    
    console.log('ExtremesMarker render:', { width, height, minPoint, maxPoint });
    
    // 안전한 기본값 설정
    const safeWidth = width || hScale(328);
    const safeHeight = height || vScale(240);
    
    // 좌표 보정 함수 제거 - 텍스트가 박스를 벗어나도 괜찮음
    const clampX = (val: number) => val;
    const clampY = (val: number) => val;
  
    return (
      <G>
        {minPoint && (
          <>
            <Circle
              cx={x(minPoint.x)}
              cy={y(minPoint.y)}
              r={3}
              stroke={Colors.red}
              fill={Colors.red}
            />
            <SvgText
              x={clampX(x(minPoint.x) + 5)}
              y={clampY(y(minPoint.y) + 10)}
              fontSize={hScale(8)}
              fill={Colors.red}
              textAnchor="start"
            >
              최저 {minPoint.y.toLocaleString()}원
            </SvgText>
          </>
        )}
        {maxPoint && (
          <>
            <Circle
              cx={x(maxPoint.x)}
              cy={y(maxPoint.y)}
              r={3}
              stroke={Colors.red}
              fill={Colors.red}
            />
            <SvgText
              x={clampX(x(maxPoint.x) -50)}
              y={clampY(y(maxPoint.y))}
              fontSize={hScale(8)}
              fill={Colors.red}
              textAnchor="end"
            >
              최고 {maxPoint.y.toLocaleString()}원
            </SvgText>
          </>
        )}
      </G>
    );
  };
  

  return (
    <View style={{ 
      width: hScale(360), 
      height: vScale(336), 
      flexDirection: "column", 
      backgroundColor: Colors.white,
      alignSelf:'center',

      }}>
      <YAxis data={chartData} yAccessor={({ item }: any) => item.y} contentInset={contentInset} svg={{ fill: "transparent" }} />

      <View style={{ flex: 1 }}>
        <View
          onLayout={(e) => {
            chartHeightRef.current = e.nativeEvent.layout.height;
          }}
          style={{ flex: 1, width: hScale(328), height: vScale(240),marginBottom: vScale(8),borderWidth: 1,alignSelf: 'center',borderColor: Colors.outlineVariant }}
        >
          <LineChart
            style={{ flex: 1 }}
            data={chartData}
            yAccessor={({ item }: any) => item.y}
            xAccessor={({ item }: any) => item.x}
            xScale={xScale}
            svg={{ stroke: Colors.red, strokeWidth: 2 }}
            contentInset={contentInset}
          >
            {/* ✅ Decorator로 교체 */}
            <YMarker />
            <ExtremesMarker />
          </LineChart>

          {/* 선택된 값 표시 */}
          {selectedY && touchPosition && (
            <View
              style={{
                position: "absolute",
                top: Math.max(10, touchPosition.y - 30),
                left: Math.max(10, Math.min(touchPosition.x - 50, hScale(328) - 100)),
                backgroundColor: Colors.white,
                padding: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.outlineVariant,
              }}
            >
              <Text style={{ color: Colors.outline, fontSize: 12, fontWeight: "bold" }}>{Math.round(selectedY).toLocaleString()}원</Text>
            </View>
          )}

          {/* 터치 이벤트 레이어 */}
          <View
            pointerEvents="box-only"
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => handleTouch(e, hScale(328), chartHeightRef.current)}
            onResponderMove={(e) => handleTouch(e, hScale(328), chartHeightRef.current)}
          />
        </View>

        <XAxis
          style={{ marginHorizontal: -10, height: 20 }}
          data={chartData}
          xAccessor={({ item }: any) => item.x}
          scale={xScale}
          formatLabel={(value: any) => formatXAxisLabel(new Date(value), period)}
          svg={{ fill: "transparent" }}
        />
      </View>

      {/* 기간 버튼 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between",alignSelf: 'center', width: hScale(328), height: vScale(24), marginBottom: vScale(16),backgroundColor: Colors.white }}>
        {periods.map((p: string) => (
          <TouchableOpacity
            key={p}
            style={{
              width: hScale(32),
              height: vScale(24),
              justifyContent: "center",
              paddingHorizontal: hScale(4),
              paddingVertical: vScale(4),
              backgroundColor: p === period ? Colors.outlineVariant : Colors.white,
              borderRadius: hScale(4),
            }}
            onPress={() => onPeriodChange(p)}
          >
            <Text style={{ color: Colors.outline, fontSize: hScale(12), fontWeight: "bold", textAlign: "center" }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
