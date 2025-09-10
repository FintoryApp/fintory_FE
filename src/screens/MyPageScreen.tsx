import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import TopBar from '../components/TopBar';
import Colors from '../styles/Color.styles';
import Profile from '../components/Profile';
import { hScale,vScale} from '../styles/Scale.styles';
import AttendCalendar from '../components/AttendCalendar';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VirtualAccountNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VirtualAccount'>;
type PointNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Point'>;

export default function MyPageScreen() {
    const navigation = useNavigation<VirtualAccountNavigationProp>();
    const pointNavigation = useNavigation<PointNavigationProp>();
    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface,alignItems:'center'}}>
        <TopBar title='마이페이지' />
        <ScrollView contentContainerStyle={{alignItems:'center'}}>
        <Profile name='홍길동' image={require('../../assets/icons/profile.png')} id='1234567890' />
        
        <View style={{width:hScale(328),height:vScale(755)}}>
            <View style={{
                width:hScale(328),
                height:vScale(56),
                backgroundColor:Colors.white,
                borderRadius:hScale(16),
                paddingVertical:vScale(16),
                paddingHorizontal:hScale(16),
                marginBottom:vScale(16),
                alignItems:'center',
                justifyContent:'space-between',
                flexDirection:'row'
            }}>
                <Text style={{fontSize:hScale(16),color:Colors.black}}>
                    나의 가상 머니
                </Text>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => navigation.navigate('VirtualAccount')}>
                <Text style={{fontSize:hScale(16),color:Colors.primaryDark}}>
                        계좌보기
                    </Text>
                    <Image source={require('../../assets/icons/right.png')} 
                    style={{width:hScale(24),height:vScale(24),tintColor:Colors.primaryDark}} />
                    
                </TouchableOpacity>
            </View>

            <View style={{
                width:hScale(328),
                height:vScale(65),
                backgroundColor:Colors.white,
                borderRadius:hScale(16),
                paddingVertical:vScale(16),
                paddingHorizontal:hScale(16),
                marginBottom:vScale(16),
                alignItems:'center',
                justifyContent:'space-between',
                flexDirection:'row'
            }}>
                <Text style={{fontSize:hScale(16),color:Colors.black}}>
                    나의 포인트
                </Text>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => pointNavigation.navigate('Point')}>
                <Text style={{fontSize:hScale(24),color:Colors.outline}}>
                        1000 P
                    </Text>
                    <Image source={require('../../assets/icons/right.png')} 
                    style={{width:hScale(24),height:vScale(24),tintColor:Colors.outline}} />
                </TouchableOpacity>
            </View>

            <View style={{
                width:hScale(328),
                height:vScale(92),
                backgroundColor:Colors.primaryDim,
                borderRadius:hScale(16),
                paddingVertical:vScale(16),
                paddingHorizontal:hScale(16),
                marginBottom:vScale(16),
                alignItems:'center',
                justifyContent:'space-between',
                flexDirection:'row'
            }}>

                {/* 평가금액 */}
                <View style={{width:hScale(98),height:vScale(54),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:hScale(12),color:Colors.primaryDark}}>
                        평가금액
                    </Text>
                    <Text style={{fontSize:hScale(16),color:Colors.primaryDark,fontWeight:'bold'}}>
                        10,000,000
                    </Text>
                </View>

                {/* 세로선 1 */}
                <View style={{
                    width: hScale(1),
                    height: vScale(60),
                    backgroundColor: Colors.white,
                }} />

                {/* 수익률 */}
                <View style={{width:hScale(98),height:vScale(54),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:hScale(12),color:Colors.primaryDark}}>
                        수익률
                    </Text>
                    <Text style={{fontSize:hScale(16),color:Colors.primaryDark,fontWeight:'bold'}}>
                        +33.6%
                    </Text>
                </View>

                {/* 세로선 2 */}
                <View style={{
                    width: hScale(1),
                    height: vScale(60),
                    backgroundColor: Colors.white,
                }} />

                {/* 총 매수 */}
                <View style={{width:hScale(98),height:vScale(54),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:hScale(12),color:Colors.primaryDark}}>
                        총 매수
                    </Text>
                    <Text style={{fontSize:hScale(16),color:Colors.primaryDark,fontWeight:'bold'}}>
                        2,456,700
                    </Text>
                </View>


                </View>

                <View style={{
                width:hScale(328),
                height:vScale(56),
                backgroundColor:Colors.white,
                borderRadius:hScale(16),
                paddingVertical:vScale(16),
                paddingHorizontal:hScale(16),
                marginBottom:vScale(16),
                alignItems:'center',
                justifyContent:'space-between',
                flexDirection:'row'
            }}>
                <Text style={{fontSize:hScale(16),color:Colors.black}}>
                   이번달 챌린지 확인하기
                </Text>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}>
                
                    <Image source={require('../../assets/icons/right.png')} 
                    style={{width:hScale(24),height:vScale(24),tintColor:Colors.outline}} />
                    
                </TouchableOpacity>
            </View>

            <View style={{
                width:hScale(328),
                height:vScale(422),
                backgroundColor:Colors.white,
                borderRadius:hScale(16),
                paddingVertical:vScale(16),
                paddingHorizontal:hScale(16),
                marginBottom:vScale(16),
                alignItems:'center',
                justifyContent:'space-between',
                flexDirection:'row'}}>
                <AttendCalendar />
                </View>




            </View>
            </ScrollView>
        </View>

        
    );
}
