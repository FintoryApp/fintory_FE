import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import styles from "../styles/EconomyNewsDetailScreen.styles";
import {Colors} from "../styles/Color.styles";
import TopBar from "../components/TopBar";
import { hScale, vScale } from "../styles/Scale.styles";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNewsDetail } from "../api/newsDetail";
import NewsImage from "../components/NewsImage";


const aiSummary = `미국의 1분기 경제 성장률이 마이너스 0.3%로 하락하며 트럼프 대통령의 경제 성적표가 부정적으로 나타났습니다.

트럼프 대통령은 이 결과를 전임 바이든 정부의 탓으로 돌리며, 자신의 관세 정책이 미국 내 투자를 촉진하고 있다고 주장했습니다.

그러나 여론 조사에 따르면 그의 경제 지지율은 36%로 최저치를 기록하고 있으며, 백악관은 비판적인 언론을 탓하고 있습니다.`;

export default function EconomyNewsDetailScreen({route}:any) {
    const id = route?.params?.id || {};
    const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
    const {top,bottom} = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState<any>({});


    useEffect(()=>{
        (async()=>{
            try{
                const res = await getNewsDetail(id);
                setNews(res.data);
            }catch(error){
                console.error('Error fetching news list:',error);
            }finally{
                setLoading(false);
            }
        })();
    },[id]);
    
    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 뉴스' />
            <View style={{...styles.newsContainer,marginTop:top,paddingBottom:bottom}}>
                <View style={styles.newsTitleContainer}>
                    <Text style={styles.newsTitleText}>{news.title || '제목 없음'}</Text>
                    <View style={styles.newsInfoContainer}>
                        <Text style={styles.newsInfoText}>조선일보</Text>
                        <View style={styles.verticalLine} /> 
                        <Text style={styles.newsInfoText}>{news.publisher}</Text>
                        <View style={styles.verticalLine} /> 
                        <Text style={styles.newsInfoText}></Text>
                        <Text style={styles.newsInfoText}>{news.publishedAt || ''}</Text>
                    </View>
                </View>

                <ScrollView 
                    style={styles.newsContentContainer} 
                    contentContainerStyle={{
                        paddingHorizontal: hScale(16),
                        paddingVertical: vScale(16),
                        alignSelf: 'center',    
                        paddingBottom: bottom,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <NewsImage
                        uri={news.images} 
                    />
                    <Text style={styles.newsContentText}>
                        {news.contents ? 
                            // contents가 배열인 경우 문단별로 나누어 표시
                            Array.isArray(news.contents) 
                                ? news.contents.join('\n\n') 
                                : news.contents
                            : '내용이 없습니다.'
                        }
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}