// Footer.js

import React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, Text } from "react-native";
import HomaNav from "../../../icons/home.svg";
import BookNav from "../../../icons/book.svg";
import UserNav from "../../../icons/user.svg";

const Footer = ({ navigation }) => {
   const size = Dimensions.get('window').width * 0.067;

   const handleMySpace = () => {
      navigation.navigate('MySpace');
   } 

   const handlePostList = () => {
      navigation.navigate('Post');
   }

   const handleHome = () => {
      navigation.navigate('Home');
   }

   return (
      <View style={styles.container}>
         <View style={styles.navcon}>
            <TouchableOpacity style={styles.btnc} onPress={handleHome}>
               <HomaNav width={size} height={size}/>
               <Text style={styles.des}>홈</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnc} onPress={handlePostList}>
               <BookNav width={size} height={size}/>
               <Text style={styles.des}>글모음</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnc} onPress={handleMySpace}>
               <UserNav width={size} height={size}/>
               <Text style={styles.des}>나의 공간</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
   container : {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: height * 0.07,
      width: width,
      justifyContent: 'center',
      alignContent: 'center',
      borderTopColor: "#E1E1E1",
      borderTopWidth: height * 0.001875,
      backgroundColor: "#FFFFFF",
      zIndex: 10
   },
   navcon : {
      flexDirection: "row",
      width: width,
      justifyContent: "space-around",
      alignItems: "center",
   },
   btnc : {
      width: width * 0.2,
      height: height * 0.0475,
      justifyContent: "center",
      alignItems: "center",
   },
   des : {
      color: "#888888",
      fontSize: height * 0.013,
      marginTop: height * 0.0025,
      marginBottom: height * 0.0025
   }
});

export default Footer;
