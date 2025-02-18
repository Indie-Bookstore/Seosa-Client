import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import BackArrow from '../../icons/back-arrow.svg';

const BackButtonComponent = ({ onPress }) => {
  const size = Dimensions.get('window').width * 0.067;

  return (
    <TouchableOpacity onPress={onPress} style={{ width: size, height: size }}>
      <BackArrow width={size} height={size} />
    </TouchableOpacity>
  );
};

export default BackButtonComponent;
