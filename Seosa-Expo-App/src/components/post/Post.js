import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Post = ({ title, date, nickname, image, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
    <View style={styles.card}>
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        {/* 그라데이션 오버레이 */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.22)', 'rgba(0, 0, 0, 0.73)']}
          locations={[0, 0.8, 1]}
          style={styles.gradientOverlay}
        />
        <View style={styles.overlay}>
          <Text style={styles.meta}>
            {nickname} {date}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </ImageBackground>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: width * 0.9,
  },
  image: {
    width: width * 0.9,
    height: width * 0.9,
    justifyContent: 'flex-end',
  },
  imageBorder: {
    borderRadius: 18,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 18,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: width * 0.03,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    height: height * 0.125,
    justifyContent: 'center',
  },
  meta: {
    color: '#E6E6E6',
    fontSize: height * 0.02,
    marginBottom: height * 0.01,
  },
  title: {
    color: 'white',
    fontSize: height * 0.025,
    fontWeight: 'bold',
  },
});

export default Post;
