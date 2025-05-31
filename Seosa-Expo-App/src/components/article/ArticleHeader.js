/* 
 * src/components/article/ArticleHeader.js
*/

import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const ArticleHeader = ({ onCancel, onSubmit }) => (
  <View style={styles.headerContainer}>
    <View style={styles.btnContainer}>
      <TouchableOpacity onPress={onCancel} style={styles.btn}>
        <Text style={styles.cancel}>취소</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSubmit} style={styles.btn}>
        <Text style={styles.submit}>등록</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#F4F4F4',
    height: height * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: {
    color: '#888888',
    fontSize: height * 0.02,
    fontWeight: '600',
  },
  submit: {
    color: '#487153',
    fontSize: height * 0.02,
    fontWeight: '600',
  },
});

export default ArticleHeader;
