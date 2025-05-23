import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import LocationIcon from '../../icons/location.svg';
import ClockIcon from '../../icons/clock.svg';
import PhoneIcon from '../../icons/phone.svg';
import InstaIcon from '../../icons/insta.svg';

const { width, height } = Dimensions.get('window');
const ICON_SIZE = height * 0.02;

export default function ArticleInfo({ info, onChange, onMapPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>서점 정보</Text>
      </View>
      <TouchableOpacity style={styles.map} onPress={onMapPress}>
        {info.address ? (
          <Text style={styles.mapLabel}>{info.address}</Text>
        ) : (
          <Text style={styles.mapPlaceholder}>지도에서 위치 선택</Text>
        )}
      </TouchableOpacity>
      <View style={styles.infoes}>
        <View style={styles.row}>
          <LocationIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="위치 입력"
            value={info.address}
            onChangeText={(text) => onChange({ ...info, address: text })}
          />
        </View>
        <View style={styles.row}>
          <ClockIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="영업일 / 시간 입력"
            value={info.openDays}
            onChangeText={(text) => onChange({ ...info, openDays: text })}
          />
        </View>
        <View style={styles.row}>
          <PhoneIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="전화번호 입력"
            value={info.phoneNumber}
            onChangeText={(text) => onChange({ ...info, phoneNumber: text })}
          />
        </View>
        <View style={styles.row}>
          <InstaIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="링크 입력"
            value={info.instagramLink}
            onChangeText={(text) => onChange({ ...info, instagramLink: text })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: '#FFFEFB',
    alignItems: 'center',
  },
  title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.0125,
    marginBottom: height * 0.015,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: height * 0.023,
    color: '#666666',
    fontWeight: '500',
    fontFamily: 'Noto Sans',
  },
  map: {
    width: width * 0.9,
    height: height * 0.2175,
    backgroundColor: '#B2B2B2',
    marginBottom: height * 0.015,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLabel: {
    fontSize: 14,
    color: '#333',
  },
  mapPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  infoes: {
    marginBottom: height * 0.05,
  },
  row: {
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  input: {
    flex: 1,
    height: height * 0.02,
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
});