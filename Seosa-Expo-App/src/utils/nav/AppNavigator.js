import { createStackNavigator } from '@react-navigation/stack';
import ArticleScreen   from '../../screens/ArticleScreen';   // 경로 확인
import MapPickerScreen from '../../screens/MapPickerScreen';

const Stack = createStackNavigator();

/**
 * 최상위 Stack Navigator
 */
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateArticle" component={ArticleScreen} />
      <Stack.Screen
        name="MapPicker"
        component={MapPickerScreen}
        options={{ title: '지도에서 위치 선택' }}
      />
    </Stack.Navigator>
  );
}
