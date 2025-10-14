import React, { useMemo, useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LineChart, YAxis } from "react-native-svg-charts";
import { Line as SvgLine, Circle, G, Text as SvgText } from "react-native-svg";
import * as d3Scale from "d3-scale";

import { 
  makeChartData, 
  formatXAxisLabel, 
  xScale,
  getNumberOfTicks,
  getSelectedXAxisIndices
} from "../../utils/chart";
import Colors from "../../styles/Color.styles";
import { hScale, vScale } from "../../styles/Scale.styles";

interface StockChartProps {
  data: any;
  period: string;
  onPeriodChange: (period: string) => void;
  code: string;
}



/* =========================
 *  컴포넌트
 * ========================= */
export default function StockChart({ data, period, onPeriodChange, code }: StockChartProps) {
  const periods = ["1일", "1주", "3달", "1년", "5년", "전체"];

  if (!data) {
    return (
      <View style={{ width: hScale(360), height: vScale(336), justifyContent: "center", alignItems: "center", backgroundColor: Colors.white }}>
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  const [selectedY, setSelectedY] = useState<number | null>(null);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // makeChartData: {x: Date, y: number}[], 오름차순 정렬/유효성 보장
  const chartData = useMemo(() => {
    return makeChartData(data, period);
  }, [data, period, currentTime]); // currentTime이 변경될 때마다 차트 데이터 재계산
  const contentInset = { top: 20, bottom: 20 };
  const chartHeightRef = useRef(0);

  // 1분마다 현재 시간 업데이트 (1일 기간일 때만)
  useEffect(() => {
    if (period !== "1일") return;

    const updateTime = () => {
      setCurrentTime(new Date());
    };

    // 즉시 실행
    updateTime();

    // 1분마다 업데이트
    const interval = setInterval(updateTime, 60000); // 60초 = 1분

    return () => clearInterval(interval);
  }, [period]);

  // min / max 계산 (closePrice 기준)
  const { minY, maxY, minPoint, maxPoint } = useMemo(() => {
    if (!chartData?.length) return { minY: 0, maxY: 1, minPoint: null, maxPoint: null };
    const ys = chartData.map((p: any) => Number(p.y ?? 0));
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const minPoint = chartData.find((d: any) => d.y === min) || null;
    const maxPoint = chartData.find((d: any) => d.y === max) || null;
    return { minY: min, maxY: max === min ? min + 1 : max, minPoint, maxPoint };
  }, [chartData]);

  // 터치 보간
  const handleTouch = (evt: any, width: number, height: number) => {
    const { locationX, locationY } = evt.nativeEvent;
    setTouchPosition({ x: locationX, y: locationY });
    const yVal = interpolateY(locationX, width);
    if (yVal != null && locationY >= 0 && locationY <= height) setSelectedY(yVal);
  };

  const interpolateY = (touchX: number, width: number) => {
    if (!chartData?.length) return null;
    const xDomain = [chartData[0].x, chartData[chartData.length - 1].x];
    const xScaleFn = d3Scale.scaleTime().domain(xDomain as [Date, Date]).range([0, width]);
    const xValue: Date = xScaleFn.invert(touchX);

    let left: any = null, right: any = null;
    for (let i = 0; i < chartData.length - 1; i++) {
      const p1 = chartData[i], p2 = chartData[i + 1];
      if (p1.x <= xValue && xValue <= p2.x) { left = p1; right = p2; break; }
    }
    if (!left || !right) return null;
    const t = (xValue.getTime() - left.x.getTime()) / (right.x.getTime() - left.x.getTime());
    return left.y + t * (right.y - left.y);
  };

  // 가로 보조선 + 라벨
  const YMarker = ({ x, y, width }: any) => {
    if (selectedY == null) return null;
    const yy = y(selectedY);
    if (!isFinite(yy)) return null;
    return (
      <G>
        <SvgLine x1={0} x2={width} y1={yy} y2={yy} stroke={Colors.outline} strokeWidth={1} strokeDasharray={[4, 4]} />
        <SvgText x={width - 4} y={yy} fontSize={10} fill={Colors.outline} alignmentBaseline="middle" textAnchor="end">
          {Math.round(selectedY).toLocaleString()}원
        </SvgText>
      </G>
    );
  };

  // 최대/최소 표시
  const ExtremesMarker = ({ x, y, width, height }: any) => {
    if (!minPoint && !maxPoint) return null;
    const pad = 6;
    const label = (pt: any, text: string, above = true) => (
      <>
        <Circle cx={x(pt.x)} cy={y(pt.y)} r={3} stroke={Colors.red} fill={Colors.red} />
        <SvgText
          x={Math.min(Math.max(x(pt.x), pad), width - pad)}
          y={above ? Math.max(y(pt.y) - 10, pad) : Math.min(y(pt.y) + 12, height - pad)}
          fontSize={hScale(8)}
          fill={Colors.red}
          textAnchor="middle"
        >
          {text}
        </SvgText>
      </>
    );
    return (
      <G>
        {minPoint && label(minPoint, `최저 ${minPoint.y.toLocaleString()}원`, false)}
        {maxPoint && label(maxPoint, `최고 ${maxPoint.y.toLocaleString()}원`, true)}
      </G>
    );
  };

  return (
    <View style={{ width: hScale(360), height: vScale(336), flexDirection: "column", backgroundColor: Colors.white, alignSelf: "center" }}>
      <YAxis
        data={chartData}
        yAccessor={({ item }: any) => item.y}
        contentInset={contentInset}
        svg={{ fill: "transparent" }}
      />

      <View style={{ flex: 1 }}>
        <View
          onLayout={(e) => { chartHeightRef.current = e.nativeEvent.layout.height; }}
          style={{ flex: 1, width: hScale(328), height: vScale(240), marginBottom: vScale(8), borderWidth: 1, alignSelf: "center", borderColor: Colors.outlineVariant }}
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
            <YMarker />
            <ExtremesMarker />
          </LineChart>

          {selectedY !== null && touchPosition && (
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
              <Text style={{ color: Colors.outline, fontSize: 12, fontWeight: "bold" }}>
                {Math.round(selectedY).toLocaleString()}원
              </Text>
            </View>
          )}

          <View
            pointerEvents="box-only"
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => handleTouch(e, hScale(328), chartHeightRef.current)}
            onResponderMove={(e) => handleTouch(e, hScale(328), chartHeightRef.current)}
          />
        </View>

        {/* ===== 커스텀 XAxis 라벨 ===== */}
        <View style={{ 
          height: vScale(20), 
          width: hScale(328),
          alignSelf: 'center',
          position: 'relative',
         //marginTop: 2
        }}>
          {(() => {
            const selectedIndices = getSelectedXAxisIndices(chartData, period);
            return selectedIndices.map((index, labelIndex) => {
              const dataPoint = chartData[index];
              if (!dataPoint) return null;
              
              // 모든 기간에 대해 통일된 라벨 생성
              const labelText = formatXAxisLabel(dataPoint.x, period);
              
              // 1일 기간의 경우 시간 라벨이 짧으므로 너비 조정
              const labelWidth = period === "1일" ? 50 : 60;
              
              // 첫 번째와 마지막 라벨은 양 끝에, 중간 라벨은 중앙에 위치
              let leftPosition;
              if (labelIndex === 0) {
                // 첫 번째 라벨: 왼쪽 끝에 가깝게
                leftPosition = 2;
              } else if (labelIndex === selectedIndices.length - 1) {
                // 마지막 라벨: 오른쪽 끝에 가깝게
                leftPosition = hScale(328) - labelWidth - 2; // 라벨 너비 고려
              } else {
                // 중간 라벨: 중앙에
                leftPosition = hScale(328) / 2 - labelWidth / 2; // 라벨 너비의 절반만큼 조정
              }
              
              return (
                <View
                  key={index}
                  style={{
                    position: 'absolute',
                    left: leftPosition,
                    top: 0,
                    //height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: labelWidth
                  }}
                >
                  <Text
                    style={{
                      color: Colors.outline,
                      fontSize: hScale(10),
                      fontWeight: '500',
                      textAlign: 'center'
                    }}
                  >
                    {labelText}
                  </Text>
                </View>
              );
            });
          })()}
        </View>

      </View>

      {/* 기간 버튼 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: hScale(328), height: vScale(24), marginBottom: vScale(16), backgroundColor: Colors.white }}>
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
            <Text style={{ color: Colors.outline, fontSize: hScale(12), fontWeight: "bold", textAlign: "center" }}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
