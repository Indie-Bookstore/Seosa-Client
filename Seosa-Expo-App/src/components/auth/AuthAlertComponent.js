import { View, Text, Dimensions } from "react-native";

const AuthAlertComponent = ({ description }) => {

  return (
    <View style={{ marginTop: Dimensions.get("window").height * 0.005, flexDirection:"row", justifyContent:"flex-start", width: Dimensions.get('window').width*0.9, height:Dimensions.get('window').height*0.01375}}>
      <Text
        style={{
          color: "#F04438",
          fontSize: Dimensions.get("window").height * 0.0125,
          textAlign: "center",
          fontFamily:"NotoSans-Regular",
          fontWeight:"400"
        }}
      >
        {description}
      </Text>
    </View>
  );
};

export default AuthAlertComponent;
