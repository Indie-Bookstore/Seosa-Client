import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ProfileIcon from "../../icons/profile.svg";

const { width, height } = Dimensions.get("window");

const PostEditor = () => {

   const ICON_SIZE = height*0.07;

   return (
      <View style={styles.container}>
         <ProfileIcon height={ICON_SIZE} width={ICON_SIZE} />
         <Text style={styles.editor}>에디터</Text>
         <Text style={styles.nickname}>닉네임</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   container : {
      width:width,
      height:height*0.1775,
      backgroundColor:"#E1E1E1",
      justifyContent:"center",
      alignItems:"center"
   },
   editor : {
      fontSize:height*0.015,
      color : "#487153",
      marginTop:height*0.01,
      marginBottom:height*0.005
   },
   nickname : {
      fontSize:height*0.018,
      fontWeight:500
   }
})

export default PostEditor;

