import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import SignupScreen from './screens/SignupScreen'
import ProductDetailScreen from './screens/ProductDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import { HomeTabBar } from './navigation/HomeTabBar';

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
          <Stack.Screen name="Home" component={HomeTabBar} options={{title:'Products'}} initialParams= {{userID: userid, email: email, fullName: fullname, userRole: role}} />
          <Stack.Screen name="Detail" component={ProductDetailScreen}  />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{title:'Profile'}}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}