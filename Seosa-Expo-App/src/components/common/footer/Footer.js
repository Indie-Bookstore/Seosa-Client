import React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import HomeNav from '../../../icons/home.svg';
import BookNav from '../../../icons/book.svg';
import UserNav from '../../../icons/user.svg';
import HomeSelNav from '../../../icons/home-selected.svg';
import BookSelNav from '../../../icons/book-selected.svg';
import UserSelNav from '../../../icons/user-selected.svg';

const { width, height } = Dimensions.get('window');
const ICON_SIZE = width * 0.067;

const Footer = ({ navigation }) => {
  const route = useRoute();
  const current = route.name;

  const tabs = [
    { name: 'Home', label: '홈', Icon: HomeNav, SelectedIcon: HomeSelNav, onPress: () => navigation.navigate('Home') },
    { name: 'gallery', label: '글모음', Icon: BookNav, SelectedIcon: BookSelNav, onPress: () => navigation.navigate('gallery') },
    { name: 'MySpace', label: '나의 공간', Icon: UserNav, SelectedIcon: UserSelNav, onPress: () => navigation.navigate('MySpace') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navcon}>
        {tabs.map((tab) => {
          const focused = current === tab.name;
          const TabIcon = focused ? tab.SelectedIcon : tab.Icon;
          const textStyle = focused ? [styles.des, styles.selectedText] : styles.des;
          return (
            <TouchableOpacity key={tab.name} style={styles.btnc} onPress={tab.onPress}>
              <TabIcon width={ICON_SIZE} height={ICON_SIZE} />
              <Text style={textStyle}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: height * 0.07,
    width: width,
    justifyContent: 'center',
    alignContent: 'center',
    borderTopColor: '#E1E1E1',
    borderTopWidth: height * 0.001875,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  navcon: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btnc: {
    width: width * 0.2,
    height: height * 0.0475,
    justifyContent: 'center',
    alignItems: 'center',
  },
  des: {
    color: '#888888',
    fontSize: height * 0.013,
    marginTop: height * 0.0025,
    marginBottom: height * 0.0025,
  },
  selectedText: {
    color: '#487153',
  },
});

export default Footer;
