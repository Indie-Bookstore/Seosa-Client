import React from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CloseIcon from '../../icons/x.svg';

const { width, height } = Dimensions.get('window');

export default function ArticleItem({ item, onChange, onRemove, iconSize }) {
  /* 이미지 선택 → 로컬 URI를 img 필드에 저장 */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('권한 필요', '갤러리 접근 권한을 허용해주세요');
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });
    if (res.canceled) return;
    onChange({ ...item, img: res.assets[0].uri });
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={pickImage}>
        {item.img ? (
          <Image
            source={{ uri: item.img }}
            style={{ width: iconSize, height: iconSize, borderRadius: 4 }}
          />
        ) : (
          <View style={[styles.placeholder, { width: iconSize, height: iconSize }]}>
            <CloseIcon width={iconSize * 0.6} height={iconSize * 0.6} fill="#ccc" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <TextInput
            style={styles.titleInput}
            value={item.title}
            placeholder="상품 이름"
            onChangeText={text => onChange({ ...item, title: text })}
          />
          <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
            <CloseIcon width={iconSize * 0.3} height={iconSize * 0.3} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.priceInput}
          value={String(item.price)}
          placeholder="가격"
          keyboardType="numeric"
          onChangeText={text => onChange({ ...item, price: text })}
        />

        <TextInput
          style={styles.reviewInput}
          value={item.review}
          placeholder="한줄 설명"
          multiline
          onChangeText={text => onChange({ ...item, review: text })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: width * 0.9,
    paddingVertical: height * 0.015,
    backgroundColor: '#FFFEFB',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  placeholder: {
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  content: { flex: 1, marginLeft: width * 0.03 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  titleInput: {
    flex: 1,
    fontSize: height * 0.02,
    fontWeight: '500',
    color: '#000',
  },
  removeBtn: { marginLeft: width * 0.02 },
  priceInput: {
    fontSize: height * 0.015,
    color: '#888',
    marginBottom: height * 0.005,
  },
  reviewInput: { fontSize: height * 0.017, color: '#888', flexShrink: 1 },
});
