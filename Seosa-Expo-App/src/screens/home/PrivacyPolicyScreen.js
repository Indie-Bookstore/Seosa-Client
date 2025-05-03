import React from 'react';
import { View, StyleSheet, Platform, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Footer from '../../components/common/footer/Footer';
import CloseIcon from '../../icons/close.svg';

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

const PrivacyPolicyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>서사 개인정보 처리방침</Text>
        <View style={{ width: width * 0.067 }} />
      </View>

      {/* 본문 */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.text}>
          서사(이하 "서비스")는 이용자의 개인정보 보호를 중요하게 생각하며, 다음과 같은 정책을 운영합니다.
        </Text>
        <Text style={styles.title}>1. 수집하는 개인정보</Text>
        <Text style={styles.text}>
          서비스는 회원가입 및 서비스 이용 과정에서 다음과 같은 정보를 수집할 수 있습니다.{'\n'}
          - 필수 정보: 닉네임, 이메일 (회원가입 시){'\n'}
          - 자동 수집 정보: 서비스 이용 기록, 기기 정보 (앱 최적화를 위해)
        </Text>
        <Text style={styles.title}>2. 개인정보 이용 목적</Text>
        <Text style={styles.text}>
          수집한 개인정보는 다음의 목적을 위해 사용됩니다.{'\n'}
          - 서비스 운영 및 회원 관리{'\n'}
          - 커뮤니티 기능 제공 (게시글 작성, 댓글 기능 등){'\n'}
          - 서비스 개선 및 오류 분석
        </Text>
        <Text style={styles.title}>3. 개인정보 보관 및 삭제</Text>
        <Text style={styles.text}>
          - 이용자가 회원 탈퇴 시, 모든 개인정보는 즉시 삭제됩니다.{'\n'}
          - 단, 법적 요구가 있을 경우, 일정 기간 보관될 수 있습니다.
        </Text>
        <Text style={styles.title}>4. 개인정보 보호 조치</Text>
        <Text style={styles.text}>
          - 서비스 운영자는 이용자의 개인정보를 안전하게 보호하기 위해 노력합니다.{'\n'}
          - 이용자의 개인정보는 제3자에게 제공되지 않습니다.
        </Text>
        <Text style={styles.title}>5. 이용자의 권리</Text>
        <Text style={styles.text}>
          - 이용자는 언제든지 자신의 개인정보를 수정하거나 삭제 요청할 수 있습니다.{'\n'}
          - 문의 사항은 아래 이메일을 통해 접수할 수 있습니다.
        </Text>
        <Text style={styles.text}>
          {'\n'}📌 본 정책은 2025년 03월 DD일부터 적용됩니다.{'\n'}
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
    fontWeight: "bold",
    color: "#487153",
    fontFamily: "UnBatangBold",
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
    fontWeight: "bold",
    color: "#666666",
    marginTop: 20,
    marginBottom: 8,
    fontFamily: "UnBatangBold",
  },
  text: {
    fontSize: width * 0.038,
    color: "#666666",
    lineHeight: 22,
    marginBottom: 8,
    fontFamily: "UnBatang",
  },
});

export default PrivacyPolicyScreen;
