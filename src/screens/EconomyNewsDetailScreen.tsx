import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import styles from "../styles/EconomyNewsDetailScreen.styles";
import {Colors} from "../styles/Color.styles";
import TopBar from "../components/TopBar";
import { hScale, vScale } from "../styles/Scale.styles";
import { useState } from "react";

const newsContent = `올해 1분기, 미국의 경제 성장률은 마이너스 0.3%를 기록했습니다. 지난해 3분기 3.1% 4분기 2.4% 성장했던 미국 경제가 트럼프 취임 이후 침체로 돌아선 겁니다. 관세 전쟁을 앞두고 기업들이 재고 확보를 위해 수입을 대폭 늘리고, 정부 지출이 줄어든 게 주요 원인으로 꼽힙니다. 미국의 분기별 마이너스 성장은 33개월 만입니다. 그러나 트럼프 대통령은 관세와는 전혀 무관한 일이라며 전임 바이든 정부 탓으로 돌렸습니다.

[도널드 트럼프/미국 대통령 : "수입, 재고, 정부 지출로 인한 왜곡을 제거한 핵심 GDP는 3% 증가했습니다. 하지만 이건 바이든의 경제입니다. 우리는 1월 20일에 정권을 인수했기 때문입니다."]

트럼프는 자신의 관세 정책이 성공해 미국 내 투자가 이뤄지고 있다며, 삼성을 직접 언급하기도 했습니다.

[도널드 트럼프/미국 대통령 : "그들(삼성)이 아주 큰 공장을 짓겠다고 발표했다고 아침에 들었습니다. 관세를 피하고 싶기 때문입니다."]

또, 미국 투자를 발표한 기업 CEO들을 초청해 현대차 등 참석 기업을 부르며, '고맙다', '멋지다'고 인사했습니다. 하지만, 로이터가 하루 전 발표한 트럼프 경제 지지율은 36%, 집권 1, 2기를 통틀어 최저치로 여론은 악화되고 있습니다. 백악관은 트럼프 정책을 옹호하는 기사들만 모아둔 홍보 사이트를 개설했습니다. 여론 악화를 트럼프에 비판적인 언론 탓으로 돌리고 있는 겁니다.

촬영기자:박준석
영상편집:김대범
그래픽:이근희
자료조사:권애림`;

const aiSummary = `미국의 1분기 경제 성장률이 마이너스 0.3%로 하락하며 트럼프 대통령의 경제 성적표가 부정적으로 나타났습니다.

트럼프 대통령은 이 결과를 전임 바이든 정부의 탓으로 돌리며, 자신의 관세 정책이 미국 내 투자를 촉진하고 있다고 주장했습니다.

그러나 여론 조사에 따르면 그의 경제 지지율은 36%로 최저치를 기록하고 있으며, 백악관은 비판적인 언론을 탓하고 있습니다.`;

export default function EconomyNewsDetailScreen() {
    const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
    
    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 뉴스' />
            <View style={{...styles.newsContainer,marginTop:vScale(60)}}>
                <View style={styles.newsTitleContainer}>
                    <Text style={styles.newsTitleText}>부메랑 된 트럼프 관세 전생...미국 성장률 -0.3%</Text>
                    <View style={styles.newsInfoContainer}>
                        <Text style={styles.newsInfoText}>이데일리</Text>
                        <View style={styles.verticalLine} />
                        <Text style={styles.newsInfoText}>2025.07.18</Text>
                    </View>
                </View>

                <ScrollView 
                    style={styles.newsContentContainer} 
                    contentContainerStyle={{
                        paddingHorizontal: hScale(16),
                        paddingVertical: vScale(16),
                        alignSelf: 'center',
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity 
                        style={styles.aiSummaryContainer} 
                        onPress={() => {
                            setIsAiSummaryOpen(!isAiSummaryOpen);
                        }}
                    >
                        <Text style={styles.aiSummaryText}>
                            {isAiSummaryOpen ? 'AI 요약 닫기' : 'AI 요약 보기'}
                        </Text>
                        <Image 
                            source={isAiSummaryOpen ? 
                                require('../../assets/icons/up.png') 
                                : require('../../assets/icons/down.png')} 
                            style={styles.aiSummaryIcon} 
                        />
                    </TouchableOpacity>

                    {isAiSummaryOpen &&(
                        <View style={styles.aiSummaryContentContainer}>
                            <Text style={[styles.newsContentText,styles.aiSummaryWithBar]}>
                                {aiSummary}
                            </Text>
                        </View>
                    )}   
                    <Text style={styles.newsContentText}>
                        {newsContent}
                        </Text>
                </ScrollView>
            </View>
        </View>
    );
}