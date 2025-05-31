// App.js
import 'react-native-get-random-values';       // UUID 등 랜덤값용
import 'react-native-url-polyfill/auto';      // URL API 폴리필

// Buffer 전역 설정
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { store } from './src/store/store';
import { setUser } from './src/store/authSlice';
import { fetchUserInfo } from './src/api/userApi';
import { navigationRef } from './src/utils/nav/RootNavigation';

/* ─────────── 스크린 import ─────────── */
import SplashScreen         from './src/screens/home/SplashScreen';
import HomeScreen           from './src/screens/home/HomeScreen';
import AuthScreen           from './src/screens/auth/AuthScreen';
import AuthCodeScreen       from './src/screens/auth/AuthCodeScreen';
import PasswordResetScreen  from './src/screens/auth/PasswordResetScreen';
import ResetDoneScreen      from './src/screens/auth/ResetDoneScreen';
import RegisterScreen       from './src/screens/register/RegisterScreen';
import OnboardingScreen     from './src/screens/auth/OnboardingScreen';
import MySpaceScreen        from './src/screens/myspace/MySpaceScreen';
import FaqScreen            from './src/screens/faq/FaqScreen';
import AdminMySpaceScreen   from './src/screens/admin/AdminMySpaceScreen';
import EditProfileScreen    from './src/screens/myspace/EditProfileScreen';
import PrivacyPolicyScreen  from './src/screens/home/PrivacyPolicyScreen';
import TermsofUseScreen     from './src/screens/home/TermsofUseScreen';

/* 조회 전용(Post) */
import PostScreen           from './src/screens/post/PostScreen';
import PostGalleryScreen    from './src/screens/post/PostGalleryScreen';

/* 생성 전용(Article) */
import ArticleScreen        from './src/screens/article/ArticleScreen';
import MapPickerScreen      from './src/screens/map/MapPickerScreen';

const Stack = createNativeStackNavigator();

/* ─────────── RootApp ─────────── */
function RootApp() {
  const [fontsLoaded, setFontsLoaded]   = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(false);
  const [showSplash, setShowSplash]     = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dispatch    = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);

  /* 스플래시 & 폰트 로딩 */
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => mounted && setTimerElapsed(true), 2000);
    Font.loadAsync({
      'NotoSans-Regular': require('./assets/fonts/NotoSans-Regular.ttf'),
      'NotoSans-Bold'   : require('./assets/fonts/NotoSans-Bold.ttf'),
      'NotoSans-Medium' : require('./assets/fonts/NotoSans-Medium.ttf'),
    }).then(() => mounted && setFontsLoaded(true));
    return () => { mounted = false; clearTimeout(timer); };
  }, []);

  /* 스플래시 페이드 아웃 */
  useEffect(() => {
    if (fontsLoaded && timerElapsed) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }
  }, [fontsLoaded, timerElapsed]);

  /* 토큰 존재 시 유저 정보 갱신 */
  useEffect(() => {
    if (accessToken) {
      fetchUserInfo()
        .then(user => dispatch(setUser(user)))
        .catch(console.error);
    }
  }, [accessToken]);

  /* ── UI ── */
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false, animation: 'fade', gestureEnabled: true }}
        >
          {/* ── Public ── */}
          <Stack.Screen name="Home"          component={HomeScreen} />
          <Stack.Screen name="Auth"          component={AuthScreen} />
          <Stack.Screen name="AuthCode"      component={AuthCodeScreen} />
          <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          <Stack.Screen name="ResetDone"     component={ResetDoneScreen} />
          <Stack.Screen name="Register"      component={RegisterScreen} />
          <Stack.Screen name="Onboarding"    component={OnboardingScreen} />

          {/* ── Protected ── */}
          <Stack.Screen name="MySpace"       component={MySpaceScreen} />
          <Stack.Screen name="AdminSpace"    component={AdminMySpaceScreen} />
          <Stack.Screen name="EditProfile"   component={EditProfileScreen} />

          {/* ── 글 조회 흐름 ── */}
          <Stack.Screen name="Post"          component={PostScreen} />
          <Stack.Screen name="gallery"       component={PostGalleryScreen} />

          {/* ── 글 작성(ADMIN) ── */}
          <Stack.Screen
            name="article"                  // 기존 네이밍 유지
            component={ArticleScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="MapPicker"
            component={MapPickerScreen}
            options={{ title: '지도에서 위치 선택' }}
          />

          {/* ── 기타 ── */}
          <Stack.Screen name="FAQ"           component={FaqScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsofUse"    component={TermsofUseScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* 스플래시 */}
      {showSplash && (
        <Animated.View
          pointerEvents="box-none"
          style={{ ...StyleSheet.absoluteFillObject, opacity: fadeAnim, zIndex: 100 }}
        >
          <SplashScreen />
        </Animated.View>
      )}
    </>
  );
}

/* ─────────── Provider ─────────── */
export default function App() {
  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
}
