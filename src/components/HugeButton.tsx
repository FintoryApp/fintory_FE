import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles/Color.styles';
import { hScale, vScale } from '../styles/Scale.styles';

interface HugeButtonProps {
    title: string;
    onPress: () => void;
    backgroundColor?: string;
    textColor?: string;
}

const HugeButton: React.FC<HugeButtonProps> = ({ title, onPress, backgroundColor, textColor }) => {
    return (
        <TouchableOpacity 
            style={[styles.button, { backgroundColor }]} 
            onPress={onPress}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: hScale(328),
        height: vScale(72),
        borderRadius: hScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: hScale(20),
    },
    buttonText: {
        fontSize: hScale(24),
        fontWeight: 'bold',
    },
});

export default HugeButton;