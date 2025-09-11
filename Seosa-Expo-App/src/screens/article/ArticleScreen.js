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

/* ───────── S3 업로드 ───────── */
const uploadToS3 = async (uri, fileName, ext) => {
  await ensureUserAndToken();

  const encoded = encodeURIComponent(fileName);
  const { data } = await api.get(`/s3/presigned/${encoded}`);
  console.log(data.url);
  const presignedUrl = data.url;
  const objectKey = data.objectKey;

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = Buffer.from(base64, 'base64');

  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': `image/${ext === 'jpg' ? 'jpeg' : ext}` },
    body: buffer,
  });

  if (!res.ok) {
    console.error('🚨  S3 업로드 실패', res.status, await res.text());
    throw new Error(`S3 업로드 실패: ${res.status}`);
  }

  return objectKey;
};

export default function ArticleScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([{ type: 'text', value: '' }]);
  const [focusedIndex, setFocusedIdx] = useState(0);
  const [keyboardHeight, setKb] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailIdx, setThumbnailIdx] = useState(null);

  /* ───── 상품(서사) 상태 ───── */
  const [narratives, setNarratives] = useState([
    { title: '', price: '', img: '', review: '' },
  ]);

  /* ───── 서점 정보 상태 ───── */
  const [storeInfo, setStoreInfo] = useState({
    postalCode: '',          // 🔺 우편번호
    address: '',
    coords: null,
    openDays: '',
    phoneNumber: '',
    instagramLink: '',
  });
  const [detailedAddress, setDetail] = useState('');
  const [openHours, setOpenHours] = useState('');

  /* ───── 키보드 리스너 ───── */
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) =>
      setKb(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener('keyboardDidHide', () => setKb(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* ───── MapPicker에서 선택되면 storeInfo 갱신 ───── */
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'mapSelect',
      ({ address, coords, postalCode }) =>
        setStoreInfo((prev) => ({ ...prev, address, coords, postalCode }))
    );
    return () => sub.remove();
  }, []);

  /* ───── 이미지 전처리 & 업로드 ───── */
  const processImage = async (uri, idx, folder) => {
    let ext = uri.split('.').pop().toLowerCase();

    if (ext === 'heic' || ext === 'heif') {
      const converted = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      uri = converted.uri;
      ext = 'jpg';
    }

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      Alert.alert(
        '지원하지 않는 파일',
        'PNG · JPG · JPEG · GIF · WEBP 만 업로드 가능합니다.'
      );
      throw new Error('Unsupported file');
    }

    const fileName = `${folder}_${Date.now()}_${idx}.${ext}`;
    return await uploadToS3(uri, fileName, ext);
  };

  /* ───── 글 등록 ───── */
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('제목 필수', '제목을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await ensureUserAndToken();

      /* 1) 본문 이미지 S3 업로드 */
      const uploadedBlocks = await Promise.all(
        blocks.map(async (b, i) =>
          b.type === 'image' && b.value.startsWith('file://')
            ? { ...b, value: await processImage(b.value, i, 'images') }
            : b
        )
      );

      /* 2) 상품 이미지 S3 업로드 */
      const uploadedNarr = await Promise.all(
        narratives.map(async (n, i) =>
          n.img && n.img.startsWith('file://')
            ? { ...n, img: await processImage(n.img, i, 'images') }
            : n
        )
      );

      /* 3) 썸네일 결정 */
      const thumbnailBlock = uploadedBlocks[thumbnailIdx];

      /* 4) DTO 조립 (🔺 postalCode 포함) */
      const postDto = {
        title,
        location: storeInfo.address,
        thumbnailUrl:
          thumbnailBlock?.type === 'image' ? thumbnailBlock.value : '',
        bookstoreReqDto: {
          postalCode: storeInfo.postalCode,   // 🔺
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
        productReqDtoList: uploadedNarr.map((n) => ({
          productName: n.title,
          price: Number(n.price) || 0,
          productImg: n.img,
          description: n.review,
        })),
      };

      /* 5) 서버 전송 */
      const { postId } = await createPost(postDto);
      navigation.replace('Post', { postId });
    } catch (err) {
      console.error(err);
      if (err.message !== 'Unsupported file') {
        Alert.alert('등록 실패', err.response?.data?.message ?? err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ───── 갤러리에서 이미지 선택 후 본문에 삽입 ───── */
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

    if (ext === 'heic' || ext === 'heif') {
      const converted = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      uri = converted.uri;
      ext = 'jpg';
    }

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      Alert.alert(
        '지원하지 않는 파일',
        'PNG · JPG · JPEG · GIF · WEBP 만 업로드 가능합니다.'
      );
      return;
    }

    const insertAt = focusedIndex + 1;
    const newBlocks = [
      ...blocks.slice(0, insertAt),
      { type: 'image', value: uri },
      { type: 'text', value: '' },
      ...blocks.slice(insertAt),
    ];
    setBlocks(newBlocks);
    Keyboard.dismiss();

    /* 이미지가 처음 추가되면 자동으로 썸네일 지정 */
    if (thumbnailIdx === null) {
      const firstImageIdx = newBlocks.findIndex((b) => b.type === 'image');
      if (firstImageIdx !== -1) setThumbnailIdx(firstImageIdx);
    }
  };

  /* ───── UI ───── */
  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: STATUSBAR_HEIGHT }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ArticleHeader
        onCancel={() => navigation.goBack()}
        onSubmit={handleSubmit}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ArticleTitle value={title} onChangeText={setTitle} />

        <ArticleEditor
          blocks={blocks}
          setBlocks={setBlocks}
          setFocusedIndex={setFocusedIdx}
          thumbnailIndex={thumbnailIdx}
          setThumbnailIndex={setThumbnailIdx}
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
            const next = [...narratives];
            next[i] = v;
            setNarratives(next);
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
          onChangeDetail={setDetail}
          onChangeHours={setOpenHours}
          onMapPress={() => navigation.navigate('MapPicker')}
        />
      </ScrollView>

      {/* 플로팅 버튼 */}
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

      {/* 로딩 오버레이 */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#487153" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

/* ───────── 스타일 ───────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFEFB' },
  scrollContainer: { paddingBottom: 40, alignItems: 'center' },
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
