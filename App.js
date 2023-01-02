import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import SignupScreen from './screens/SignupScreen'

// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
const Stack = createNativeStackNavigator();

var userid=""
var email = ""
var fullname = ""
var role = ""

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} initialParams= {{userID: userid, email: email, fullName: fullname, userRole: role}} />
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          {/* <Stack.Screen name="Page2" component={Page2Screen} /> */}
          {/* <Stack.Screen name="Home"
            component={HomeScreen}
            initialParams= {{userID: userid, userName: username}}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
  );
}