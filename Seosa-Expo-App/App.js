import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

import AuthScreen from './src/screens/auth/AuthScreen';
import KakaoLogin from './src/components/auth/KakaoLogin';
import SignupScreen from './src/screens/auth/SignupScreen'; // 기존 파일 사용
import MainScreen from './src/screens/temp/MainScreen';
import RegisterScreen from './src/screens/register/RegisterScreen';
import PasswordResetScreen from './src/screens/auth/PasswordResetScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'NotoSans-Regular': require('./assets/fonts/NotoSans-Regular.ttf'),
        'NotoSans-Bold': require('./assets/fonts/NotoSans-Bold.ttf'),
        'NotoSans-Medium': require('./assets/fonts/NotoSans-Medium.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null; // 폰트 로딩 완료 전에는 아무것도 렌더링하지 않음

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="MainScreen" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
