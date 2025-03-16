import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BubbleComponent = ({ color = '#FFFBEA', children }) => {
  // Dimensions 값 계산
  const { width, height } = Dimensions.get('window');
  const totalWidth = width * 0.65;
  const bubbleHeight = height * 0.0575;
  
  // 스타일 상수
  const tailSize = 10;
  const tailHeight = 15;
  const cornerRadius = 11;
  const leftBottomRadius = 8;
  const pointOffset = 5;
  const borderWidth = 1;
  const borderColor = '#CCCCCC';

  return (
    <View style={[styles.container, { width: totalWidth, height: bubbleHeight }]}>
      {/* 말풍선 SVG */}
      <Svg 
        width={totalWidth + borderWidth * 2} 
        height={bubbleHeight + borderWidth * 2} 
        style={styles.svg}
      >
        <Path
          d={`
            M ${tailSize + cornerRadius} ${borderWidth}
            H ${totalWidth - cornerRadius}
            A ${cornerRadius} ${cornerRadius} 0 0 1 ${totalWidth} ${cornerRadius + borderWidth}
            V ${bubbleHeight - cornerRadius}
            A ${cornerRadius} ${cornerRadius} 0 0 1 ${totalWidth - cornerRadius} ${bubbleHeight}
            H ${tailSize + leftBottomRadius}
            A ${leftBottomRadius} ${leftBottomRadius} 0 0 1 ${tailSize} ${bubbleHeight - leftBottomRadius}
            L ${borderWidth} ${bubbleHeight - pointOffset}
            L ${tailSize} ${bubbleHeight - leftBottomRadius - tailHeight/2}
            V ${cornerRadius + borderWidth}
            A ${cornerRadius} ${cornerRadius} 0 0 1 ${tailSize + cornerRadius} ${borderWidth}
            Z
          `}
          fill={color}
          stroke={borderColor}
          strokeWidth={borderWidth}
        />
      </Svg>
      
      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {children}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  svg: {
    marginLeft: -1,
    marginTop: -1,
  },
  textContainer: {
    position: 'absolute',
    top: 5,
    left: 15,
    right: 10,
    bottom: 5,
    justifyContent: 'center',
  },
  text: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'left',
    lineHeight: 16,
    includeFontPadding: false,
  }
});

export default BubbleComponent;
