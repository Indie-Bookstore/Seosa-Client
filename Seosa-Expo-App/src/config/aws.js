// src/config/aws.js
import Constants from 'expo-constants';

const { extra } = Constants.expoConfig;

// .env 값은 app.config.js → extra 로 전달돼 있음
export const S3_REGION         = extra.s3Region        ?? process.env.EXPO_PUBLIC_S3_REGION;
export const S3_BUCKET         = extra.s3Bucket        ?? process.env.EXPO_PUBLIC_S3_BUCKET;
export const COGNITO_POOL_ID   = extra.cognitoPoolId   ?? process.env.EXPO_PUBLIC_COGNITO_POOL_ID;

export const S3_PUBLIC_URL = (key) =>
  `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
