// src/screens/auth/SignupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import { setUser, setIsTemporary } from '../../store/authSlice';

const OnboardingScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [userRoleCode, setUserRoleCode] = useState('');
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);

  const handleSignup = async () => {
    try {
      // 헤더에 access token을 포함하여 추가 회원가입 API 호출
      const response = await api.post('/oauth2/signup', { nickname, userRoleCode });
      // 백엔드에서 업데이트된 user 정보를 반환한다고 가정
      dispatch(setUser(response.data.user));
      // 추가 회원가입 완료 후 임시회원 플래그 해제
      dispatch(setIsTemporary(false));
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Signup error:', error);
      // 에러 처리 (예: 사용자에게 에러 메시지 노출)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>추가 회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="사용자 역할 코드 (선택)"
        value={userRoleCode}
        onChangeText={setUserRoleCode}
      />
      <Button title="회원가입 완료" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFFEFB'
  },
  header: {
    fontSize: Dimensions.get('window').height * 0.03,
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  }
});

export default OnboardingScreen;
