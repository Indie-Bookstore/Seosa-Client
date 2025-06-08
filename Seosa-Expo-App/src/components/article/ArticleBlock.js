// components/article/ArticleBlock.js
import React from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';
import CloseIcon from '../../icons/trashcan.svg';

const ArticleBlock = ({
  index,
  type,
  value,
  onChange,
  onFocus,
  onSelectThumbnail,
  onDelete,
  isThumbnail,
}) => {
  if (type === 'text') {
    return (
      <TextInput
        style={styles.textBlock}
        multiline
        placeholder="내용을 입력하세요."
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
      />
    );
  }

  return (
    <View style={styles.imageBlock}>
      <Image source={{ uri: value }} style={styles.image} />

      {/* 삭제 버튼 (왼쪽 상단) */}
      <TouchableOpacity
        style={[styles.iconBtn, styles.deleteBtn]}
        onPress={onDelete}
      >
        <CloseIcon width={16} height={16} />
      </TouchableOpacity>

      {/* 썸네일 지정 버튼 (오른쪽 상단) */}
      <TouchableOpacity
        style={[
          styles.iconBtn,
          styles.thumbnailBtn,
          isThumbnail && styles.thumbnailSelected,
        ]}
        onPress={onSelectThumbnail}
      >
        <Text
          style={[
            styles.thumbnailText,
            isThumbnail && styles.thumbnailTextSelected,
          ]}
        >
          썸네일
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  textBlock: {
    width: '90%',
    minHeight: 100,
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 16,
  },
  imageBlock: {
    width: '90%',
    marginVertical: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: '#DDD',
  },
  // 공통 아이콘 버튼 스타일
  iconBtn: {
    position: 'absolute',
    top: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
    minWidth : height*0.03,
    height : height*0.03,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent:'center'
  },
  deleteBtn: {
    left: 8,
  },
  thumbnailBtn: {
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  // 썸네일로 선택된 경우 배경색
  thumbnailSelected: {
    backgroundColor: '#487153',
  },
  thumbnailText: {
    color: '#487153',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // 썸네일로 선택된 경우 글자색
  thumbnailTextSelected: {
    color: '#FFFFFF',
  },
});

export default ArticleBlock;
