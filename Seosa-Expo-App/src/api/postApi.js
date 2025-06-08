/**
 * 글(Post) 관련 API 모음
 * - ADMIN, EDITOR 전용
 */

import api from './axios';

/**
 * 글 작성
 * @param {object} postDto – `/post` Request Body
 * @returns {Promise<object>} – Success Response
 */
export const createPost = async (postDto) => {
  const { data } = await api.post('/post', postDto);
  return data;
};
