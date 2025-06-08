// src/utils/logout.js
import { removeRefreshToken, removeAccessToken } from "../utils/tokenStorage";
import { store } from "../store/store";
import { clearAuth } from "../store/authSlice";
import { navigationRef } from "../utils/nav/RootNavigation";   // 반드시 같은 경로

/**
 * 공통 로그아웃 (401·수동 로그아웃 모두 사용)
 * 1) 토큰 삭제  2) Redux 초기화  3) 네비게이션 reset
 */
export const logout = async () => {
  try {
    /* 1) SecureStore 토큰 삭제 */
    await removeRefreshToken();
    await removeAccessToken();

    /* 2) Redux 상태 초기화 */
    store.dispatch(clearAuth());

    /* 3) 네비게이션 스택 reset */
    if (navigationRef.isReady()) {
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: "Auth" }],   // Auth 스택(또는 화면)으로 초기화
      });
    }
  } catch (err) {
    console.warn("⚠️ logout error:", err);
    throw err;
  }
};
