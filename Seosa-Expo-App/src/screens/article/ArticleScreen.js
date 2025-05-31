/* eslint-disable react-hooks/exhaustive-deps */
import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
  Dimensions, TouchableOpacity, Keyboard, StatusBar as RNStatusBar,
  Alert, ActivityIndicator, DeviceEventEmitter,
} from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem  from 'expo-file-system';

import {
  S3_BUCKET, S3_REGION, COGNITO_POOL_ID, S3_PUBLIC_URL,
} from '../../config/aws';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

import ArticleHeader   from '../../components/article/ArticleHeader';
import ArticleTitle    from '../../components/article/ArticleTitle';
import ArticleEditor   from '../../components/article/ArticleEditor';
import ArticleItemList from '../../components/article/ArticleItemList';
import ArticleInfo     from '../../components/article/ArticleInfo';
// import { createPost } from '../../api/postApi';   // 관리자 계정 준비되면 해제
import AlbumIcon       from '../../icons/album-green.svg';

const { width, height } = Dimensions.get('window');
const DEFAULT_FAB_BOTTOM = height * 0.09;
const STATUSBAR_HEIGHT   = Platform.OS === 'ios'
  ? Constants.statusBarHeight
  : RNStatusBar.currentHeight || 0;

/* ---------- S3 Helper ---------- */
const s3 = new S3Client({
  region: S3_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig  : { region: S3_REGION },
    identityPoolId: COGNITO_POOL_ID,
  }),
});
const uploadToS3 = async (uri, key) => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const buffer = Buffer.from(base64, 'base64');
  await s3.send(new PutObjectCommand({
    Bucket     : S3_BUCKET,
    Key        : key,
    Body       : buffer,
    ContentType: 'image/jpeg',   // 필요 시 mime-type 추론
  }));
  return S3_PUBLIC_URL(key);
};

export default function ArticleScreen({ navigation }) {

  /* ---------- state ---------- */
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([{ type:'text', value:'' }]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [narratives, setNarratives] = useState([
    { title:'', price:'', img:'', review:'' },
  ]);

  const [storeInfo, setStoreInfo] = useState({
    postalCode:'', address:'', coords:null,
    openDays:'', phoneNumber:'', instagramLink:'',
  });
  const [detailedAddress, setDetailedAddress] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* ---------- 키보드 높이 ---------- */
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  /* ---------- MapPicker 선택 ---------- */
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('mapSelect', ({ address, coords }) => {
      setStoreInfo(prev => ({ ...prev, address, coords }));
    });
    return () => sub.remove();
  }, []);

  /* ---------- 글 등록 ---------- */
  const handleSubmit = async () => {
    if (!title.trim()) return Alert.alert('제목 필수', '제목을 입력해주세요.');
    setSubmitting(true);

    try {
      /* 1) blocks 이미지 업로드 */
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

      /* 2) narratives 이미지 업로드 */
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

      /* 3) JSON 조립 */
      const thumbnail = uploadedBlocks.find(b => b.type === 'image');
      const postDto = {
        title,
        location    : storeInfo.address,
        thumbnailUrl: thumbnail?.value ?? '',
        bookstoreReqDto: {
          postalCode    : storeInfo.postalCode,
          address       : storeInfo.address,
          detailedAddress,
          openDays      : storeInfo.openDays,
          openHours,
          phoneNumber   : storeInfo.phoneNumber,
          instagramLink : storeInfo.instagramLink,
        },
        contentReqDtoList: uploadedBlocks.map((b,i)=>({
          contentType: b.type === 'text' ? 'sentence' : 'img_url',
          content    : b.value,
          order_index: i,
        })),
        productReqDtoList: uploadedNarratives.map(n=>({
          productName: n.title,
          price      : Number(n.price)||0,
          productImg : n.img,
          description: n.review,
        })),
      };

      console.log('🟢 RequestBody\n', JSON.stringify(postDto, null, 2));

      /* 실제 전송
      await createPost(postDto);
      Alert.alert('등록 완료', '글이 성공적으로 등록되었습니다.', [
        { text:'확인', onPress: () => navigation.goBack() },
      ]);
      */
    } catch (err) {
      console.error(err);
      Alert.alert('등록 실패', err.message ?? '알 수 없는 오류');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- 이미지 삽입 ---------- */
  const pickImageAndInsert = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('권한 필요', '갤러리 접근 권한을 허용해주세요.');

    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes:['images'], quality:1 });
    if (res.canceled) return;

    const uri = res.assets[0].uri;
    const idx = focusedIndex + 1;
    setBlocks(prev => [
      ...prev.slice(0, idx),
      { type:'image', value:uri },
      { type:'text',  value:''  },
      ...prev.slice(idx),
    ]);
    Keyboard.dismiss();
  };

  /* ---------- UI ---------- */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <ArticleHeader onCancel={() => navigation.goBack()} onSubmit={handleSubmit} />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <ArticleTitle value={title} onChangeText={setTitle} />
        <ArticleEditor blocks={blocks} setBlocks={setBlocks} setFocusedIndex={setFocusedIndex} />

        {/* 서사 모아보기 */}
        <ArticleItemList
          items={narratives}
          onAdd={() =>
            narratives.length < 5 &&
            setNarratives([...narratives, { title:'', price:'', img:'', review:'' }])
          }
          onChangeItem={(i,v) => {
            const arr = [...narratives]; arr[i] = v; setNarratives(arr);
          }}
          onRemoveItem={i =>
            setNarratives(narratives.filter((_,idx)=>idx!==i))
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

      {submitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#487153" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#FFFEFB' },
  scrollContainer:{ paddingBottom:40, alignItems:'center' },
  fab:{
    position:'absolute', right:24, backgroundColor:'#E2E7E3',
    borderRadius:28, width:height*0.06, height:height*0.06,
    alignItems:'center', justifyContent:'center',
    shadowColor:'#487153', shadowOffset:{width:1,height:2},
    shadowOpacity:0.55, shadowRadius:2.4, elevation:5,
  },
  loadingOverlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'rgba(0,0,0,0.2)',
    justifyContent:'center', alignItems:'center',
  },
});
