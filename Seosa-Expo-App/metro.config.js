// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // SVG transformer를 babel 단계에 연결
  config.transformer.babelTransformerPath =
    require.resolve('react-native-svg-transformer');

  // .svg를 assetExts에서 제거하고 sourceExts에 추가
  const { assetExts, sourceExts } = config.resolver;
  config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
  config.resolver.sourceExts = [...sourceExts, 'svg'];

  return config;
})();
