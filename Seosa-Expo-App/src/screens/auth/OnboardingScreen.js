// src/screens/auth/OnboardingScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import {
  setUser,
  setAccessToken as setReduxAccessToken,
  setIsTemporary,
} from '../../store/authSlice';
import { setRefreshToken as storeRefreshToken } from '../../utils/tokenStorage';
import { navigate } from '../../utils/nav/RootNavigation';

const { height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [userRoleCode, setUserRoleCode] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);

  const handleSignup = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // PATCH /oauth2/signup 호출로 변경
      const response = await api.patch(
        '/oauth2/signup',
        { nickname, userRoleCode }
      );

      // 응답으로 새로운 토큰을 받아온다고 가정
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = response.data;

      // 새로운 RefreshToken을 SecureStore에 저장
      await storeRefreshToken(newRefreshToken);
      // Redux에 새로운 AccessToken 저장
      dispatch(setReduxAccessToken(newAccessToken));

      // 토큰이 갱신되었으므로 다시 /user로 유저 정보 조회
      const userRes = await api.get('/user');
      const updatedUser = userRes.data;

      // Redux에 유저 정보 저장
      dispatch(setUser(updatedUser));
      // 임시회원 플래그 해제
      dispatch(setIsTemporary(false));

      // Onboarding 완료 후 이동할 화면 (예: MySpace)
      navigate('MySpace');
    } catch (error) {
      console.error('OAuth2 Signup error:', error);
      Alert.alert('오류', '추가 회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
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

      {loading ? (
        <ActivityIndicator size="large" color="#487153" style={{ marginTop: 20 }} />
      ) : (
        <Button title="회원가입 완료" onPress={handleSignup} />
      )}
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
    fontSize: height * 0.03,
    marginBottom: height * 0.02,
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
