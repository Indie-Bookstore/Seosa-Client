// 뒤로가기 버튼 컴포넌트

import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import BackArrow from '../../../icons/back-arrow.svg';
import BackArrowWhite from '../../../icons/back-arrow-white.svg';

const BackButtonComponent = ({ onPress, theme = 'white' }) => {
  const size = Dimensions.get('window').width * 0.067;
  const isGreen = theme === 'green';

  const IconComponent = isGreen ? BackArrowWhite : BackArrow;

  return (
    <TouchableOpacity onPress={onPress} style={{ width: size, height: size }}>
      <IconComponent width={size} height={size} />
    </TouchableOpacity>
  );
};

export default BackButtonComponent;
