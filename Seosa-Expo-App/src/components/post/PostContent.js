import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


const PostContent = ({ contents }) => {
  return (
    <View style={styles.container}>
      {contents
        .sort((a, b) => a.order_index - b.order_index)
        .map((item) => {
          if (item.contentType === "sentence") {
            return (
              <Text key={item.contentId} style={styles.textContent}>
                {item.content}
              </Text>
            );
          } else if (item.contentType === "img_url") {
            return (
              <Image
                key={item.contentId}
                source={{ uri: item.content }}
                style={styles.image}
                resizeMode="cover"
              />
            );
          } else {
            return null;
          }
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:width*0.9,
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    marginTop:height*0.05
  },
  textContent: {
    fontSize: height*0.02,
    color: "#333",
    marginBottom: 16,
    lineHeight: 24,
    width : width*0.9
  },
  image: {
    width: width - 32,
    height: 220,
    borderRadius: 12,
    marginBottom: 24,
  },
});

export default PostContent;
