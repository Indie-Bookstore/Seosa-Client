// src/screens/article/ArticleScreen.js

import 'react-native-get-random-values';  // UUID 생성용
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
  StatusBar as RNStatusBar,
  Alert,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// ↓ aws-exports.js 혹은 config/aws.js 등에 정의한 값들
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

import { createPost } from '../../api/postApi';   // ① 글 작성 API 호출 함수

// 화면 크기 상수
const { width, height } = Dimensions.get('window');
const DEFAULT_FAB_BOTTOM = height * 0.09;
const STATUSBAR_HEIGHT   = Platform.OS === 'ios'
  ? Constants.statusBarHeight
  : RNStatusBar.currentHeight || 0;

/* ──── S3 업로드 헬퍼 함수 ──── */
const s3 = new S3Client({
  region: S3_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig  : { region: S3_REGION },
    identityPoolId: COGNITO_POOL_ID,
  }),
});

/**
 * uploadToS3(uri, key) : 
 *   1) 로컬 파일(uri, file://…)을 Base64로 읽는다
 *   2) Buffer로 변환한 뒤 S3에 PutObjectCommand로 업로드
 *   3) 성공하면 공개 URL(S3_PUBLIC_URL)을 리턴
 */
const uploadToS3 = async (uri, key) => {
  // ① local file → base64 문자열
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // ② base64 → Buffer (global.Buffer)
  const buffer = Buffer.from(base64, 'base64');

  // ③ S3 PutObject
  await s3.send(
    new PutObjectCommand({
      Bucket     : S3_BUCKET,
      Key        : key,
      Body       : buffer,
      ContentType: 'image/jpeg',  // 이미지 타입에 맞춰서 필요 시 수정
    })
  );

  // ④ 업로드 후 퍼블릭 URL 생성
  return S3_PUBLIC_URL(key);
};

/**
 * ArticleScreen
 *  - “글 작성” 화면. 
 *  - 블록(텍스트/이미지) · narratives(상품) 이미지 → S3에 업로드 
 *  - 지도 선택 → 주소 · 좌표 · 우편번호(postalCode)를 받아와 storeInfo에 저장
 *  - createPost API 호출 후 postId를 받아 PostScreen으로 네비게이션 이동
 */
export default function ArticleScreen({ navigation }) {
  /* ──── State 정의 ──── */
  const [title, setTitle] = useState('');
  // blocks: [{ type:'text'|'image', value:<text or uri> }, ...]
  const [blocks, setBlocks] = useState([{ type:'text', value:'' }]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // narratives: [{ title:상품명, price:문자열, img:uri 또는 S3 URL, review:한줄평 }, ...]
  const [narratives, setNarratives] = useState([
    { title:'', price:'', img:'', review:'' },
  ]);

  // storeInfo: { postalCode:'', address:'', coords:{lat,lng}|null, openDays:'', phoneNumber:'', instagramLink:'' }
  const [storeInfo, setStoreInfo] = useState({
    postalCode:'',
    address:'',
    coords: null,
    openDays:'',
    phoneNumber:'',
    instagramLink:'',
  });

  const [detailedAddress, setDetailedAddress] = useState('');  // 상세주소
  const [openHours, setOpenHours] = useState('');              // 영업시간
  const [submitting, setSubmitting] = useState(false);         // 등록 중 표시용

  /* ──── 키보드 높이 추적 (기존 로직 그대로) ──── */
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
    // DeviceEventEmitter로부터 “mapSelect” 이벤트를 구독
    // { address, coords:{lat,lng}, postalCode } 형태로 넘어온다.
    const sub = DeviceEventEmitter.addListener(
      'mapSelect',
      ({ address, coords, postalCode }) => {
        setStoreInfo(prev => ({
          ...prev,
          address,       // 도로명/지번 주소
          coords,        // { lat, lng }
          postalCode,    // 우편번호
        }));
      }
    );
    return () => sub.remove();
  }, []);

  /* ──── 글 등록 함수 (1. 이미지 업로드 → 2. createPost API 호출 → 3. postId 받아 이동) ──── */
  const handleSubmit = async () => {
    // 제목이 비어 있으면 등록하지 않음
    if (!title.trim()) {
      Alert.alert('제목 필수', '제목을 입력해주세요.');
      return;
    }
    setSubmitting(true);

    try {
      // === 1) blocks(본문) 이미지 업로드 ===
      // blocks: [{ type:'text', value:'문장'}, { type:'image', value:'file://...' }, ... ]
      const uploadedBlocks = await Promise.all(
        blocks.map(async (blk, idx) => {
          if (blk.type === 'image' && blk.value.startsWith('file://')) {
            // S3 key: articles/{timestamp}_{index}_{원본파일명}
            const key = `articles/${Date.now()}_${idx}_${blk.value.split('/').pop()}`;
            const url = await uploadToS3(blk.value, key);
            return { ...blk, value: url };
          }
          // 텍스트 블록이면 그대로 반환
          return blk;
        })
      );

      // === 2) narratives(상품) 이미지 업로드 ===
      // narratives: [{ title, price, img: file://... or 이미 S3 URL, review }, ... ]
      const uploadedNarratives = await Promise.all(
        narratives.map(async (n, idx) => {
          if (n.img && n.img.startsWith('file://')) {
            // S3 key: products/{timestamp}_{index}_{원본파일명}
            const key = `products/${Date.now()}_${idx}_${n.img.split('/').pop()}`;
            const url = await uploadToS3(n.img, key);
            return { ...n, img: url };
          }
          // 이미 S3 URL(혹은 빈 문자열)인 경우
          return n;
        })
      );

      // === 3) POST 요청용 JSON 조립 ===
      // 3-1) 썸네일: 본문 블록 중 첫 번째 image 블록
      const thumbnail = uploadedBlocks.find(b => b.type === 'image');

      // 3-2) API 스펙에 맞게 JSON 생성
      const postDto = {
        title,                                  // 글 제목
        location    : storeInfo.address,        // 기본 주소
        thumbnailUrl: thumbnail?.value ?? '',    // 썸네일 URL (없으면 빈 문자열)
        bookstoreReqDto: {
          postalCode    : storeInfo.postalCode,    // 우편번호
          address       : storeInfo.address,       // 기본 주소
          detailedAddress,                         // 상세 주소
          openDays      : storeInfo.openDays,      // 영업일
          openHours,                               // 영업시간
          phoneNumber   : storeInfo.phoneNumber,   // 전화번호
          instagramLink : storeInfo.instagramLink, // 인스타그램 링크
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

      // === 4) createPost API 호출 ===
      // 예: createPost(postDto) → { data: { postId: 123, ... } }
      const res = await createPost(postDto);
      const postId = res.data.postId;  // 응답에서 postId를 꺼낸다

      // === 5) PostScreen(글 상세)으로 이동 ===
      // navigation.replace 대신 navigation.navigate를 써도 되지만,
      // replace를 쓰면 “뒤로가면 글 목록 등”으로 돌아가지 않고, 해당 글 자체 내비게이션만 남는다.
      navigation.replace('Post', { postId });
    }
    catch (err) {
      console.error(err);
      const msg = err.response?.data?.message ?? err.message ?? '알 수 없는 오류';
      Alert.alert('등록 실패', msg);
    }
    finally {
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
      {/* iOS/Android 상태바 높이만큼 띄우기 */}
      <View style={{ height: STATUSBAR_HEIGHT }} />

      {/* 헤더: 취소(뒤로) / 등록 버튼 */}
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
