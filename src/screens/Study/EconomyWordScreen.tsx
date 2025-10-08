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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getWordList();
                setWordList(response.data);
            } catch (error) {
                console.error('Error fetching word list:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 용어' />
            <SearchContainer placeholder='경제 용어 검색하기' style={{marginTop:top,alignSelf:'center'}}
              />
            <ScrollView style={{flex:1,backgroundColor:Colors.surface,paddingHorizontal:hScale(16),paddingTop:vScale(16)}}>
                {loading ? (
                    <Text style={{textAlign: 'center', padding: 20, color: Colors.outline}}>
                        용어 목록을 불러오는 중...
                    </Text>
                ) : (
                    wordList.map((word, index) => (
                        <WordContainer key={word.id || index} id={word.id} />
                    ))
                )}
            </ScrollView>
        </View>
        
    )
}