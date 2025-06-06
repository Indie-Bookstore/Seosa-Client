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
  StatusBar as NTStatusBar,
  Alert,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import {
  S3_BUCKET,
  S3_REGION,
  COGNITO_POOL_ID,
  S3_PUBLIC_URL,
} from '../../config/aws';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

import ArticleHeader   from '../../components/article/ArticleHeader';
import ArticleTitle    from '../../components/article/ArticleTitle';
import ArticleEditor   from '../../components/article/ArticleEditor';
import ArticleItemList from '../../components/article/ArticleItemList';
import ArticleInfo     from '../../components/article/ArticleInfo';
import AlbumIcon       from '../../icons/album-green.svg';

import { createPost } from '../../api/postApi';

const { width, height } = Dimensions.get('window');
const DEFAULT_FAB_BOTTOM = height * 0.09;
const STATUSBAR_HEIGHT = Platform.OS === 'ios'
  ? Constants.statusBarHeight
  : NTStatusBar.currentHeight || 0;

const s3 = new S3Client({
  region: S3_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig  : { region: S3_REGION },
    identityPoolId: COGNITO_POOL_ID,
  }),
});

const uploadToS3 = async (uri, key) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = Buffer.from(base64, 'base64');
  await s3.send(
    new PutObjectCommand({
      Bucket     : S3_BUCKET,
      Key        : key,
      Body       : buffer,
      ContentType: 'image/jpeg',
    })
  );
  return S3_PUBLIC_URL(key);
};

export default function ArticleScreen({ navigation }) {
  /* ──── State 정의 ──── */
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([{ type:'text', value:'' }]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [narratives, setNarratives] = useState([
    { title:'', price:'', img:'', review:'' },
  ]);

  // ★ storeInfo에 postalCode 필드 반드시 선언
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

  /* ──── 키보드 높이 추적 ──── */
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

  /* ──── MapPicker에서 선택된 주소·좌표·우편번호(postalCode) 받기 ──── */
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'mapSelect',
      ({ address, coords, postalCode }) => {
        setStoreInfo(prev => ({
          ...prev,
          address,        // 도로명/지번 주소
          coords,         // { lat, lng }
          postalCode,     // 우편번호 저장
        }));
      }
    );
    return () => sub.remove();
  }, []);

  /* ──── 글 등록 함수 ──── */
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('제목 필수', '제목을 입력해주세요.');
      return;
    }
    setSubmitting(true);

    try {
      // === 1) blocks(본문) 이미지 업로드 ===
      const uploadedBlocks = await Promise.all(
        blocks.map(async (blk, idx) => {
          if (blk.type === 'image' && blk.value.startsWith('file://')) {
            const key = `articles/${Date.now()}_${idx}_${blk.value.split('/').pop()}`;
            const url = await uploadToS3(blk.value, key);
            return { ...blk, value: url };
          }
          return blk;
        })
      );

      // === 2) narratives(상품) 이미지 업로드 ===
      const uploadedNarratives = await Promise.all(
        narratives.map(async (n, idx) => {
          if (n.img && n.img.startsWith('file://')) {
            const key = `products/${Date.now()}_${idx}_${n.img.split('/').pop()}`;
            const url = await uploadToS3(n.img, key);
            return { ...n, img: url };
          }
          return n;
        })
      );

      // === 3) POST 요청용 JSON 조립 ===
      const thumbnail = uploadedBlocks.find(b => b.type === 'image');

      const postDto = {
        title,
        location    : storeInfo.address,
        thumbnailUrl: thumbnail?.value ?? '',
        bookstoreReqDto: {
          postalCode    : storeInfo.postalCode,    // ★ 여기에 postalCode가 반드시 들어가야 함
          address       : storeInfo.address,
          detailedAddress,
          openDays      : storeInfo.openDays,
          openHours,
          phoneNumber   : storeInfo.phoneNumber,
          instagramLink : storeInfo.instagramLink,
        },
        contentReqDtoList: uploadedBlocks.map((b, i) => ({
          contentType: b.type === 'text' ? 'sentence' : 'img_url',
          content    : b.value,
          order_index: i,
        })),
        productReqDtoList: uploadedNarratives.map(n => ({
          productName: n.title,
          price      : Number(n.price) || 0,
          productImg : n.img,
          description: n.review,
        })),
      };

      // → payload 찍어보기
      console.log("📨 전송할 postDto:", postDto);

      // === 4) createPost API 호출 ===
      const res = await createPost(postDto);
      const postId = res.data.postId;

      // === 5) PostScreen으로 이동 ===
      navigation.replace('Post', { postId });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message ?? err.message ?? '알 수 없는 오류';
      Alert.alert('등록 실패', msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ──── 이미지 삽입 핸들러 ──── */
  const pickImageAndInsert = async () => {
    // 미디어 라이브러리 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한을 허용해주세요.');
      return;
    }

    // 이미지 선택
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality   : 1,
    });
    if (res.canceled) return;

    // 선택된 로컬 URI(예: file:///…)
    const uri = res.assets[0].uri;

    // 현재 포커스된 블록 인덱스 다음에 삽입
    const idx = focusedIndex + 1;
    setBlocks(prev => [
      ...prev.slice(0, idx),
      { type:'image', value:uri },
      { type:'text', value:'' },
      ...prev.slice(idx),
    ]);

    // 키보드 닫기
    Keyboard.dismiss();
  };

  /* ──── UI 렌더링 ──── */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 상태바 높이 만큼 띄우기 */}
      <View style={{ height: STATUSBAR_HEIGHT }} />

      {/* 헤더: 취소(뒤로가기) / 등록 버튼 */}
      <ArticleHeader onCancel={() => navigation.goBack()} onSubmit={handleSubmit} />

      {/* 본문 스크롤 */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1) 제목 입력 */}
        <ArticleTitle value={title} onChangeText={setTitle} />

        {/* 2) 블록 편집기(텍스트/이미지) */}
        <ArticleEditor
          blocks={blocks}
          setBlocks={setBlocks}
          setFocusedIndex={setFocusedIndex}
        />

        {/* 3) 서사 모아보기(상품 리스트) */}
        <ArticleItemList
          items={narratives}
          onAdd={() =>
            narratives.length < 5 &&
            setNarratives([
              ...narratives,
              { title:'', price:'', img:'', review:'' },
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

        {/* 4) 서점 정보(주소, 지도 선택, 상세주소 등) */}
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

      {/* 5) 이미지 추가 Floating Action Button */}
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

      {/* 6) 로딩 오버레이(제출 처리 중) */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#487153" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

/* ──── Styles ──── */
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
