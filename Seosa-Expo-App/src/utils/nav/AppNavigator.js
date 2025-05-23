// navigation/AppNavigator.js (예시)
import { createStackNavigator } from '@react-navigation/stack';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import MapPickerScreen from '../screens/MapPickerScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateArticle" component={CreateArticleScreen} />
      <Stack.Screen
        name="MapPicker"
        component={MapPickerScreen}
        options={{ title: '지도에서 위치 선택' }}
      />
    </Stack.Navigator>
  );
}
