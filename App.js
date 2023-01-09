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
import ManageOrders from './screens/ManageOrders';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
const Stack = createNativeStackNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  switch (routeName) {
    case 'Home':
      return 'Products';
    case 'Products':
      return 'Products';
    case 'Profile':
      return 'My Profile';
    case 'Cart':
      return 'My Cart';
    case 'Orders':
      return 'Orders';
    case 'OrderDetail':
      return 'Order Details';
    case 'Checkout':
      return 'Checkout';
    case 'ViewProducts':
      return 'View Products';
    case 'ManageOrders':
      return 'Manage Orders';
    case 'ViewOrders':
      return 'Manage Orders';
  }
}

function getAdminTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Admin';
  switch (routeName) {
    case 'Profile':
      return 'My Profile';
    case 'Orders':
      return 'Orders';
    case 'OrderDetail':
      return 'Order Details';
    case 'ViewProducts':
      return 'View Products';
    case 'ManageOrders':
      return 'Manage Orders';
    case 'ViewOrders':
      return 'Manage Orders';
    case 'AdminView':
      return 'Orders';
    case 'ViewOrders':
      return 'Manage Orders';
    case 'Admin':
      return 'Manage Orders';
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
            headerTitle: getAdminTitle(route)
            })
          }/>
          <Stack.Screen name="ManageOrders" component={ManageOrders} options={() => ({
            headerTitle: "Manage Orders"
            })}/>
           <Stack.Screen name="Products" component={HomeScreen} />
          <Stack.Screen name="AdminView" component={AdminViewProducts} />
          <Stack.Screen name="ManageProduct" component={ManageProduct} options={() => ({
            headerTitle: "Manage Product"
            })}/>
          <Stack.Screen name="Checkout" component={CheckoutScreen}  />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={() => ({
            headerTitle: "Product Detail"
            })} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={() => ({
            headerTitle: "Order Detail"
            })}/>
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}
