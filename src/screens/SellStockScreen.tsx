import React ,{ useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles/Color.styles';
import { hScale, vScale } from '../styles/Scale.styles';
import HugeButton from '../components/HugeButton';
import BuyStockModal from '../components/BuyStockModal';
import { SellBuy } from '../api/sellBuy';

export default function SellStockScreen() {
    const {top} = useSafeAreaInsets();
    const [quantity, setQuantity] = useState('');
    const price = 367890;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSellStock = async () => {
        if (parseInt(quantity) <= 0) return;
        
        setIsLoading(true);
        try {
            const sellData = {
                stockCode: "005930", // 삼성전자 코드 (실제로는 props나 상태에서 가져와야 함)
                quantity: parseInt(quantity),
                price: price,
                transactionType: "SELL"
            };
            
            const response = await SellBuy(sellData);
            console.log('판매 성공:', response);
            setIsModalVisible(true);
        } catch (error) {
            console.error('판매 실패:', error);
            Alert.alert('판매 실패', '주식 판매 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }
    const renderPurchase = () => {
        return (
            <View style={styles.quantityContainer}>
            <View style={styles.quantityDisplayContainer}>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                    style={styles.checkButton}
                    onPress={() => setQuantity('')}
                >
                    <Image source={require('../../assets/icons/cancel.png')} style={styles.checkIcon} />
                </TouchableOpacity>
                <Text style={{...styles.quantityText,fontSize:hScale(24)}}>주</Text>
                
            </View> 
            <Text style={styles.totalPrice}>총 금액 {((price * parseInt(quantity)).toLocaleString())} 원</Text>
            </View>
        )
    }
    return (
        <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: Colors.surface}}>
            <View style={[styles.headerContainer,{marginTop:top}]}>
    
                <TouchableOpacity style={styles.headerButton}>
                    <Image source={require('../../assets/icons/left.png')} style={styles.headerButtonImage} />
                </TouchableOpacity>
            </View>

            
            <View style={styles.stockInfoContainer}>
                <Image source={require('../../assets/icons/red_circle.png')} style={styles.stockInfoImage} resizeMode='contain' />
                <Text style={styles.stockInfoText}>현재 거래가 {'\n'}<Text style={styles.stockInfoTextValue}>1종목 = {price.toLocaleString()} 원</Text></Text>
            </View>
            {parseInt(quantity) > 0 ? renderPurchase() :<TextInput 
            style={styles.input} 
            placeholder='몇 주를 판매할까요?'
            placeholderTextColor={Colors.middleGray}
            keyboardType='numeric'
            value={quantity}
            onChangeText={setQuantity}
            />}
            

            <View style={styles.quantityDisplay}>
                {/* 커스텀 키패드 */}
                <View style={styles.keypadContainer}>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '1')}>
                            <Text style={styles.keypadText}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '2')}>
                            <Text style={styles.keypadText}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '3')}>
                            <Text style={styles.keypadText}>3</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '4')}>
                            <Text style={styles.keypadText}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '5')}>
                            <Text style={styles.keypadText}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '6')}>
                            <Text style={styles.keypadText}>6</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '7')}>
                            <Text style={styles.keypadText}>7</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '8')}>
                            <Text style={styles.keypadText}>8</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '9')}>
                            <Text style={styles.keypadText}>9</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '00')}>
                            <Text style={styles.keypadText}>00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '0')}>
                            <Text style={styles.keypadText}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity.slice(0, -1))}>

                                <Image source={require('../../assets/icons/backspace.png')} style={styles.deleteIcon} />
                        
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginLeft: hScale(16)}}>
                    <HugeButton
                    title='판매하기'
                    onPress={() => {if(parseInt(quantity) > 0)  setIsModalVisible(true)}}
                    backgroundColor={Colors.primary}
                    textColor={Colors.white}
                    pressable={parseInt(quantity) > 0 ? true : false}
                />
                </View>
            </View>

            <BuyStockModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message='판매가 완료되었습니다!'
            />

        </View>
    );
}

const styles = StyleSheet.create({ 
    headerContainer: {
        width: '100%',
        height: vScale(60),
        backgroundColor: Colors.surface,
        
        justifyContent: 'center',
    },
    headerButton: {
        width: hScale(44),
        height: vScale(44),
        justifyContent: 'center',
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(6),
    },
    headerButtonImage: {
        tintColor: Colors.black,
    },
    stockInfoContainer: {
        width: hScale(160),
        height: vScale(48),
        marginLeft: hScale(16),
        justifyContent: 'center',
        flexDirection: 'row',
    },
    stockInfoImage: {
        width: hScale(48),
        height: vScale(48),
        borderRadius: hScale(24),
        marginRight: hScale(8),
    },
    stockInfoText: {
        fontSize: hScale(12),
        color: Colors.black,
        textAlignVertical: 'center',
    },
    stockInfoTextValue: {
        fontSize: hScale(12),
        fontWeight: 'bold',
        color: Colors.black,
    },
    input: {
        width: hScale(343), // 화면 너비에서 좌우 마진을 뺀 값
        height: vScale(55),
        fontSize:hScale(36),
        fontWeight: 'bold',
        color: Colors.black,
        marginLeft: hScale(16),
        marginRight: hScale(16),
        top:vScale(214),
        position: 'absolute',
        textAlignVertical: 'center',
    },
    quantityDisplay: {
        width: hScale(360),
        height: vScale(402),
        backgroundColor: Colors.white,
        top:vScale(338),
        position: 'absolute',
    },
    keypadContainer: {
        marginTop: vScale(24),
        width: hScale(328),
        height: vScale(285),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: vScale(29),
    },
    keypadButton: {
        width: hScale(77), // (328 - 48*2) / 3 = 77.33, 여유를 두고 88
        height: vScale(49.5),
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    keypadText: {
        fontSize: hScale(24),
        color: Colors.black, // 어두운 회색 텍스트
    },
    deleteIcon: {
        width: hScale(33),
        height: vScale(24),
        alignSelf: 'center',
    },
    buyButton: {
        width: '90%',
        height: vScale(60),
        backgroundColor: Colors.primary,
        borderRadius: hScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vScale(30),
        alignSelf: 'center',
    },
    buyButtonText: {
        fontSize: hScale(18),
        fontWeight: 'bold',
        color: Colors.white,
    },
    quantityDisplayContainer: {
        width: hScale(200),
        height: vScale(55),
        
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityContainer: {
        width: hScale(200),
        height: vScale(70),
        marginLeft: hScale(16),
        marginRight: hScale(16),
        top: vScale(210),
        position: 'absolute',
    },
    totalPrice: {
        fontSize: hScale(16),
        color: Colors.middleGray,
    },
    quantityText: {
        fontSize: hScale(36),
        fontWeight: 'bold',
        color: Colors.black,
        flex: 1,
        textAlignVertical: 'center',
    },
    checkButton: {
        width: hScale(24),
        height: vScale(24),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: hScale(8),
    },
    checkIcon: {
        width: hScale(20),
        height: vScale(20),
    },

});