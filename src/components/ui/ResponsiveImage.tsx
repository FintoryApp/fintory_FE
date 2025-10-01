import React from 'react';
import { Image, ImageStyle, ImageSourcePropType } from 'react-native';
import { hScale, vScale } from '../../styles/Scale.styles';

interface ResponsiveImageProps {
  source: ImageSourcePropType;
  width?: number;
  height?: number;
  aspectRatio?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  style?: ImageStyle;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  width,
  height,
  aspectRatio,
  resizeMode = 'contain',
  style,
}) => {
  const imageStyle: ImageStyle = {
    width: width ? hScale(width) : undefined,
    height: height ? vScale(height) : undefined,
    aspectRatio,
    resizeMode,
    ...style,
  };

  return <Image source={source} style={imageStyle} />;
};

export default ResponsiveImage; 