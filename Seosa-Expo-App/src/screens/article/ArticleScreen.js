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
} from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';

import ArticleHeader from '../../components/article/ArticleHeader';
import ArticleTitle from '../../components/article/ArticleTitle';
import ArticleEditor from '../../components/article/ArticleEditor';
import ArticleItemList from '../../components/article/ArticleItemList';
import ArticleInfo from '../../components/article/ArticleInfo';
import AlbumIcon from '../../icons/album-green.svg';

const { width, height } = Dimensions.get('window');
const DEFAULT_FAB_BOTTOM = height * 0.09;

export default function ArticleScreen({ navigation, route }) {
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios'
      ? Constants.statusBarHeight
      : RNStatusBar.currentHeight || 0;

  const [blocks, setBlocks] = useState([{ type: 'text', value: '' }]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [narratives, setNarratives] = useState([{ title: '', author: '', review: '' }]);
  const [storeInfo, setStoreInfo] = useState({
    address: '',
    detailedAddress: '',
    openDays: '',
    phoneNumber: '',
    instagramLink: '',
  });

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('갤러리 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes:['images'], allowsEditing:false, quality:1 });
    if (result.canceled || !result.assets?.length) return;
    const uri = result.assets[0].uri;
    const insertAt = focusedIndex + 1;
    const newBlocks = [ ...blocks.slice(0, insertAt), { type:'image', value:uri }, { type:'text', value:'' }, ...blocks.slice(insertAt) ];
    setBlocks(newBlocks);
    Keyboard.dismiss();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('mapSelect', (e) => {
      const { address, lat, lng } = e.data;
      setStoreInfo(prev=>({ ...prev, address, coords:{ lat, lng } }));
    });
    return unsubscribe;
  }, [navigation]);

  const onMapPress = () => {
    navigation.navigate('MapPicker', { targetKey: route.key });
  };

  const handleAddNarrative = () => { if(narratives.length<5) setNarratives([...narratives, { title:'',author:'',review:'' }]); };
  const handleChangeItem = (idx,newItem)=>{ const arr=[...narratives]; arr[idx]=newItem; setNarratives(arr); };
  const handleRemoveItem = idx=> setNarratives(narratives.filter((_,i)=>i!==idx));

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?'padding':undefined}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <ArticleHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <ArticleTitle />
        <ArticleEditor blocks={blocks} setBlocks={setBlocks} setFocusedIndex={setFocusedIndex} />
        <ArticleItemList items={narratives} onAdd={handleAddNarrative} onChangeItem={handleChangeItem} onRemoveItem={handleRemoveItem} />
        <ArticleInfo info={storeInfo} onChange={setStoreInfo} onMapPress={onMapPress} />
      </ScrollView>
      <TouchableOpacity style={[styles.fab, { bottom: keyboardHeight>0?keyboardHeight+16:DEFAULT_FAB_BOTTOM }]} onPress={handleAddImage}>
        <AlbumIcon width={28} height={28} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFEFB" },
  scrollContainer: { paddingBottom: 40, alignItems: "center" },
  fab: {
    position: "absolute",
    right: 24,
    backgroundColor: "#E2E7E3",
    borderRadius: 28,
    width: height * 0.06,
    height: height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    zIndex: 30,
    boxShadow:"1px 2px 2.4px 0px rgba(72, 113, 83, 0.55);"
  },
});
