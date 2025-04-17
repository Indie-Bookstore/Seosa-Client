import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";


const { width, height } = Dimensions.get("window");

const PostTitle = ({ title, date }) => {
  const iconSize = width * 0.067;

  return (
    <View style={styles.titlecontainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
   titlecontainer : {
      width:width,
      backgroundColor: "#487153",
      height:height*0.1775,
      justifyContent:"center",
      alignItems:"center"
   },
   title : {
      color:"white",
      fontSize:height*0.04,
      width:width,
      textAlign:"center",
      marginBottom :height*0.015,
      fontWeight:500,

   },
   date: {
      fontSize:height*0.016,
      color:"white",
      width:width,
      textAlign:"center"
   }
  
});

export default PostTitle;
