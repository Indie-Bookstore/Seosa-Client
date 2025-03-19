// password 규칙 노란박스 컴포넌트
import { memo } from 'react';
import { StyleSheet, Dimensions, View, Text } from "react-native";
import CorrectIcon from "../../../icons/correct.svg";
import WrongIcon from "../../../icons/wrong.svg";

const { width, height } = Dimensions.get('window');

const PasswordInfoComponent = ({ 
  isLengthValid, 
  hasLetter, 
  hasNumber 
}) => {
  // 규칙 리스트를 배열로 관리
  const rules = [
    { isValid: isLengthValid, text: "최소 8자 이상" },
    { isValid: hasLetter, text: "최소 1개 이상의 영문자 포함" },
    { isValid: hasNumber, text: "최소 1개 이상의 숫자 포함" }
  ];

  return (
    <View style={styles.infocontainer}>
      {rules.map((rule, index) => (
        <View key={`rule-${index}`} style={styles.rule}>
          {rule.isValid ? (
            <CorrectIcon accessibilityLabel="규칙 충족" />
          ) : (
            <WrongIcon accessibilityLabel="규칙 미충족" />
          )}
          <Text style={styles.text}>{rule.text}</Text>
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
   infocontainer : {
      width : width*0.9,
      height : height*0.10625,
      backgroundColor: "#FFFBEA",
      marginBottom : height*0.01,
      borderRadius :11,
      borderWidth : 1,
      borderColor : "#E1E1E1",
      justifyContent : 'center'
   },
   rule : {
      flexDirection : "row",
      alignItems : "center",
      justifyContent : "flex-start",
      paddingHorizontal : 15,
      paddingVertical : 5
   },
   text : {
      marginLeft : width *0.01
   }
});

export default memo(PasswordInfoComponent);
