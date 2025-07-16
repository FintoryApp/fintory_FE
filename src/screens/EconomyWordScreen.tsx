import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Colors } from '../styles/Color.styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TopBar from '../components/TopBar'
import SearchContainer from '../components/SearchContainer'
import {hScale} from '../styles/Scale.styles'
import { vScale } from '../styles/Scale.styles'
import WordContainer from '../components/WordContainer'
const wordList = [
    {word: '경제'},
    {word: '펀드'},
    {word: '금리'},
    {word: '복리'},
    {word: '대출'},
    {word: '채권'},
    {word: '채무'},
    {word: '예금'},
    {word: '주식'},
    {word: '경제'},
    {word: '펀드'},
    {word: '금리'},
    {word: '복리'},
    {word: '대출'},
    {word: '채권'},
    {word: '채무'},
    {word: '예금'},
    {word: '주식'},
    {word: '경제'},
    {word: '펀드'},
    {word: '금리'},
    {word: '복리'},
    {word: '대출'},
    {word: '채권'},
    {word: '채무'},
    {word: '예금'},
    {word: '주식'},
    {word: '경제'},
    {word: '펀드'},
    {word: '금리'},
    {word: '복리'},
    {word: '대출'},
    {word: '채권'},
    {word: '채무'},
    {word: '예금'},
    {word: '주식'},
]
export default function EconomyWordScreen() {
    const {top} = useSafeAreaInsets();
    return (
        <View style={{width:'100%',height:'100%',backgroundColor:Colors.surface}}>
            <TopBar title='경제 용어' />
            <SearchContainer placeholder='경제 용어 검색하기' style={{marginTop:top,alignSelf:'center'}}
              />
            <ScrollView style={{flex:1,backgroundColor:Colors.surface,paddingHorizontal:hScale(16),paddingTop:vScale(16)}}>
                {wordList.map((word, index) => (
                    <WordContainer key={index} word={word.word} />
                ))}
            </ScrollView>
        </View>
        
    )
}
