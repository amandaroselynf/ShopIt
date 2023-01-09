import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import SignupScreen from './screens/SignupScreen'
import ProductDetailScreen from './screens/ProductDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import { HomeTabBar } from './navigation/HomeTabBar';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CartScreen from './screens/CartScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import OrdersScreen from './screens/OrdersScreen';
import { AdminTabBar } from './navigation/AdminTabBar';
import AdminViewProducts from './screens/AdminViewProducts';
import ManageProduct from './screens/ManageProduct';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
const Stack = createNativeStackNavigator();

var userid=""
var email = ""
var fullname = ""
var role = ""

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  switch (routeName) {
    case 'Home':
      return 'Products';
    case 'Products':
      return 'Orders';
    case 'Profile':
      return 'My Profile';
    case 'Cart':
      return 'My Cart';
    case 'ProductDetail':
      return 'Product Detail';
    case 'OrderDetail':
      return 'Order Detail';
  }
}

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeTabBar} options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
            })
          }/>
          <Stack.Screen name="Admin" component={AdminTabBar} options={({ route }) => ({
            headerTitle: "Manage Orders"
            })
          }/>
          <Stack.Screen name="AdminView" component={AdminViewProducts} options={({ route }) => ({
            headerTitle: "View Products"
            })
          }/>
          <Stack.Screen name="ManageProduct" component={ManageProduct} options={({ route }) => ({
            headerTitle: "Manage Product"
            })
          }/>
          {/* <Stack.Screen name="Home" component={HomeTabBar} options={{headerShown: false}} initialParams= {{userID: userid, email: email, fullName: fullname, userRole: role}} /> */}
          <Stack.Screen name="Checkout" component={CheckoutScreen}  />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
            })} />
          <Stack.Screen name="Orders" component={OrdersScreen} options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
            })} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
            })} />
          <Stack.Screen name="Cart" component={CartScreen} options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
            })
          }/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
            })
          }/>
          </Stack.Navigator>
      </NavigationContainer>
  );
}
