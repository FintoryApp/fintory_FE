import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { hScale, vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles';

interface SearchContainerProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  placeholder,
  onSearch,
  onClear,
  value,
  onChangeText,
  style,
}) => {
  const [searchText, setSearchText] = useState(value || '');

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    setSearchText('');
    onChangeText?.('');
    onClear?.();
  };

  const handleSearch = () => {
    onSearch?.(searchText);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.searchIconContainer}>
        <Image source={require('../../assets/icons/search.png')} style={styles.searchIcon} />
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.middleGray}
        value={searchText}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: hScale(8),
    paddingHorizontal: hScale(16),
    height: vScale(40),
    width: hScale(328),
  },
  searchIconContainer: {
    width: hScale(24),
    height: vScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: hScale(19.6),
    height: vScale(19.6),
  },
  input: {
    flex: 1,
    fontSize: hScale(12),
    color: Colors.black,
    textAlignVertical: 'center',
  },

});

export default SearchContainer; 