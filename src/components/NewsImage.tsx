import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';

export default function NewsImage({ uri }: { uri: string }) {
    const [imageSize, setImageSize] = useState({ width: hScale(100), height: hScale(100) });
    const maxWidth = hScale(296);

    useEffect(() => {
        Image.getSize(uri, (width, height) => {
            // 원본 비율 유지
            const scale = maxWidth / width; 
            if (width > maxWidth) {
                setImageSize({
                    width: maxWidth,
                    height: height * scale,
                });
            } else {
                setImageSize({
                    width,
                    height,
                });
            }
        });
    }, [uri]);

    return (
        <Image
            source={{ uri }}
            style={{
                width: imageSize.width,
                height: imageSize.height,
                //borderRadius: hScale(8),
                alignSelf: 'center',
                marginBottom: vScale(8),
            }}
            resizeMode="cover"
        />
    );
}
