import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

import AuthScreen from './src/screens/auth/AuthScreen';
import KakaoLogin from './src/components/auth/KakaoLogin';
import MainScreen from './src/screens/temp/MainScreen';
import RegisterScreen from './src/screens/register/RegisterScreen';
import AuthCodeScreen from './src/screens/auth/AuthCodeScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import PasswordResetScreen from './src/screens/auth/PasswordResetScreen';
import ResetDoneScreen from './src/screens/auth/ResetDoneScreen';
import MySpaceScreen from './src/screens/myspace/MySpaceScreen';
import FaqScreen from './src/screens/faq/FaqScreen';
import AdminMySpaceScreen from './src/screens/admin/AdminMySpaceScreen';
import EditProfileScreen from './src/screens/myspace/EditProfileScreen';
import PostScreen from './src/screens/post/PostScreen';

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
          <Stack.Screen name="AuthCode" component={AuthCodeScreen} />
          <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          <Stack.Screen name="ResetDone" component={ResetDoneScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="MySpace" component={MySpaceScreen} />
          <Stack.Screen name="FAQ" component={FaqScreen} />
          <Stack.Screen name="AdminSpace" component={AdminMySpaceScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Post" component={PostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}