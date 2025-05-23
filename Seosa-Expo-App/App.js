// App.js
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

import SplashScreen from './src/screens/home/SplashScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import AuthScreen from './src/screens/auth/AuthScreen';
import AuthCodeScreen from './src/screens/auth/AuthCodeScreen';
import PasswordResetScreen from './src/screens/auth/PasswordResetScreen';
import ResetDoneScreen from './src/screens/auth/ResetDoneScreen';
import RegisterScreen from './src/screens/register/RegisterScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import MainScreen from './src/screens/temp/MainScreen';
import MySpaceScreen from './src/screens/myspace/MySpaceScreen';
import FaqScreen from './src/screens/faq/FaqScreen';
import AdminMySpaceScreen from './src/screens/admin/AdminMySpaceScreen';
import EditProfileScreen from './src/screens/myspace/EditProfileScreen';
import PostScreen from './src/screens/post/PostScreen';
import PrivacyPolicyScreen from './src/screens/home/PrivacyPolicyScreen';
import TermsofUseScreen from './src/screens/home/TermsofUseScreen';
import PostGalleryScreen from './src/screens/post/PostGalleryScreen';
import ArticleScreen from './src/screens/article/ArticleScreen';
// ✨추가✨
import MapPickerScreen from './src/screens/map/MapPickerScreen';

const Stack = createNativeStackNavigator();

function RootApp() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  // 스플래시 & 폰트 로드
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => mounted && setTimerElapsed(true), 2000);
    Font.loadAsync({
      'NotoSans-Regular': require('./assets/fonts/NotoSans-Regular.ttf'),
      'NotoSans-Bold':    require('./assets/fonts/NotoSans-Bold.ttf'),
      'NotoSans-Medium':  require('./assets/fonts/NotoSans-Medium.ttf'),
    }).then(() => mounted && setFontsLoaded(true));

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded && timerElapsed) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => setShowSplash(false));
    }
  }, [fontsLoaded, timerElapsed]);

  // 유저 정보 fetch
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userData = await fetchUserInfo();
        dispatch(setUser(userData));
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
      }
    };
    if (accessToken) getUserInfo();
  }, [accessToken]);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            gestureEnabled: true
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="AuthCode" component={AuthCodeScreen} />
          <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          <Stack.Screen name="ResetDone" component={ResetDoneScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="MySpace" component={MySpaceScreen} />
          <Stack.Screen name="FAQ" component={FaqScreen} />
          <Stack.Screen name="AdminSpace" component={AdminMySpaceScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsofUse" component={TermsofUseScreen} />
          <Stack.Screen name="gallery" component={PostGalleryScreen} />
          {/* 여기서 MapPickerScreen을 등록합니다 */}
          <Stack.Screen
            name="MapPicker"
            component={MapPickerScreen}
            options={{ title: '지도에서 위치 선택' }}
          />
          <Stack.Screen name="article" component={ArticleScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      {showSplash && (
        <Animated.View
          pointerEvents="box-none"
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 100,
            opacity: fadeAnim,
          }}
        >
          <SplashScreen />
        </Animated.View>
      )}
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
}
