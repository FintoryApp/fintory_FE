import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles/Color.styles';
import { hScale, vScale } from '../styles/Scale.styles';

interface BigButtonProps {
    title: string;
    onPress: () => void;
    buttonColor?: string;
    textColor?: string;
    disabled?: boolean;
}

const BigButton: React.FC<BigButtonProps> = ({ title, onPress, buttonColor=Colors.primary, textColor=Colors.white, disabled=false }) => {
    return (
        <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor}]} onPress={onPress}>
            <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: hScale(328),
        height: vScale(56),
        borderRadius: hScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: hScale(10),
        paddingVertical: vScale(10),
    },
    buttonText: {
        fontSize: hScale(16),
        fontWeight: 'bold'
    },
});

export default BigButton;