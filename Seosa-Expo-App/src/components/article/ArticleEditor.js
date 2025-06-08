// components/article/ArticleEditor.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ArticleBlock from './ArticleBlock';

const ArticleEditor = ({ blocks, setBlocks, setFocusedIndex }) => {
  // 블록 업데이트
  const updateBlock = (idx, newValue) => {
    const arr = [...blocks];
    arr[idx] = { ...arr[idx], value: newValue };
    setBlocks(arr);
  };

  // 블록 삭제 (이미지 삭제 시 뒤 텍스트 블록이 비어 있으면 함께 삭제)
  const deleteBlock = idx => {
    const arr = [...blocks];
    arr.splice(idx, 1);
    if (arr[idx] && arr[idx].type === 'text' && arr[idx].value === '') {
      arr.splice(idx, 1);
    }
    setBlocks(arr);
  };

  // 썸네일 선택 상태
  const [thumbnailIndex, setThumbnailIndex] = useState(null);
  const selectThumbnail = idx => {
    setThumbnailIndex(idx);
  };

  return (
    <View style={styles.editor}>
      {blocks.map((block, idx) => (
        <ArticleBlock
          key={idx}
          index={idx}
          type={block.type}
          value={block.value}
          isThumbnail={idx === thumbnailIndex}
          onChange={val => updateBlock(idx, val)}
          onFocus={() => setFocusedIndex(idx)}
          onSelectThumbnail={() => selectThumbnail(idx)}
          onDelete={() => deleteBlock(idx)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  editor: {
    width: '100%',
    alignItems: 'center',
  },
});

export default ArticleEditor;
