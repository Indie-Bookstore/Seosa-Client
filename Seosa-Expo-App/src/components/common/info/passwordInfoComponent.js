import { StyleSheet, Dimensions, View, Text } from "react-native";
const { width, height } = Dimensions.get('window');
import CorrectIcon from "../../../icons/correct.svg";
import WrongIcon from "../../../icons/wrong.svg";

const PasswordInfoComponent = ({ 
  isLengthValid, 
  hasLetter, 
  hasNumber 
}) => {
  return (
    <View style={styles.infocontainer}>
      <View style={styles.rule}>
        {isLengthValid ? <CorrectIcon /> : <WrongIcon  />}
        <Text style={styles.text}>최소 8자 이상</Text>
      </View>
      <View style={styles.rule}>
        {hasLetter ? <CorrectIcon /> : <WrongIcon />}
        <Text style={styles.text}>최소 1개 이상의 영문자 포함</Text>
      </View>
      <View style={styles.rule}>
        {hasNumber ? <CorrectIcon /> : <WrongIcon />}
        <Text style={styles.text}>최소 1개 이상의 숫자 포함</Text>
      </View>
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

export default PasswordInfoComponent;