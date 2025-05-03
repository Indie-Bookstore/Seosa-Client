// FAQ List 컴포넌트

import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import ToggleUp from "../../icons/toggle-up.svg";
import ToggleDown from "../../icons/toggle-down.svg";

// faq 임시 더미데이터
const faqData = [
  { id: 1, question: "책방지기인데, 어떻게 인증번호를 받나요?", answer: "카카오톡 채널로 연락주시면 인증번호를 보내드립니다!" },
  { id: 2, question: "책방지기인데, 어떻게 인증번호를 받나요?", answer: "카카오톡 채널로 연락주시면 인증번호를 보내드립니다!" },
  { id: 3, question: "책방지기인데, 어떻게 인증번호를 받나요?", answer: "카카오톡 채널로 연락주시면 인증번호를 보내드립니다!" },
];

const FaqList = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleAnswer = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {faqData.map((faq) => (
        <View key={faq.id} style={styles.faqItem}>
          <View style={styles.question}>
            <Text style={styles.questionText}>{faq.question}</Text>
            <TouchableOpacity onPress={() => toggleAnswer(faq.id)}>
              {openFaq === faq.id ? (
                <ToggleUp width={24} height={24} />
              ) : (
                <ToggleDown width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
          {openFaq === faq.id && (
            <View style={styles.answerBox}>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    alignSelf: "center",
    marginTop: height*0.005,
    marginBottom:height*0.05,
    height:height*0.2
  },
  faqItem: {
    
  },
  question: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop : height*0.02,
    height:height*0.03
  },
  questionText: {
    fontSize: height*0.017,
    fontWeight: "bold",
    color: "#333",
    marginLeft: width*0.01
  },
  answerBox: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 8, // 둥근 테두리
    backgroundColor: "#FFFBEA",
    marginTop:height*0.01,
    minHeight: height*0.04125,
    alignContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
   padding: width*0.02,
   },
  answer: {
    fontSize: height*0.015,
    color: "#666666",
  },
});

export default FaqList;
