/* components/article/ArticleItem.js */
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ExamplePhoto from '../../icons/examplephoto.svg';
import CloseIcon from '../../icons/x.svg';

const { width, height } = Dimensions.get('window');

/**
 * ArticleItem
 * @param {object} item - { title, author, review }
 * @param {function} onChange - 아이템 정보 변경 핸들러
 * @param {function} onRemove - 아이템 삭제 핸들러
 * @param {number} iconSize - 아이콘 크기
 */
const ArticleItem = ({ item, onChange, onRemove, iconSize }) => (
  <View style={styles.item}>
    <ExamplePhoto width={iconSize} height={iconSize} />
    <View style={styles.content}>
      <View style={styles.header}>
        <TextInput
          style={styles.titleInput}
          value={item.title}
          placeholder="상품 소개"
          onChangeText={(text) => onChange({ ...item, title: text })}
        />
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <CloseIcon width={iconSize * 0.3} height={iconSize * 0.3} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.authorInput}
        value={item.author}
        placeholder="지은이"
        onChangeText={(text) => onChange({ ...item, author: text })}
      />
      <TextInput
        style={styles.reviewInput}
        value={item.review}
        placeholder="한줄 설명"
        multiline
        onChangeText={(text) => onChange({ ...item, review: text })}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  item: {
    width: width * 0.9,
    paddingVertical: height * 0.015,
    backgroundColor: '#FFFEFB',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: width * 0.03,
  },
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
  removeBtn: {
    marginLeft: width * 0.02,
  },
  authorInput: {
    fontSize: height * 0.015,
    color: '#888888',
    marginBottom: height * 0.005,
  },
  reviewInput: {
    fontSize: height * 0.017,
    color: '#888888',
    flexShrink: 1,
  },
});

export default ArticleItem;