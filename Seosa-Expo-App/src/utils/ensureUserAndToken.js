import { store } from "../store/store";

/**
 * 토큰 존재만 확인해 주고, 유저 정보는 건드리지 않는다.
 * (인터셉터가 토큰 재발급을 이미 책임지고 있음)
 */
export const ensureUserAndToken = () => {
  const state = store.getState();
  if (!state.auth.accessToken) {
    throw new Error("로그인 정보가 없습니다. 다시 로그인해주세요.");
  }
  return state.auth.accessToken;          // 필요하면 반환
};
