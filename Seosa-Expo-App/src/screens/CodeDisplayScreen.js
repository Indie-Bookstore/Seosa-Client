// 인가코드 확인을 위한 테스트 화면
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ButtonComponent from '../components/common/ButtonComponent';

const CodeDisplayScreen = ({ code, onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>인가 코드:</Text>
      <Text style={styles.code}>{code}</Text>
      <ButtonComponent 
        onPress={onLogout}
        description="로그아웃"
        btnType="btn-green"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  code: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default CodeDisplayScreen;
