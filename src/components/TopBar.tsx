import React from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity } from 'react-native';
import { hScale, vScale } from '../styles/Scale.style';
import Colors from '../styles/Color.styles';

const TopBar = ({ title }: { title: string }) => {
    return (
        <View style={styles.container}>
             <TouchableOpacity style={styles.leftContainer}>    
                <Image source={require('../../assets/icons/left.png')} style={styles.leftImage}/>
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity style={styles.rightContainer}>
                <Image source={require('../../assets/icons/setting.png')} style={styles.rightImage}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width:hScale(361),
        height:vScale(60),
        top:vScale(32),
        backgroundColor: Colors.surface,
    },
    leftContainer: {
        width:hScale(44),
        height:vScale(44),
        top:vScale(8),
        left:hScale(16),
        position: 'absolute',
    },
    leftImage: {
        alignSelf: 'center',
    },
    title: {
        fontSize:hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        textAlign: 'center',
        top:vScale(19),
    },

    rightContainer: {
        width:hScale(44),
        height:vScale(44),
        top:vScale(8),
        left:hScale(301),
        position: 'absolute',
    },
    rightImage: {
        alignSelf: 'center',
    },
});

export default TopBar;