import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

import CameraScreen from './components/CameraScreen';
import ResultsScreen from './components/ResultsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CameraScreen">
        {/* Camera Screen */}
        <Stack.Screen 
          name="CameraScreen" 
          component={CameraScreen} 
          options={{
            title: 'Capture Image', 
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
          }}
        />
        {/* Results Screen */}
        <Stack.Screen 
          name="ResultsScreen" 
          component={ResultsScreen} 
          options={{
            title: 'Detection Results', 
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#2980B9',  // Blue background for header
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    color: '#fff',  // White title text
  },
});
