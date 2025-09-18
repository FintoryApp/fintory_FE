declare module 'react-native-svg-charts' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';
  import React from 'react';

  export interface LineChartProps {
    data: any[];
    style?: ViewStyle;
    yAccessor?: ({ item }: { item: any }) => number;
    xAccessor?: ({ item }: { item: any }) => any;
    xScale?: any;
    svg?: {
      stroke?: string;
      strokeWidth?: number;
    };
    contentInset?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    curve?: any;
    // children?: (props: { y: (value: number) => number; x: (value: any) => number; width: number; height: number }) => React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
  }

  export interface XAxisProps {
    data: any[];
    style?: ViewStyle;
    xAccessor?: ({ item }: { item: any }) => any;
    scale?: any;
    formatLabel?: (value: any) => string;
    svg?: {
      fontSize?: number;
      fill?: string;
    };
  }

  export interface YAxisProps {
    data: any[];
    yAccessor?: ({ item }: { item: any }) => number;
    contentInset?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    svg?: {
      fontSize?: number;
      fill?: string;
    };
  }

  export class LineChart extends Component<LineChartProps> {}
  export class XAxis extends Component<any> {}
  export class YAxis extends Component<any> {}
}
