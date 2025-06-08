import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

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
import {
  setUser,
  setAccessToken,
  setRefreshToken,
  clearAuth,
} from './src/store/authSlice';
import { fetchUserInfo } from './src/api/userApi';
import {
  getRefreshToken as loadRefreshToken,
  getAccessToken as loadAccessToken,
} from './src/utils/tokenStorage';
import { navigationRef, navigate } from './src/utils/nav/RootNavigation'; // ★ navigate 추가

/* ───────── 스크린 import ───────── */
import SplashScreen        from './src/screens/home/SplashScreen';
import HomeScreen          from './src/screens/home/HomeScreen';
import AuthScreen          from './src/screens/auth/AuthScreen';
import AuthCodeScreen      from './src/screens/auth/AuthCodeScreen';
import PasswordResetScreen from './src/screens/auth/PasswordResetScreen';
import ResetDoneScreen     from './src/screens/auth/ResetDoneScreen';
import RegisterScreen      from './src/screens/register/RegisterScreen';
import OnboardingScreen    from './src/screens/auth/OnboardingScreen';

import MySpaceScreen       from './src/screens/myspace/MySpaceScreen';
import AdminMySpaceScreen  from './src/screens/admin/AdminMySpaceScreen';
import EditProfileScreen   from './src/screens/myspace/EditProfileScreen';
import PrivacyPolicyScreen from './src/screens/home/PrivacyPolicyScreen';
import TermsofUseScreen    from './src/screens/home/TermsofUseScreen';

import PostScreen          from './src/screens/post/PostScreen';
import PostGalleryScreen   from './src/screens/post/PostGalleryScreen';

import ArticleScreen       from './src/screens/article/ArticleScreen';
import MapPickerScreen     from './src/screens/map/MapPickerScreen';
import FaqScreen from './src/screens/faq/FaqScreen';

const Stack = createNativeStackNavigator();

/* ───────── MySpace or Admin 선택 ───────── */
function MySpaceOrAdmin(props) {
  const user = useSelector((state) => state.auth.user);
  if (!user) return null;

  if (user.userRole === 'ADMIN' || user.userRole === 'EDITOR') {
    return <AdminMySpaceScreen {...props} />;
  }
  return <MySpaceScreen {...props} />;
}

/* ───────── RootApp ───────── */
function RootApp() {
  /* 스플래시 & 폰트 상태 */
  const [fontsLoaded, setFontsLoaded]   = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(false);
  const [showSplash, setShowSplash]     = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dispatch     = useDispatch();
  const accessToken  = useSelector((state) => state.auth.accessToken);
  const user         = useSelector((state) => state.auth.user);   // ★

  /* (0) SecureStore → Redux 토큰 복원 */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedAccess  = await loadAccessToken();
        const storedRefresh = await loadRefreshToken();
        if (!mounted) return;
        if (storedAccess)  dispatch(setAccessToken(storedAccess));
        if (storedRefresh) dispatch(setRefreshToken(storedRefresh));
      } catch (e) {
        console.error('🔴 토큰 로드 에러:', e);
      }
    })();
    return () => { mounted = false };
  }, [dispatch]);

  /* (1) 폰트 로드 & 스플래시 타이머 */
  useEffect(() => {
    let mounted = true;
    const t = setTimeout(() => mounted && setTimerElapsed(true), 2000);

    Font.loadAsync({
      'NotoSans-Regular': require('./assets/fonts/NotoSans-Regular.ttf'),
      'NotoSans-Bold'   : require('./assets/fonts/NotoSans-Bold.ttf'),
      'NotoSans-Medium' : require('./assets/fonts/NotoSans-Medium.ttf'),
      'UnBatang'        : require('./assets/fonts/UnBatang.ttf'),
      'UnBatang-Bold'   : require('./assets/fonts/UnBatangBold.ttf'),
    }).then(() => mounted && setFontsLoaded(true));

    return () => { mounted = false; clearTimeout(t); };
  }, []);

  /* (2) 스플래시 페이드아웃 */
  useEffect(() => {
    if (fontsLoaded && timerElapsed) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true })
        .start(() => setShowSplash(false));
    }
  }, [fontsLoaded, timerElapsed, fadeAnim]);

  /* (3) 토큰이 생길 때마다 /user 호출 */
  useEffect(() => {
    if (accessToken) {
      fetchUserInfo()
        .then((data) => {
          dispatch(setUser(data));

          /* ★ userRole이 null → 온보딩으로 이동 */
          if (data.userRole == "TEMP_USER") {
            // 이미 Onboarding이면 중복 네비게이션 방지
            if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name !== 'Onboarding') {
              navigate('Onboarding');
            }
          }
        })
        .catch((err) => console.error('🔴 fetchUserInfo 에러:', err));
    } else {
      dispatch(clearAuth());
    }
  }, [accessToken, dispatch]);

  /* (4) 로그인이 끝난 후에도 user.userRole 이 null 이면 Onboarding 이동 (토큰은 이미 있음) */
  useEffect(() => {
    if (user && user.userRole == null) {
      if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name !== 'Onboarding') {
        navigate('Onboarding');
      }
    }
  }, [user]);

  /* (5) 스플래시 뷰 */
  if (showSplash) {
    return (
      <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: fadeAnim, zIndex: 100 }}>
        <SplashScreen />
      </Animated.View>
    );
  }

  /* (6) 내비게이션 */
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animation: 'fade', gestureEnabled: true }}
      >
        {/* Public */}
        <Stack.Screen name="Home"          component={HomeScreen} />
        <Stack.Screen name="Auth"          component={AuthScreen} />
        <Stack.Screen name="AuthCode"      component={AuthCodeScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
        <Stack.Screen name="ResetDone"     component={ResetDoneScreen} />
        <Stack.Screen name="Register"      component={RegisterScreen} />
        <Stack.Screen name="Onboarding"    component={OnboardingScreen} />
        <Stack.Screen name="FAQ"           component={FaqScreen} />

        {/* MySpace / Admin */}
        <Stack.Screen name="MySpace"       component={MySpaceOrAdmin} />

        {/* Common */}
        <Stack.Screen name="EditProfile"   component={EditProfileScreen} />
        <Stack.Screen name="Post"          component={PostScreen} />
        <Stack.Screen name="gallery"       component={PostGalleryScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsofUse"    component={TermsofUseScreen} />

        {/* Admin 전용 */}
        <Stack.Screen name="article"       component={ArticleScreen} />
        <Stack.Screen
          name="MapPicker"
          component={MapPickerScreen}
          options={{ title: '지도에서 위치 선택' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ───────── Provider 래퍼 ───────── */
export default function App() {
  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
}

const styles = StyleSheet.create({});
