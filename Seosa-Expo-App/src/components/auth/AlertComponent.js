// input 컴포넌트 하단 alert 컴포넌트

import { View, Text, Dimensions } from "react-native";

const AlertComponent = ({ description, isError }) => {
  return (
    <View
      style={{
        marginTop: Dimensions.get("window").height * 0.005,
        flexDirection: "row",
        justifyContent: "flex-start",
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.01375,
        marginBottom: Dimensions.get("window").height * 0.01,
      }}
    >
      <Text
        style={{
          color: isError ? "#F04438" : "#2ECC71", // 에러는 빨간색, 성공은 녹색
          fontSize: Dimensions.get("window").height * 0.0125,
          textAlign: "center",
          fontFamily: "NotoSans-Regular",
          fontWeight: "400",
        }}
      >
        {description}
      </Text>
    </View>
  );
};

export default AlertComponent;
