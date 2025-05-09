
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Blue = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>여기는 StockSimulator 화면입니다.</Text>
    </View>
  );
};

export default Blue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
