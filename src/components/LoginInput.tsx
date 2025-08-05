import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';

interface LoginInputProps {
    titleText: string;
    placeholderText: string;
    value: string;
    checkText: string;
    onChangeText: (text: string) => void;
    showVerificationButton?: boolean;
    onVerificationPress?: () => void;
    verificationButtonText?: string;
    secureTextEntry?: boolean;
}

const LoginInput: React.FC<LoginInputProps> = ({ 
    titleText, 
    placeholderText, 
    value, 
    onChangeText, 
    checkText,
    showVerificationButton = false,
    onVerificationPress,
    verificationButtonText,
    secureTextEntry = false
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.titleContainer}>
                <Text style={styles.text}>{titleText}</Text>
                {showVerificationButton && (
                <TouchableOpacity style={styles.verificationButton} onPress={onVerificationPress}>
                    <Text style={styles.verificationButtonText}>{verificationButtonText}</Text>
                </TouchableOpacity>
                )}
                </View>
                
                    <TextInput  
                        style={styles.input}
                        placeholder={placeholderText} 
                        value={value} 
                        onChangeText={onChangeText} 
                        placeholderTextColor={Colors.middleGray} 
                        secureTextEntry={secureTextEntry}
                    />

            </View>

            <Text style={styles.checkText}>{checkText}</Text>
        </View>
    );
};      

const styles = StyleSheet.create({
    container: {
        width: hScale(328),
        height: vScale(90),
        marginBottom: vScale(4),
        alignContent: 'center',
    },
    inputContainer: {
        width: hScale(328),
        height: vScale(70),
        marginBottom: vScale(4),
    },
    titleContainer: {
        width: hScale(328),
        height: vScale(24),
        marginBottom: vScale(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        marginRight: hScale(8),
    },
    
    input: {
        fontSize: hScale(12),
        color: Colors.black,
        height: vScale(40),
        borderWidth: 1,
        borderColor: Colors.middleGray,
        borderRadius: hScale(4),
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(12),
    },
    
   
    checkText: {
        marginTop: vScale(8),
        fontSize: hScale(12),
        color: Colors.red,
    },
    verificationButton: {
        width: hScale(90),
        height: vScale(24),
        backgroundColor: Colors.middleGray,
        borderRadius: hScale(8),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(4),
    },
    verificationButtonText: {
        fontSize: hScale(12),
        color: Colors.white,
    },
});

export default LoginInput;