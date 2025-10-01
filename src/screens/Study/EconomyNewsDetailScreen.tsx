import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import styles from "../../styles/EconomyNewsDetailScreen.styles";
import {Colors} from "../../styles/Color.styles";
import TopBar from "../../components/ui/TopBar";
import { hScale, vScale } from "../../styles/Scale.styles";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNewsDetail } from "../../api/newsDetail";
import NewsImage from "../../components/NewsImage";


export default function EconomyNewsDetailScreen({route}:any) {
    const id = route?.params?.id || {};
    const {top,bottom} = useSafeAreaInsets();
    const [news, setNews] = useState<any>({});


    useEffect(()=>{
        (async()=>{
            try{
                const res = await getNewsDetail(id);
                setNews(res.data);
            }catch(error){
                console.error('Error fetching news list:',error);
            }finally{
                
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
                    {news.images && news.images.trim() !== '' && (
                        <NewsImage
                            uri={news.images} 
                        />
                    )}
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