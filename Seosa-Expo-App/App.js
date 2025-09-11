import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

if (typeof global.Buffer === "undefined") {
  global.Buffer = require("buffer").Buffer;
}

import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, Alert, Share } from "react-native";
import { useFonts } from "expo-font";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { store } from "./src/store/store";
import {
  setUser,
  setAccessToken,
  setRefreshToken,
  clearAuth,
} from "./src/store/authSlice";
import { fetchUserInfo } from "./src/api/userApi";
import {
  getRefreshToken as loadRefreshToken,
  getAccessToken as loadAccessToken,
} from "./src/utils/tokenStorage";
import { navigationRef, navigate } from "./src/utils/nav/RootNavigation";

/* ───────── 스크린 import ───────── */
import SplashUI from "./src/screens/home/SplashScreen";
import HomeScreen from "./src/screens/home/HomeScreen";
import AuthScreen from "./src/screens/auth/AuthScreen";
import AuthCodeScreen from "./src/screens/auth/AuthCodeScreen";
import PasswordResetScreen from "./src/screens/auth/PasswordResetScreen";
import ResetDoneScreen from "./src/screens/auth/ResetDoneScreen";
import RegisterScreen from "./src/screens/register/RegisterScreen";
import OnboardingScreen from "./src/screens/auth/OnboardingScreen";
import MySpaceScreen from "./src/screens/myspace/MySpaceScreen";
import AdminMySpaceScreen from "./src/screens/admin/AdminMySpaceScreen";
import EditProfileScreen from "./src/screens/myspace/EditProfileScreen";
import PrivacyPolicyScreen from "./src/screens/home/PrivacyPolicyScreen";
import TermsofUseScreen from "./src/screens/home/TermsofUseScreen";
import PostScreen from "./src/screens/post/PostScreen";
import PostGalleryScreen from "./src/screens/post/PostGalleryScreen";
import ArticleScreen from "./src/screens/article/ArticleScreen";
import MapPickerScreen from "./src/screens/map/MapPickerScreen";
import FaqScreen from "./src/screens/faq/FaqScreen";

const Stack = createNativeStackNavigator();

// 딥링크 설정
const linking = {
  prefixes: [
    "seosa://",                
  ],
  config: {
    screens: {
      Home: "home",
      Auth: "auth",
      AuthCode: "auth/code",
      PasswordReset: "auth/reset",
      ResetDone: "auth/reset/done",
      Register: "auth/register",
      Onboarding: "onboarding",
      FAQ: "faq",
      MySpace: "myspace",
      EditProfile: "myspace/edit",
      Post: "post/:postId",
      gallery: "gallery",
      article: "article/:articleId",
      MapPicker: "map/picker",
      PrivacyPolicy: "privacy",
      TermsofUse: "terms",
    },
  },
};

function MySpaceOrAdmin(props) {
  const user = useSelector((state) => state.auth.user);
  if (!user) return null;
  return user.userRole === "ADMIN" || user.userRole === "EDITOR" ? (
    <AdminMySpaceScreen {...props} />
  ) : (
    <MySpaceScreen {...props} />
  );
}

function RootApp() {
  const [timerElapsed, setTimerElapsed] = useState(false);
  const [tokensLoaded, setTokensLoaded] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);

  // 1) 토큰 복원
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedAccess = await loadAccessToken();
        const storedRefresh = await loadRefreshToken();
        if (!mounted) return;
        if (storedAccess) dispatch(setAccessToken(storedAccess));
        if (storedRefresh) dispatch(setRefreshToken(storedRefresh));
      } catch (e) {
        console.error("🔴 토큰 로드 에러:", e);
      } finally {
        if (mounted) setTokensLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  // 2) 유저 정보 로드
  useEffect(() => {
    if (accessToken) {
      fetchUserInfo()
        .then((data) => {
          dispatch(setUser(data));
          if (data.userRole === "TEMP_USER" && navigationRef.isReady()) {
            const current = navigationRef.getCurrentRoute()?.name;
            if (current !== "Onboarding") navigate("Onboarding");
          }
        })
        .catch((err) => console.error("🔴 fetchUserInfo 에러:", err))
        .finally(() => setUserLoaded(true));
    } else {
      dispatch(clearAuth());
      setUserLoaded(true);
    }
  }, [accessToken, dispatch]);

  // 폰트 로드
  const [fontsLoaded] = useFonts({
    "NotoSans-Regular": require("./assets/fonts/NotoSans-Regular.ttf"),
    "NotoSans-Bold": require("./assets/fonts/NotoSans-Bold.ttf"),
    "NotoSans-Medium": require("./assets/fonts/NotoSans-Medium.ttf"),
    "UnBatang": require("./assets/fonts/UnBatang.ttf"),
    "UnBatang-Bold": require("./assets/fonts/UnBatangBold.ttf"),
  });

  // 최소 스플래시 시간
  useEffect(() => {
    const timer = setTimeout(() => setTimerElapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 스플래시 페이드아웃
  useEffect(() => {
    if (fontsLoaded && timerElapsed && tokensLoaded && userLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      (async () => {
        const [secAccess, secRefresh] = await Promise.all([
          loadAccessToken(),
          loadRefreshToken(),
        ]);
        console.log("🔑 SecureStore accessToken:", secAccess);
        console.log("🔑 SecureStore refreshToken:", secRefresh);
        console.log(
          "🗂️  Redux accessToken:",
          store.getState().auth.accessToken
        );
        console.log("👤 Redux user:", store.getState().auth.user);
      })();
    }
  }, [fontsLoaded, timerElapsed, tokensLoaded, userLoaded, fadeAnim]);

  // 온보딩 체크
  useEffect(() => {
    if (
      userLoaded &&
      user &&
      user.userRole == null &&
      navigationRef.isReady()
    ) {
      const current = navigationRef.getCurrentRoute()?.name;
      if (current !== "Onboarding") navigate("Onboarding");
    }
  }, [userLoaded, user]);

  // 스플래시 화면
  if (!fontsLoaded || !timerElapsed || !tokensLoaded || !userLoaded) {
    return (
      <Animated.View
        style={{ ...StyleSheet.absoluteFillObject, opacity: fadeAnim }}
      >
        <SplashUI />
      </Animated.View>
    );
  }

  // 메인 내비게이션
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking} // 딥링크 적용
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="AuthCode" component={AuthCodeScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
        <Stack.Screen name="ResetDone" component={ResetDoneScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="FAQ" component={FaqScreen} />
        <Stack.Screen name="MySpace" component={MySpaceOrAdmin} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="gallery" component={PostGalleryScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsofUse" component={TermsofUseScreen} />
        <Stack.Screen name="article" component={ArticleScreen} />
        <Stack.Screen
          name="MapPicker"
          component={MapPickerScreen}
          options={{ title: "지도에서 위치 선택" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
}

const styles = StyleSheet.create({});
