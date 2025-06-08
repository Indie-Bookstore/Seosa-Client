import React from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import Constants from "expo-constants";
import Footer from '../../components/common/footer/Footer';
import CloseIcon from '../../icons/close.svg';

const STATUSBAR_HEIGHT = Constants.statusBarHeight;
const { width, height } = Dimensions.get('window');

const TermsofUseScreen = ({ navigation }) => {
  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <CloseIcon width={width * 0.067} height={width * 0.067} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>서사 이용약관</Text>
        <View style={{ width: width * 0.067 }} />
      </View>

      {/* 본문 */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.text}>
          본 약관은 서사(이하 "서비스")를 이용하는 사용자(이하 "이용자")와 서비스 운영자 간의 권리, 의무 및 책임 사항을 규정합니다.
        </Text>
        <Text style={styles.title}>1. 서비스 개요</Text>
        <Text style={styles.text}>
          - 서사는 독립서점과 책을 좋아하는 사람들이 소통할 수 있는 커뮤니티 서비스입니다.{'\n'}
          - 본 서비스는 사이드 프로젝트로 운영되며, 상업적 목적이 아닌 비영리 목적으로 제공됩니다.
        </Text>
        <Text style={styles.title}>2. 이용자의 책임</Text>
        <Text style={styles.text}>
          - 이용자는 서비스 이용 시 타인의 권리를 침해하지 않으며, 건전한 커뮤니티 문화를 유지해야 합니다.{'\n'}
          - 불법적인 게시물, 타인을 비방하는 콘텐츠는 사전 통보 없이 삭제될 수 있습니다.
        </Text>
        <Text style={styles.title}>3. 콘텐츠 및 저작권</Text>
        <Text style={styles.text}>
          - 이용자가 작성한 게시물(글, 댓글, 이미지 등)의 저작권은 해당 이용자에게 있습니다.{'\n'}
          - 다만, 서비스 운영자는 서비스 품질 개선 및 홍보 목적으로 해당 콘텐츠를 비상업적 목적으로 활용할 수 있습니다.
        </Text>
        <Text style={styles.title}>4. 서비스 운영 및 변경</Text>
        <Text style={styles.text}>
          - 서비스는 운영자의 판단에 따라 변경되거나 종료될 수 있습니다.{'\n'}
          - 운영자는 서비스 이용과 관련된 중요한 사항을 공지사항을 통해 안내할 수 있습니다.
        </Text>
        <Text style={styles.title}>5. 면책 조항</Text>
        <Text style={styles.text}>
          - 본 서비스는 개인 프로젝트로 운영되며, 서비스 중단, 데이터 손실 등의 피해에 대해 법적 책임을 지지 않습니다.{'\n'}
          - 이용자는 자신의 개인정보 보호 및 서비스 이용에 주의해야 합니다.
        </Text>
        <Text style={styles.text}>
          {'\n'}📌 본 약관은 2025년 MM월 DD일부터 적용됩니다.{'\n'}
          📌 문의: contact@example.com
        </Text>
      </ScrollView>

      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFB",
    width: width,
    alignItems:"center"
  },
  header: {
    width: width*0.9,
    height: height * 0.08,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F1EB",
    backgroundColor: "#FFFEFB",
  },
  closeBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: width * 0.055,
    color: "#487153",
    fontFamily: "UnBatang-Bold",
    textAlign: "center",
    marginLeft:width*0.02
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFEFB",
  },
  scrollContent: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.12,
  },
  title: {
    fontSize: width * 0.045,
    color: "#666666",
    marginTop: 20,
    marginBottom: 8,
    fontFamily: "NotoSans-Medium",
  },
  text: {
    fontSize: width * 0.038,
    color: "#666666",
    lineHeight: 22,
    marginBottom: 8,
    fontFamily: "NotoSans-Regular",
  },
});

export default TermsofUseScreen;
