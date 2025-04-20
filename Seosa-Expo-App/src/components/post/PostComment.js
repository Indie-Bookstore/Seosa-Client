import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from "react-native";
import BookmarkIcon from "../../icons/bookmark_green.svg";
import UploadIcon from "../../icons/upload.svg";
import CommentIcon from "../../icons/comment_green.svg";
import ProfileIcon from "../../icons/profile.svg";

const { width, height } = Dimensions.get("window");

const PostComment = () => {

   const ICON_SIZE = width*0.067;
   const PROFILE_SIZE = width*0.08;

   return (
      <View style={styles.container}>
         <View style={styles.comment_header}>

            <View style={styles.comment_count}>
               <CommentIcon height={ICON_SIZE} width={ICON_SIZE} />
               <Text style={styles.count}>2</Text>
            </View>
            
            <View style={styles.interaction}>
               <TouchableOpacity>
                  <BookmarkIcon height={ICON_SIZE} width={ICON_SIZE} />
               </TouchableOpacity>
               <TouchableOpacity>
                  <UploadIcon height={ICON_SIZE} width={ICON_SIZE} />
               </TouchableOpacity>
            </View>
            
         </View>

         <View style={styles.comment_title}>
            <Text style={styles.title_text}>방문 후기</Text>
            <Text style={styles.title_count}>2</Text>
         </View>

         <View style={styles.comment_input}>
            <ProfileIcon height={PROFILE_SIZE} width={PROFILE_SIZE}/>
            <TextInput style={styles.input} placeholder="방문후기를 입력하세요."/>
         </View>

         <View style={styles.line}></View>

         <View style={styles.comment}>
            <ProfileIcon height={PROFILE_SIZE} width={PROFILE_SIZE} />
            <View style={styles.commentContent}>
               <View style={styles.comment_up}>
                  <Text style={styles.nickname}>닉네임</Text>
                  <Text style={styles.date}>2025.04.09. 23:59</Text>
               </View>
               
               <Text style={styles.commentText}>댓글내용댓글내용. 댓글내용? 댓글내용.</Text>
            </View>
         </View>

         <View style={styles.line}></View>

         <View style={styles.comment}>
            <ProfileIcon height={PROFILE_SIZE} width={PROFILE_SIZE} />
            <View style={styles.commentContent}>
               <View style={styles.comment_up}>
                  <Text style={styles.nickname}>닉네임</Text>
                  <Text style={styles.date}>2025.04.09. 23:59</Text>
               </View>
               
               <Text style={styles.commentText}>댓글내용댓글내용. 댓글내용? 댓글내용.</Text>
            </View>
         </View>

      </View>
   )
}

const styles = StyleSheet.create({
   container : {
      width:width,
      alignItems:"center"
   },
   comment_header : {
      height:height*0.03,
      width:width*0.9,
      flexDirection:"row",
      marginTop:height*0.025,
      justifyContent:"space-between"
   },
   comment_count : {
      flexDirection:"row",
      alignItems:"center"
   },
   count : {
      color:"#487153"
   },
   interaction : {
      flexDirection:"row",
      width:width/7,
      justifyContent:"space-between"
   },
   comment_title: {
      width: width * 0.9,
      height: height * 0.06,
      marginTop: height * 0.025,
      marginBottom:height*0.01,
      flexDirection:"row"
    },
    title_text: {
      fontSize: height * 0.023,
      color: "#666666",
      fontWeight: "500",
      fontFamily: "Noto Sans",
      marginRight:width*0.02
    },
    title_count : {
      fontSize: height * 0.023,
      color: "#9EB3A4",
      fontWeight: "500",
      fontFamily: "Noto Sans",
    },
    comment_input : {
      flexDirection:"row",
      justifyContent:"space-between",
      width:width*0.9,
      alignItems:"center"
    },
    input : {
      width:width*0.8,
      height:height*0.045,
      borderColor : "#E1E1E1",
      borderWidth:height*0.002,
      borderRadius:5,
      padding:10
    },
    line : {
      width:width*0.9,
      backgroundColor:"#E1E1E1",
      height:height*0.001,
      marginTop:height*0.025,
      marginBottom:height*0.025
     },
     comment: {
      flexDirection: "row",
      alignItems: "flex-start",
      width: width * 0.9,
    },
    
    commentContent: {
      marginLeft: width * 0.03,
      flex: 1,
    },
    comment_up : {
      height:width*0.08
    },
    
    commentHeader: {
      flexDirection: "column",  
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    
    nickname: {
      fontSize: height * 0.018,
      fontWeight: "500",
      color: "#000000",
    },
    
    date: {
      fontSize: height * 0.014,
      color: "#999999",
      marginTop: 5, 
    },
    
    commentText: {
      fontSize: height * 0.018,
      color: "#333333",
      lineHeight: height * 0.025,
      marginTop:height*0.01
    },
    
});

export default PostComment;
