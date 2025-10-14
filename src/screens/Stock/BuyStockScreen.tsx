import React ,{ useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import HugeButton from '../../components/button/HugeButton';
import BuyStockModal from '../../components/stock/BuyStockModal';
import { trading } from '../../api/stock/trading';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


export default function BuyStockScreen(props: any) {
    const {top} = useSafeAreaInsets();
    const [quantity, setQuantity] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    const stockCode = props.route.params.stockCode;
    const stockName = props.route.params.stockName;
    const closePrice = props.route.params.closePrice;
    const currentPrice = props.route.params.currentPrice || closePrice;
    const stockImageUrl = props.route.params.stockImageUrl || '';
    
    // stockCode가 알파벳으로 시작하면 해외주식, 숫자로 시작하면 국내주식
    const isOverseasStock = /^[A-Za-z]/.test(stockCode);
    const handleBuyStock = async () => {
        if (parseFloat(quantity) <= 0) return;
        
        setIsLoading(true);
        try {
            const buyData = {
                stockCode: stockCode,
                quantity: parseFloat(quantity),
                price: currentPrice,
                transactionType: "BUY"
            };
            
            console.log('구매 요청 데이터:', buyData);
            console.log('API URL:', 'https://fintory.xyz/api/child/trading');
            
            const response = await trading(buyData);
            console.log('구매 성공:', response);
            setIsModalVisible(true);
        } catch (error: any) {
            console.error('구매 실패:', error);
            
            let errorMessage = '주식 구매 중 오류가 발생했습니다. 다시 시도해주세요.';
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                switch (status) {
                    case 401:
                        errorMessage = '로그인이 필요합니다. 다시 로그인해주세요.';
                        break;
                    case 403:
                        errorMessage = '권한이 없습니다. 관리자에게 문의하세요.';
                        break;
                    case 404:
                        errorMessage = 'API 엔드포인트를 찾을 수 없습니다.';
                        break;
                    case 500:
                        errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                        break;
                    case 502:
                        errorMessage = '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.';
                        break;
                    default:
                        errorMessage = data?.message || `오류가 발생했습니다. (${status})`;
                }
            } else if (error.request) {
                errorMessage = '네트워크 연결을 확인해주세요.';
            }
            
            Alert.alert('구매 실패', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const renderPurchase = () => {
        return (
            <View style={styles.quantityContainer}>
            <View style={styles.quantityDisplayContainer}>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                    style={styles.checkButton}
                    onPress={() => setQuantity('')}
                >
                    <Image source={require('../../../assets/icons/cancel.png')} style={styles.checkIcon} />
                </TouchableOpacity>
                <Text style={{...styles.quantityText,fontSize:hScale(24)}}>주</Text>
                
            </View> 
            <Text style={styles.totalPrice}>총 금액 {((currentPrice * parseFloat(quantity)).toLocaleString())}{isOverseasStock ? '$' : ' 원'}</Text>
            </View>
        )
    }
    return (
        <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: Colors.surface}}>
            <View style={[styles.headerContainer,{marginTop:top}]}>
    
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/left.png')} style={styles.headerButtonImage} />
                </TouchableOpacity>
            </View>

            
            <View style={styles.stockInfoContainer}>
                
                
                    {/* <Text style={styles.stockNameText}>{stockName}</Text>
                    <Text style={styles.stockCodeText}>({stockCode})</Text> */}
                    <Image 
                    source={stockImageUrl ? { 
                        uri: stockImageUrl,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    } : require('../../../assets/icons/red_circle.png')} 
                    defaultSource={require('../../../assets/icons/red_circle.png')}
                    style={styles.stockInfoImage} 
                    resizeMode='contain' 
                />
                    <Text style={styles.stockInfoText}>현재 거래가 {'\n'}<Text style={styles.stockInfoTextValue}>1종목 = {currentPrice.toLocaleString()}{isOverseasStock ? '$' : ' 원'}</Text></Text>
                
            </View>
            {parseFloat(quantity) > 0 ? renderPurchase() :            <TextInput 
            style={styles.input} 
            placeholder='몇 주를 구매할까요?'
            placeholderTextColor={Colors.middleGray}
            keyboardType='decimal-pad'
            value={quantity}
            onChangeText={(text) => {
                // Allow only numbers and one decimal point
                const regex = /^\d*\.?\d*$/;
                if (regex.test(text)) {
                    setQuantity(text);
                }
            }}
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
                        <TouchableOpacity style={styles.keypadButton} onPress={() => {
                            if (!quantity.includes('.')) {
                                setQuantity(quantity + '.');
                            }
                        }}>
                            <Text style={styles.keypadText}>.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity + '0')}>
                            <Text style={styles.keypadText}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setQuantity(quantity.slice(0, -1))}>

                                <Image source={require('../../../assets/icons/backspace.png')} style={styles.deleteIcon} />
                        
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginLeft: hScale(16)}}>
                    <HugeButton
                    title={isLoading ? '구매 중...' : '구매하기'}
                    onPress={handleBuyStock}
                    backgroundColor={Colors.primary}
                    textColor={Colors.white}
                    pressable={parseFloat(quantity) > 0 && !isLoading}
                />
                </View>
            </View>

            <BuyStockModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message='구매가 완료되었습니다!'
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
        width: hScale(320),
        height: vScale(80),
        marginLeft: hScale(16),
        //justifyContent: 'center',
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
        //textAlignVertical: 'center',
        marginTop: vScale(8),
    },
    stockInfoTextValue: {
        fontSize: hScale(12),
        fontWeight: 'bold',
        color: Colors.black,
    },
    stockInfoTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    stockNameText: {
        fontSize: hScale(16),
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: vScale(2),
    },
    stockCodeText: {
        fontSize: hScale(12),
        color: Colors.middleGray,
        marginBottom: vScale(4),
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