import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

import { createPost } from '../../api/postApi';
import api from '../../api/axios';
import { ensureUserAndToken } from '../../utils/ensureUserAndToken';

import ArticleHeader from '../../components/article/ArticleHeader';
import ArticleTitle from '../../components/article/ArticleTitle';
import ArticleEditor from '../../components/article/ArticleEditor';
import ArticleItemList from '../../components/article/ArticleItemList';
import ArticleInfo from '../../components/article/ArticleInfo';
import AlbumIcon from '../../icons/album-green.svg';

const { height } = Dimensions.get('window');
const DEFAULT_FAB_BOTTOM = height * 0.09;
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

/* -------------------------------------------------------------------------- */
/*                                S3 업로드 헬퍼                                */
/* -------------------------------------------------------------------------- */
const uploadToS3 = async (uri, fileName, ext) => {
  // 1) 토큰 확보
  await ensureUserAndToken();

  try {
    // 2) 서버에 Presigned URL 요청 (파일명 URL 인코딩)
    const encodedName = encodeURIComponent(fileName);
    const { data } = await api.get(`/s3/presigned/${encodedName}`);
    const presignedUrl = data.url;

    // 3) 로컬 파일 → Base64 → ArrayBuffer
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const buffer = Buffer.from(base64, 'base64');

    // 4) PUT 업로드
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      },
      body: buffer,
    });

    if (!res.ok) {
      console.error('🚨 S3 업로드 실패', res.status, await res.text());
      throw new Error(`S3 업로드 실패: ${res.status}`);
    }

    // 5) presignedUrl에서 ? 앞부분(정적 URL)만 반환
    return presignedUrl.split('?')[0];
  } catch (err) {
    console.error('🚨 S3 업로드 실패', err);
    throw err;
  }
};

