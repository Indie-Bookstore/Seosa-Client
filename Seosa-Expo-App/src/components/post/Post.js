import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.date
 * @param {string} props.nickname
 * @param {object|number|null} [props.image] - ImageSourcePropType 또는 null
 * @param {() => void} [props.onPress]
 */
const Post = ({
  title = "",
  date = "",
  nickname = "",
  image = null,
  onPress = () => {},
}) => {
  const hasImage = !!image;
  const cardHeight = hasImage ? width * 0.9 : width * 0.3;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.card, { height: cardHeight }]}>
        {hasImage ? (
          <ImageBackground
            source={image}
            style={[styles.image, { height: cardHeight }]}
            imageStyle={styles.imageBorder}
          >
            <LinearGradient
              colors={[
                "rgba(0, 0, 0, 0)",
                "rgba(0, 0, 0, 0.22)",
                "rgba(0, 0, 0, 0.73)",
              ]}
              locations={[0, 0.8, 1]}
              style={styles.gradientOverlay}
            />
            <View
              style={[
                styles.overlay,
                { height: Math.min(height * 0.125, cardHeight) },
              ]}
            >
              <Text style={styles.meta}>
                {nickname} {date}
              </Text>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.noImageContainer, { height: cardHeight }]}>
            <View style={styles.textOnlyBox}>
              <Text style={styles.metaNoImage}>
                {nickname} {date}
              </Text>
              <Text style={styles.titleNoImage} numberOfLines={2}>
                {title}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
  },
  image: {
    width: width * 0.9,
    justifyContent: "flex-end",
  },
  imageBorder: {
    borderRadius: 18,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 18,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: width * 0.03,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: "center",
  },
  meta: {
    color: "#E6E6E6",
    fontSize: height * 0.02,
    fontFamily: "NotoSansRegular",
    marginBottom: height * 0.01,
  },
  title: {
    color: "white",
    fontSize: height * 0.025,
    fontFamily: "NotoSansBold",
  },
  noImageContainer: {
    width: width * 0.9,
    borderRadius: 18,
    backgroundColor: "#FFFBEA",
    borderWidth: 1,
    borderColor: "#E5DDBE",
    justifyContent: "center",
  },
  textOnlyBox: {
    paddingHorizontal: width * 0.03,
  },
  metaNoImage: {
    color: "#487153",
    fontSize: height * 0.018,
    fontFamily: "NotoSansRegular",
    marginBottom: height * 0.006,
  },
  titleNoImage: {
    color: "#2B2B2B",
    fontSize: height * 0.024,
    fontFamily: "NotoSansBold",
  },
});

export default Post;
