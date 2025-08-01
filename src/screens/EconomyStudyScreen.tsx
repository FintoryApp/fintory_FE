import { View, Text, Image, TouchableOpacity } from 'react-native';
import TopBar from '../components/TopBar';
import { styles } from '../styles/EconomyStudyScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewsSummary from '../components/NewsSummary';
import { Colors } from '../styles/Color.styles';
import { useNavigation } from '@react-navigation/native';
import { getNewsList } from '../api/newsList';
import { useState, useEffect } from 'react';

export default function EconomyStudyScreen() {
    const navigation = useNavigation();
    const {top} = useSafeAreaInsets();
    const [newsList, setNewsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        (async()=>{
            try{
                setLoading(true);
                const res = await getNewsList();
                // The API returns { resultCode: "SUCCESS", data: [...] }
                // So we need to access res.data to get the array
                setNewsList(res.data);
            }catch(error){
                console.error('Error fetching news list:',error);
            }finally{
                setLoading(false);
            }
        })();
    },[]);

    const calculateHoursAgo = (publishedAt: string) => {
        try {
            console.log('Original publishedAt:', publishedAt);
            
            // publishedAt이 없거나 빈 문자열인 경우
            if (!publishedAt || publishedAt.trim() === '') {
                return '1시간 전';
            }
            
            // "입력 2025.07.22. 15:18" 형식 파싱
            const timeMatch = publishedAt.match(/(\d{4})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2})/);
            if (!timeMatch) {
                console.error('Invalid date format:', publishedAt);
                return '1시간 전';
            }
            
            const [_, year, month, day, hour, minute] = timeMatch;
            const publishedDate = new Date(
                parseInt(year), 
                parseInt(month) - 1, // 월은 0부터 시작
                parseInt(day), 
                parseInt(hour), 
                parseInt(minute)
            );
            
            console.log('Parsed publishedDate:', publishedDate);
            console.log('Is valid date:', !isNaN(publishedDate.getTime()));
            
            // 유효하지 않은 날짜인 경우
            if (isNaN(publishedDate.getTime())) {
                console.error('Invalid date:', publishedAt);
                return '1시간 전';
            }
            
            // 현재 시간
            const now = new Date();
            console.log('Current time:', now);
            
            // 시간 차이 계산 (밀리초)
            const diffTime = now.getTime() - publishedDate.getTime();
            console.log('Diff time (ms):', diffTime);
            
            // 시간으로 변환 (소수점 포함)
            const diffHours = diffTime / (1000 * 60 * 60);
            console.log('Diff hours:', diffHours);
            
            // NaN 체크
            if (isNaN(diffHours)) {
                console.error('NaN diffHours calculated');
                return '1시간 전';
            }
            
            // 1시간 미만이면 "방금 전" 또는 "분 전"으로 표시
            if (diffHours < 1) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                if (diffMinutes < 1) {
                    return '방금 전';
                }
                return `${diffMinutes}분 전`;
            }
            
            // 24시간 미만이면 "시간 전"으로 표시
            if (diffHours < 24) {
                const hours = Math.round(diffHours);
                return `${hours}시간 전`;
            }
            
            // 24시간 이상이면 "일 전"으로 표시
            const diffDays = Math.round(diffHours / 24);
            return `${diffDays}일 전`;
        } catch (error) {
            console.error('Error calculating hours ago:', error);
            return '1시간 전';
        }
    };

    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 뉴스 & 경제 용어' />
            <View style={{...styles.newsContainer,marginTop:top}}>
                <View style={styles.newsTitleContainer}>
                    <Image source={require('../../assets/icons/speaker.png')} style={styles.newsTitleIcon} />
                    <Text style={styles.newsTitleText}>오늘의 경제 뉴스</Text>
                    <Text style={styles.dateTitleText}>2025.07.16</Text>
                </View>
                
                {loading ? (
                    <Text style={{textAlign: 'center', padding: 20, color: Colors.outline}}>
                        뉴스를 불러오는 중...
                    </Text>
                ) : (
                    <>
                        {newsList.length > 0 && (
                            <TouchableOpacity onPress={()=>{
                                console.log('Navigating with newsList[0]:', newsList[0]);
                                (navigation as any).navigate('EconomyNewsDetailScreen', {id:1});
                            }}>
                                <NewsSummary 
                                    title={newsList[0].title} 
                                    image={newsList[0].thumbnailUrl} 
                                    hour={calculateHoursAgo(newsList[0].publishedAt)} 
                                />
                            </TouchableOpacity >
                        )}
                        
                        {newsList.length > 1 && (
                            <TouchableOpacity onPress={()=>{
                                (navigation as any).navigate('EconomyNewsDetailScreen', {id:2});
                            }}>
                                <NewsSummary 
                                    title={newsList[1].title} 
                                    image={newsList[1].thumbnailUrl} 
                                    hour={calculateHoursAgo(newsList[1].publishedAt)} 
                                />
                            </TouchableOpacity>
                        )}
                        
                        {newsList.length > 2 && (
                            <TouchableOpacity onPress={()=>{
                                (navigation as any).navigate('EconomyNewsDetailScreen', {id:3});
                            }}>
                                <NewsSummary 
                                    title={newsList[2].title} 
                                    image={newsList[2].thumbnailUrl} 
                                    hour={calculateHoursAgo(newsList[2].publishedAt)} 
                                />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>

            <View style={styles.wordContainer}>
                <View style={styles.wordTitleContainer}>
                    <Image source={require('../../assets/icons/pencil.png')} style={styles.wordTitleIcon} />
                    <Text style={styles.wordTitleText}>오늘의 경제 용어</Text>
                    <TouchableOpacity style={styles.seeAllButtonContainer} onPress={()=>{
                        navigation.navigate('EconomyWordScreen' as never);
                    }}>
                        <Text style={styles.seeAllButtonText}>전체보기</Text>
                        <Image source={require('../../assets/icons/chevron_forward.png')} style={styles.narrowImage} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.wordItemContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.wordText}>금리</Text>
                        <Text style={styles.explainText}>빌리거나 빌려 준 돈에 대한 이자, 이율</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
