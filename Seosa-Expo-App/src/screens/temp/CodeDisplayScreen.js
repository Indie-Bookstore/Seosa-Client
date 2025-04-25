// src/screens/temp/CodeDisplayScreen.js
// (삭제할 화면)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ButtonComponent from '../../components/common/ButtonComponent';

const CodeDisplayScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { code } = route.params; // 네비게이션 파라미터에서 code 추출

  const handleLogout = () => {
    // 로그아웃 로직 구현 예: 초기 화면으로 이동
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 카카오 인증 완료!</Text>
      <Text style={styles.subTitle}>발급된 인가 코드:</Text>
      <Text style={styles.codeBlock}>{code}</Text>
      
      <ButtonComponent 
        onPress={handleLogout}
        description="처음 화면으로"
        btnType="btn-green"
        customStyle={{ marginTop: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  codeBlock: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 25,
  },
});

export default CodeDisplayScreen;
