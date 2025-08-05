import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles/Color.styles';
import { hScale, vScale } from '../styles/Scale.styles';

interface SmallButtonProps {
    title: string;
    onPress: () => void;
}

const SmallButton: React.FC<SmallButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: hScale(156),
        height: vScale(56),
        borderRadius: hScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: hScale(10),
        paddingVertical: vScale(10),
    },
    buttonText: {
        fontSize: hScale(16),
    },
});

export default SmallButton;