// src/hooks/useRequireAuth.js

import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Platform, Alert } from 'react-native';
import { navigate } from '../utils/nav/RootNavigation';

export function useRequireAuth() {
  const isLoggedIn = useSelector((state) => !!state.auth.accessToken);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const alertShownRef = useRef(false); // Alert 중복 방지

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (!isLoggedIn && !alertShownRef.current) {
        alertShownRef.current = true;

        if (Platform.OS === 'web') {
          const confirmed = window.confirm('로그인이 필요합니다. 로그인하시겠습니까?');
          if (confirmed) setShouldRedirect(true);
          else navigation.goBack();
        } else {
          Alert.alert('로그인 필요', '로그인이 필요합니다.', [
            { text: '취소', style: 'cancel', onPress: () => navigation.goBack() },
            { text: '로그인하기', onPress: () => setShouldRedirect(true) },
          ]);
        }
      }

      // 화면 빠져나갈 때 ref 초기화
      return () => {
        alertShownRef.current = false;
      };
    }, [isLoggedIn, navigation])
  );

  useEffect(() => {
    if (shouldRedirect) {
      navigate('Auth');
      setShouldRedirect(false); // 초기화
    }
  }, [shouldRedirect]);

  return isLoggedIn;
}
