import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkerPage from './app/WorkerPage';
import ServicePage from './app/ServicePage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WorkerPage">
        <Stack.Screen name="WorkerPage" component={WorkerPage} />
        <Stack.Screen name="ServicePage" component={ServicePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
