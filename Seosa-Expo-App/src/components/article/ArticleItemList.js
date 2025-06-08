import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ArticleItem from './ArticleItem';

const { width, height } = Dimensions.get('window');
const ICON_SIZE = height * 0.11;

export default function ArticleItemList({ items, onAdd, onChangeItem, onRemoveItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>서사 모아보기</Text>
        {items.length < 5 && (
          <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
            <Text style={styles.addBtnText}>추가</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.itemlist}>
        {items.map((item, idx) => (
          <View key={idx}>
            <ArticleItem
              item={item}
              onChange={(newItem) => onChangeItem(idx, newItem)}
              onRemove={() => onRemoveItem(idx)}
              iconSize={ICON_SIZE}
            />
            {idx !== items.length - 1 && <View style={styles.line} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, backgroundColor: '#FFFEFB', alignItems: 'center', paddingVertical: height * 0.01 },
  titleRow: {
    width: width * 0.9, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    height: height * 0.06, marginVertical: height * 0.0125,
  },
  titleText: { fontSize: height * 0.023, color: '#666', fontWeight: '500' },
  addBtn: {
    height: height * 0.035, paddingHorizontal: width * 0.03,
    backgroundColor: '#E2E7E3', borderRadius: height * 0.0175,
    justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { fontSize: height * 0.015, color: '#487153' },
  itemlist: { marginBottom: height * 0.05 },
  line: { width: width * 0.9, backgroundColor: '#888', height: StyleSheet.hairlineWidth, marginVertical: height * 0.025 },
});
