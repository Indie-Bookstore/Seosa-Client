import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ExamplePhoto from "../../icons/examplephoto.svg";

const { width, height } = Dimensions.get("window");

const PostItem = () => {
  const ICON_SIZE = height * 0.11;

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title_text}>서사 모아보기</Text>
      </View>

      <View style={styles.item}>
        <ExamplePhoto height={ICON_SIZE} width={ICON_SIZE} />
        <View style={styles.item_content}>
          <View style={styles.item_header}>
            <Text style={styles.item_title}>글 제목</Text>
            <Text style={styles.item_writer}>지은이</Text>
          </View>

          <Text style={styles.item_review}>
            "한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평"
          </Text>
        </View>
      </View>

      <View style={styles.line}></View>

      <View style={styles.item}>
        <ExamplePhoto height={ICON_SIZE} width={ICON_SIZE} />
        <View style={styles.item_content}>
          <View style={styles.item_header}>
            <Text style={styles.item_title}>글 제목</Text>
            <Text style={styles.item_writer}>지은이</Text>
          </View>

          <Text style={styles.item_review}>
            "한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평"
          </Text>
        </View>
      </View>

      <View style={styles.line}></View>

      <View style={styles.item}>
        <ExamplePhoto height={ICON_SIZE} width={ICON_SIZE} />
        <View style={styles.item_content}>
          <View style={styles.item_header}>
            <Text style={styles.item_title}>글 제목</Text>
            <Text style={styles.item_writer}>지은이</Text>
          </View>

          <Text style={styles.item_review}>
            "한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평한줄평"
          </Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.5575,
    backgroundColor: "#E2E7E3",
    alignItems: "center",
  },
  title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.01,
    justifyContent: "center",
    marginBottom:height*0.01
  },
  title_text: {
    fontSize: height * 0.023,
    color: "#666666",
    fontWeight: "500",
    fontFamily: "Noto Sans",
  },
  item: {
    width: width * 0.9,
    height: height * 0.11,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item_content: {
    width: width * 0.6,
    height: height * 0.11,
    justifyContent: "space-between",
  },
  item_header: {
    height: height * 0.05,
    width: width * 0.6,
    justifyContent: "space_between",
    marginTop: height * 0.0075,
  },
  item_title: {
    fontSize: height * 0.02,
    fontWeight: 500,
    marginBottom:height*0.005
  },
  item_writer: {
    color: "#888888",
    fontSize: height * 0.015,
  },
  item_review: {
    color: "#888888",
    fontSize: height * 0.017,
  },
  line : {
   width:width*0.9,
   backgroundColor:"#888888",
   height:height*0.001,
   marginTop:height*0.025,
   marginBottom:height*0.025
  }
});

export default PostItem;