export default function ArticleScreen({ navigation }) {
  /* --------------------------------- 상태 --------------------------------- */
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([{ type: 'text', value: '' }]); // 글 본문 블록
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [narratives, setNarratives] = useState([
    { title: '', price: '', img: '', review: '' },
  ]);
  const [storeInfo, setStoreInfo] = useState({
    postalCode: '',
    address: '',
    coords: null,
    openDays: '',
    phoneNumber: '',
    instagramLink: '',
  });
  const [detailedAddress, setDetailedAddress] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------------- 키보드 이벤트 ---------------------------- */
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardHeight(0)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* --------------------------- 지도 좌표 받아오기 --------------------------- */
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'mapSelect',
      ({ address, coords, postalCode }) => {
        setStoreInfo((prev) => ({
          ...prev,
          address,
          coords,
          postalCode,
        }));
      }
    );
    return () => sub.remove();
  }, []);

  /* --------------------------- 이미지 처리 공통 --------------------------- */
  const processImage = async (uri, idx, type) => {
    let ext = uri.split('.').pop().toLowerCase();

    // HEIC → JPG 변환
    if (ext === 'heic' || ext === 'heif') {
      const manipulated = await ImageManipulator.manipulateAsync(uri, [], {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      uri = manipulated.uri;
      ext = 'jpg';
    }

    // 확장자 체크
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      Alert.alert(
        '사용할 수 없는 파일입니다.',
        'PNG, JPG, JPEG, GIF, WEBP 파일만 업로드 가능합니다.'
      );
      throw new Error('Unsupported file format');
    }

    // 폴더 구분 슬래시 대신 언더바 사용
    const fileName = `${type}_${Date.now()}_${idx}.${ext}`;
    return await uploadToS3(uri, fileName, ext);
  };

  /* ----------------------------- 글 등록 제출 ----------------------------- */
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('제목 필수', '제목을 입력해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      /* 본문 블록 업로드 */
      const uploadedBlocks = await Promise.all(
        blocks.map(async (blk, idx) => {
          if (blk.type === 'image' && blk.value.startsWith('file://')) {
            const url = await processImage(blk.value, idx, 'articles');
            return { ...blk, value: url };
          }
          return blk;
        })
      );

      /* 상품 이미지 업로드 */
      const uploadedNarratives = await Promise.all(
        narratives.map(async (n, idx) => {
          if (n.img && n.img.startsWith('file://')) {
            const url = await processImage(n.img, idx, 'products');
            return { ...n, img: url };
          }
          return n;
        })
      );

      /* 썸네일(첫 번째 이미지 블록) */
      const thumbnail = uploadedBlocks.find((b) => b.type === 'image');

      /* DTO 조립 */
      const postDto = {
        title,
        location: storeInfo.address,
        thumbnailUrl: thumbnail?.value ?? '',
        bookstoreReqDto: {
          postalCode: storeInfo.postalCode,
          address: storeInfo.address,
          detailedAddress,
          openDays: storeInfo.openDays,
          openHours,
          phoneNumber: storeInfo.phoneNumber,
          instagramLink: storeInfo.instagramLink,
        },
        contentReqDtoList: uploadedBlocks.map((b, i) => ({
          contentType: b.type === 'text' ? 'sentence' : 'img_url',
          content: b.value,
          order_index: i,
        })),
        productReqDtoList: uploadedNarratives.map((n) => ({
          productName: n.title,
          price: Number(n.price) || 0,
          productImg: n.img,
          description: n.review,
        })),
      };

      console.log('📨 전송할 postDto:', postDto);

      /* 서버 전송 */
      const { postId } = await createPost(postDto);

      /* 등록 후 글 상세로 이동 */
      navigation.replace('Post', { postId });
    } catch (err) {
      console.error(err);
      if (err.message !== 'Unsupported file format') {
        const msg = err.response?.message ?? err.message ?? '알 수 없는 오류';
        Alert.alert('등록 실패', msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------- 갤러리에서 삽입 --------------------------- */
  const pickImageAndInsert = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한을 허용해주세요.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (res.canceled) return;

    let uri = res.assets[0].uri;
    let ext = uri.split('.').pop().toLowerCase();

    // HEIC 변환
    if (ext === 'heic' || ext === 'heif') {
      const manipulated = await ImageManipulator.manipulateAsync(uri, [], {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      uri = manipulated.uri;
      ext = 'jpg';
    }

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      Alert.alert(
        '사용할 수 없는 파일입니다.',
        'PNG, JPG, JPEG, GIF, WEBP 파일만 업로드 가능합니다.'
      );
      return;
    }

    // 블록 배열에 삽입
    const idx = focusedIndex + 1;
    setBlocks((prev) => [
      ...prev.slice(0, idx),
      { type: 'image', value: uri },
      { type: 'text', value: '' },
      ...prev.slice(idx),
    ]);
    Keyboard.dismiss();
  };

  /* -------------------------------- 렌더링 ------------------------------- */
  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: STATUSBAR_HEIGHT }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={STATUSBAR_HEIGHT}
    >
      {/* 상단 헤더 */}
      <ArticleHeader
        onCancel={() => navigation.goBack()}
        onSubmit={handleSubmit}
      />

      {/* 본문 스크롤 */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ArticleTitle value={title} onChangeText={setTitle} />

        <ArticleEditor
          blocks={blocks}
          setBlocks={setBlocks}
          setFocusedIndex={setFocusedIndex}
        />

        <ArticleItemList
          items={narratives}
          onAdd={() =>
            narratives.length < 5 &&
            setNarratives([
              ...narratives,
              { title: '', price: '', img: '', review: '' },
            ])
          }
          onChangeItem={(i, v) => {
            const arr = [...narratives];
            arr[i] = v;
            setNarratives(arr);
          }}
          onRemoveItem={(i) =>
            setNarratives(narratives.filter((_, idx) => idx !== i))
          }
        />

        <ArticleInfo
          info={storeInfo}
          detailedAddress={detailedAddress}
          openHours={openHours}
          onChangeInfo={setStoreInfo}
          onChangeDetail={setDetailedAddress}
          onChangeHours={setOpenHours}
          onMapPress={() => navigation.navigate('MapPicker')}
        />
      </ScrollView>

      {/* 하단 FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: submitting
              ? DEFAULT_FAB_BOTTOM + 60
              : keyboardHeight > 0
              ? keyboardHeight + 16
              : DEFAULT_FAB_BOTTOM,
          },
        ]}
        onPress={pickImageAndInsert}
        disabled={submitting}
      >
        <AlbumIcon width={28} height={28} />
      </TouchableOpacity>

      {/* 전송 중 로딩 오버레이 */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#487153" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEFB',
  },
  scrollContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    backgroundColor: '#E2E7E3',
    borderRadius: 28,
    width: height * 0.06,
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#487153',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 2.4,
    elevation: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
