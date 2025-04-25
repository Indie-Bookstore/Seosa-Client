// 서점 정보 컴포넌트

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LocationIcon from "../../icons/location.svg";
import ClockIcon from "../../icons/clock.svg";
import PhoneIcon from "../../icons/phone.svg";
import InstaIcon from "../../icons/insta.svg";

const { width, height } = Dimensions.get("window");

const ICON_SIZE = height * 0.02;

const PostInfo = ({ info }) => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title_text}>서점 정보</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.map}></View>

        <View style={styles.row}>
          <LocationIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>{info.address} {info.detailedAddress}</Text>
        </View>

        <View style={styles.row}>
          <ClockIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>{info.openDays} / {info.openHours}</Text>
        </View>

        <View style={styles.row}>
          <PhoneIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>{info.phoneNumber}</Text>
        </View>

        <View style={styles.row}>
          <InstaIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.link}>인스타그램: {info.instagramLink}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.505,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
  },
  title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.01,
    justifyContent:"center"
  },
  title_text: {
    fontSize: height * 0.023,
    color: "#666666",
    fontWeight: "500",
    fontFamily: "Noto Sans",
  },
  map: {
    width: width * 0.9,
    backgroundColor: "#B2B2B2",
    height: height * 0.2175,
    marginBottom:height*0.02
  },
  content: {
    width: width * 0.9,
    marginTop: height * 0.01,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height*0.015,
  },
  text: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 6,
  },
  link: {
    fontSize: 14,
    color: "#3f729b",
    marginLeft: 6,
  },
});

export default PostInfo;
