import React ,{ useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/Color.styles';
import { hScale, vScale } from '../../styles/Scale.styles';
import HugeButton from '../../components/button/HugeButton';
import BuyStockModal from '../../components/stock/BuyStockModal';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { createPriceAlerts } from '../../api/wantPrice/createPriceAlerts';
import { watchPriceAlert } from '../../api/wantPrice/watchPriceAlert';
import { deletePriceAlert } from '../../api/wantPrice/deletePriceAlert';

export default function WantPriceScreen(props: any) {
    const {top} = useSafeAreaInsets();
    const [targetPrice, setTargetPrice] = useState('');
    const stockCode = props.route.params.stockCode;
    const stockName = props.route.params.stockName;
    const closePrice = props.route.params.closePrice;
    const currentPrice = props.route.params.currentPrice || closePrice;
    const stockImageUrl = props.route.params.stockImageUrl || '';
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [SeeMore, setSeeMore] = useState(false);
    const [wantPriceList, setWantPriceList] = useState<any[]>([]);

    const handleCreatePriceAlert = async () => {
        await createPriceAlerts({stockCode, targetPrice: parseInt(targetPrice)});
    }

    const handleWatchPriceAlert = async () => {
        const watchPriceAlertResponse = await watchPriceAlert(stockCode);
        setWantPriceList(watchPriceAlertResponse.data);
    }

    const handleDeletePriceAlert = async (id: number) => {
        const deletePriceAlertResponse = await deletePriceAlert(id);
        if (deletePriceAlertResponse.resultCode === 'SUCCESS') {
            setWantPriceList(wantPriceList.filter((item) => item.id !== id));
        }
    }
    return (
        <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: Colors.surface}}>
            <View style={[styles.headerContainer,{marginTop:top}]}>
    
                <TouchableOpacity style={styles.headerButton}>
                    <Image source={require('../../../assets/icons/left.png')} style={styles.headerButtonImage} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.headerRightContainer} onPress={() => {
                    setSeeMore(!SeeMore);
                    if (!SeeMore) {
                        handleWatchPriceAlert();
                    }
                }}>
                <Text style={styles.headerText}>내가 지정한 감시가</Text>
                <Image source={ SeeMore ? require('../../../assets/icons/arrow_drop_up.png') : require('../../../assets/icons/arrow_drop_down.png')} style={styles.headerButtonImage} />

                </TouchableOpacity>
            </View>

            {/* 드롭다운 메뉴 */}
            {SeeMore && wantPriceList.length > 0 && (
                <View style={styles.dropdownContainer}>
                    {wantPriceList.map((item, index) => (
                        <View style={[styles.dropdownItemContainer, {borderBottomWidth: index === wantPriceList.length - 1 ? 0 : 1, borderBottomColor: Colors.outlineVariant}]} key={index}>
                        <Text style={styles.dropdownItem} key={index}>{item.targetPrice.toLocaleString()}원</Text>
                        {/* <Text style={styles.dropdownItem}>{item.id}</Text> */}
                        <TouchableOpacity style={styles.dropdownItemButton} onPress={() => handleDeletePriceAlert(item.id)}>
                            <Image source={require('../../../assets/icons/delete.png')} style={styles.dropdownItemButtonImage} />
                        </TouchableOpacity>
                        </View>
                    ))}
                    
                </View>
            )}

            
            <View style={styles.stockInfoContainer}>
                <Image source={stockImageUrl ? { uri: stockImageUrl } : require('../../../assets/icons/red_circle.png')} style={styles.stockInfoImage} resizeMode='contain' />
                <Text style={styles.stockInfoText}>현재 거래가 {'\n'}<Text style={styles.stockInfoTextValue}>1종목 = {currentPrice.toLocaleString()} 원</Text></Text>
            </View>
            <Text style={styles.notiText}>내가 설정한 가격이 되면 알림으로 알려드려요!</Text>
            <TextInput 
            style={styles.input} 
            placeholder='감시가 설정하기'
            placeholderTextColor={Colors.middleGray}
            keyboardType='numeric'
            value={targetPrice}
            onChangeText={setTargetPrice}
            />
            

            <View style={styles.quantityDisplay}>
                {/* 커스텀 키패드 */}
                <View style={styles.keypadContainer}>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '1')}>
                            <Text style={styles.keypadText}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '2')}>
                            <Text style={styles.keypadText}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '3')}>
                            <Text style={styles.keypadText}>3</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '4')}>
                            <Text style={styles.keypadText}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '5')}>
                            <Text style={styles.keypadText}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '6')}>
                            <Text style={styles.keypadText}>6</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '7')}>
                            <Text style={styles.keypadText}>7</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '8')}>
                            <Text style={styles.keypadText}>8</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '9')}>
                            <Text style={styles.keypadText}>9</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keypadRow}>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '00')}>
                            <Text style={styles.keypadText}>00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice + '0')}>
                            <Text style={styles.keypadText}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.keypadButton} onPress={() => setTargetPrice(targetPrice.slice(0, -1))}>

                                <Image source={require('../../../assets/icons/backspace.png')} style={styles.deleteIcon} />
                        
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginLeft: hScale(16)}}>
                    <HugeButton
                    title='감시가 지정하기'
                    onPress={() => {handleCreatePriceAlert(); setIsModalVisible(true);setTargetPrice('');}}
                    backgroundColor={Colors.primary}
                    textColor={Colors.white}
                    pressable={targetPrice.length > 0 ? true : false}
                />
                </View>
            </View>

            <BuyStockModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message='감시가 지정이 왼료되었습니다!'
            />

        </View>
    );
}

const styles = StyleSheet.create({ 
    headerContainer: {
        width: '100%',
        height: vScale(60),
        backgroundColor: Colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerButton: {
        width: hScale(44),
        height: vScale(44),
        justifyContent: 'center',
        paddingHorizontal: hScale(8),
        paddingVertical: vScale(6),
    },
    headerButtonImage: {
        tintColor: Colors.outline,
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
    notiText: {
        fontSize: hScale(16),
        color: Colors.black,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        marginLeft: hScale(16),
        marginRight: hScale(16),
        top:vScale(140),
        position: 'absolute',
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
    headerText: {
        fontSize: hScale(12),
        color: Colors.outline,
        textAlignVertical: 'center',
        marginRight: hScale(8),
    },
    headerRightContainer: {
        width: hScale(113),
        height: vScale(16),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: hScale(16),
        flexDirection: 'row',
    },
    dropdownContainer: {
        position: 'absolute',
        top: vScale(62), 
        right: hScale(16),
        width: hScale(156),
        backgroundColor: Colors.white,
        borderRadius: hScale(8),
        padding: hScale(12),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    dropdownItemContainer: {
        width: hScale(124),
        height: vScale(20),
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemButton: {
        width: hScale(16),
        height: vScale(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownItemButtonImage: {
        width: hScale(10),
        height: vScale(12),
        tintColor: Colors.outlineVariant,
    },
    dropdownItem: {
        fontSize: hScale(12),
        fontWeight: 'bold',
        color: Colors.outline,
        
    },
});