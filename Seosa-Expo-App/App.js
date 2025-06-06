// App.js
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
import { setUser, setAccessToken, setRefreshToken, clearAuth } from './src/store/authSlice';
import { fetchUserInfo } from './src/api/userApi';
import { getRefreshToken as loadRefreshToken, getAccessToken as loadAccessToken } from './src/utils/tokenStorage';
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
import AdminMySpaceScreen   from './src/screens/admin/AdminMySpaceScreen';
import EditProfileScreen    from './src/screens/myspace/EditProfileScreen';
import PrivacyPolicyScreen  from './src/screens/home/PrivacyPolicyScreen';
import TermsofUseScreen     from './src/screens/home/TermsofUseScreen';

import PostScreen           from './src/screens/post/PostScreen';
import PostGalleryScreen    from './src/screens/post/PostGalleryScreen';

import ArticleScreen        from './src/screens/article/ArticleScreen';
import MapPickerScreen      from './src/screens/map/MapPickerScreen';

const Stack = createNativeStackNavigator();

/**
 * ───────────────────────────────────────────────────────────────────────────────
 *  MySpaceOrAdmin 컴포넌트
 *  - "MySpace"라는 이름으로 이동했을 때, user.userRole에 따라
 *    일반 유저라면 MySpaceScreen을, 관리자/에디터라면 AdminMySpaceScreen을 렌더
 * ───────────────────────────────────────────────────────────────────────────────
 */
function MySpaceOrAdmin(props) {
  const user = useSelector((state) => state.auth.user);

  // user 정보가 아직 없으면 로딩 상태
  if (!user) {
    return null;
  }

  // 관리자 또는 에디터 권한이면 AdminMySpaceScreen
  if (user.userRole === 'ADMIN' || user.userRole === 'EDITOR') {
    return <AdminMySpaceScreen {...props} />;
  }

  // 그 외(일반 유저)라면 MySpaceScreen
  return <MySpaceScreen {...props} />;
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*                                 RootApp                                   */
/* ──────────────────────────────────────────────────────────────────────────── */
function RootApp() {
  // 폰트/스플래시 로딩 상태 관리
  const [fontsLoaded, setFontsLoaded]   = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(false);
  const [showSplash, setShowSplash]     = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dispatch    = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user        = useSelector((state) => state.auth.user);

  // ── (0) 앱 시작 시 SecureStore에서 저장된 accessToken/refreshToken을 Redux에 세팅 ──
  useEffect(() => {
    let isMounted = true;
    const rehydrateTokens = async () => {
      try {
        const storedAccess  = await loadAccessToken();
        const storedRefresh = await loadRefreshToken();
        if (isMounted) {
          if (storedAccess)  dispatch(setAccessToken(storedAccess));
          if (storedRefresh) dispatch(setRefreshToken(storedRefresh));
        }
      } catch (e) {
        console.error("🔴 토큰 로드 에러:", e);
      }
    };
    rehydrateTokens();
    return () => { isMounted = false; };
  }, [dispatch]);

  // ── (1) 스플래시 화면 & 커스텀 폰트 로딩 ──
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => mounted && setTimerElapsed(true), 2000);
    Font.loadAsync({
      'NotoSans-Regular': require('./assets/fonts/NotoSans-Regular.ttf'),
      'NotoSans-Bold':    require('./assets/fonts/NotoSans-Bold.ttf'),
      'NotoSans-Medium':  require('./assets/fonts/NotoSans-Medium.ttf'),
    }).then(() => mounted && setFontsLoaded(true));
    return () => { mounted = false; clearTimeout(timer); };
  }, []);

  // ── (2) 폰트 로딩 + 2초 대기 후 스플래시 페이드 아웃 ──
  useEffect(() => {
    if (fontsLoaded && timerElapsed) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }
  }, [fontsLoaded, timerElapsed, fadeAnim]);

  // ── (3) accessToken이 세팅될 때마다 fetchUserInfo 호출 ──
  useEffect(() => {
    if (accessToken) {
      fetchUserInfo()
        .then((userData) => {
          console.log("🔍 fetchUserInfo 응답:", userData);
          dispatch(setUser(userData));
        })
        .catch((err) => console.error("🔴 fetchUserInfo 에러:", err));
    } else {
      // accessToken이 없어진다면(=로그아웃), user 정보 초기화
      dispatch(clearAuth());
    }
  }, [accessToken, dispatch]);

  // ── (4) 스플래시 화면 렌더링 ──
  if (showSplash) {
    return (
      <Animated.View
        pointerEvents="box-none"
        style={{ ...StyleSheet.absoluteFillObject, opacity: fadeAnim, zIndex: 100 }}
      >
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{ headerShown: false, animation: 'fade', gestureEnabled: true }}
      >
        {/* ───── Public ───── */}
        <Stack.Screen name="Home"          component={HomeScreen} />
        <Stack.Screen name="Auth"          component={AuthScreen} />
        <Stack.Screen name="AuthCode"      component={AuthCodeScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
        <Stack.Screen name="ResetDone"     component={ResetDoneScreen} />
        <Stack.Screen name="Register"      component={RegisterScreen} />
        <Stack.Screen name="Onboarding"    component={OnboardingScreen} />

        {/* ───── 나의 공간 ───── */}
        <Stack.Screen name="MySpace" component={MySpaceOrAdmin} />

        {/* 공통으로 사용하는 스크린 */}
        <Stack.Screen name="EditProfile"   component={EditProfileScreen} />
        <Stack.Screen name="Post"          component={PostScreen} />
        <Stack.Screen name="gallery"       component={PostGalleryScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsofUse"    component={TermsofUseScreen} />

        {/* 관리자 전용 스크린 */}
        <Stack.Screen name="article"     component={ArticleScreen} />
        <Stack.Screen name="MapPicker"     component={MapPickerScreen} options={{ title: '지도에서 위치 선택' }} />

      </Stack.Navigator>
    </NavigationContainer>
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
