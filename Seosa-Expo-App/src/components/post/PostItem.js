import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import ExamplePhoto from "../../icons/examplephoto.svg";

const { width, height } = Dimensions.get("window");
const ICON_SIZE = height * 0.11;

const PostItem = ({ products = [] }) => {
  // 상품이 없으면 표시하지 않음
  if (!products.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title_text}>서사 모아보기</Text>
      </View>

      {products.map((item, idx) => (
        <React.Fragment key={item.productId ?? idx}>
          
          <View style={styles.item}>
            {item.productImg ? (
              <Image
                source={{ uri: item.productImg }}
                style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: 8 }}
                resizeMode="cover"
              />
            ) : (
              <ExamplePhoto height={ICON_SIZE} width={ICON_SIZE} />
            )}

            <View style={styles.item_content}>
              <View style={styles.item_header}>
                <Text style={styles.item_title}>{item.productName}</Text>
                {item.price ? (
                  <Text
                    style={styles.item_writer}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.price}원
                  </Text>
                ) : null}
              </View>

              {item.description ? (
                <Text style={styles.item_review}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          </View>

          {/* 마지막이 아니면 구분선 */}
          {idx < products.length - 1 && <View style={styles.line} />}
        </React.Fragment>
      ))}
    </View>
  );
};

/* ───── 스타일 (변경 없음) ───── */
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.5575,
    backgroundColor: "#E2E7E3",
    alignItems: "center",
  },
  title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.01,
    justifyContent: "center",
    marginBottom: height * 0.01,
  },
  title_text: {
    fontSize: height * 0.023,
    color: "#666666",
    fontWeight: "500",
    fontFamily: "Noto Sans",
  },
  item: {
    width: width * 0.9,
    height: height * 0.11,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item_content: {
    width: width * 0.6,
    height: height * 0.11,
    justifyContent: "space-between",
  },
  item_header: {
    height: height * 0.05,
    width: width * 0.6,
    justifyContent: "space_between",
    marginTop: height * 0.0075,
  },
  item_title: {
    fontSize: height * 0.02,
    fontWeight: 500,
    marginBottom: height * 0.005,
  },
  item_writer: {
    color: "#888888",
    fontSize: height * 0.015,
  },
  item_review: {
    color: "#888888",
    fontSize: height * 0.017,
  },
  line: {
    width: width * 0.9,
    backgroundColor: "#888888",
    height: height * 0.001,
    marginTop: height * 0.025,
    marginBottom: height * 0.025,
  },
});

export default PostItem;
