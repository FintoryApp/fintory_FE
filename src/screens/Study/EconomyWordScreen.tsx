import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Colors } from '../../styles/Color.styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TopBar from '../../components/ui/TopBar'
import SearchContainer from '../../components/ui/SearchContainer'
import {hScale} from '../../styles/Scale.styles'
import { vScale } from '../../styles/Scale.styles'
import WordContainer from '../../components/WordContainer'
import { getWordList } from '../../api/word'
import { useState, useEffect } from 'react'

export default function EconomyWordScreen() {
    const {top} = useSafeAreaInsets();
    const [wordList, setWordList] = useState<{id: number, word: string}[]>([]);
    const [wordInfoMap, setWordInfoMap] = useState<{[key: number]: any}>({});
    const [filteredWordList, setFilteredWordList] = useState<{id: number, word: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getWordList();
                setWordList(response.data);
                setFilteredWordList(response.data);
            } catch (error) {
                console.error('Error fetching word list:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // wordInfo가 로드될 때마다 검색 결과 업데이트
    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredWordList(wordList);
        } else {
            const filtered = wordList.filter(word => {
                const wordInfo = wordInfoMap[word.id];
                if (!wordInfo) return false;
                
                // 한국어 단어와 영어 단어 모두 검색 가능하도록
                const searchLower = searchText.toLowerCase();
                const wordLower = (wordInfo.word || '').toLowerCase();
                const meaningLower = (wordInfo.meaning || '').toLowerCase();
                
                return wordLower.includes(searchLower) || meaningLower.includes(searchLower);
            });
            setFilteredWordList(filtered);
        }
    }, [searchText, wordList, wordInfoMap]);

    const handleSearch = (text: string) => {
        setSearchText(text);
    };

    const handleClear = () => {
        setSearchText('');
    };

    const handleWordInfoLoaded = (id: number, wordInfo: any) => {
        setWordInfoMap(prev => ({
            ...prev,
            [id]: wordInfo
        }));
    };

    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 용어' />
            <SearchContainer 
                placeholder='경제 용어 검색하기' 
                style={{marginTop:top,alignSelf:'center'}}
                onSearch={handleSearch}
                onClear={handleClear}
                value={searchText}
                onChangeText={handleSearch}
            />
            <ScrollView style={{flex:1,backgroundColor:Colors.surface,paddingHorizontal:hScale(16),paddingTop:vScale(16)}}>
                {loading ? (
                    <Text style={{textAlign: 'center', padding: 20, color: Colors.outline}}>
                        용어 목록을 불러오는 중...
                    </Text>
                ) : filteredWordList.length > 0 ? (
                    filteredWordList.map((word, index) => (
                        <WordContainer 
                            key={word.id || index} 
                            id={word.id} 
                            onWordInfoLoaded={handleWordInfoLoaded}
                        />
                    ))
                ) : (
                    <Text style={{textAlign: 'center', padding: 20, color: Colors.outline}}>
                        검색 결과가 없습니다.
                    </Text>
                )}
            </ScrollView>
        </View>
        
    )
}