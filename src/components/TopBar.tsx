import React from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity } from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import Colors from '../styles/Color.styles';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const TopBar = ({ title }: { title: string }) => {
   
    const navigation = useNavigation();
    const {top} = useSafeAreaInsets();
    const styles = StyleSheet.create({
    
        container: {
            width:hScale(360),
            height:vScale(60),
            top:top,
            backgroundColor: Colors.surface,
            flexDirection:'row',
            justifyContent:'space-between',
            paddingTop:vScale(8),
            paddingBottom:vScale(8),
            paddingRight:hScale(3),
            
        },
        leftContainer: {
            width:hScale(44),
            height:vScale(44),
            paddingHorizontal:hScale(8),
            paddingVertical:vScale(6),
            alignItems:'center',
            justifyContent:'center',
        },
        leftImage: {
            //alignSelf: 'center',
        },
    
        title: {
            fontSize:hScale(16),
            fontWeight: 'bold',
            color: Colors.black,
            textAlign: 'center',
            textAlignVertical:'center',
        },
    
        rightContainer: {
            width:hScale(44),
            height:vScale(44),
            alignItems:'center',
            justifyContent:'center',
            
        },
        rightImage: {
           
        },
    });
    
    return (
        <View style={styles.container}>
             <TouchableOpacity style={styles.leftContainer} onPress={() => navigation.goBack()}>    
                <Image source={require('../../assets/icons/left.png')} style={styles.leftImage}/>
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity style={styles.rightContainer}>
                <Image source={require('../../assets/icons/setting.png')} style={styles.rightImage}/>
            </TouchableOpacity>
        </View>
    );
};



export default TopBar;