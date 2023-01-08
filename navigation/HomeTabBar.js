import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CartScreen from '../screens/CartScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

export function HomeTabBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Products" component={HomeScreen} options={{
        tabBarLabel: 'Home',
        tabBarIcon: () => (
            <Ionicons name="home" size={20} />
        ),
        }}/>
    <Tab.Screen name="Cart" component={CartScreen} options={{
        tabBarLabel: 'Cart',
        tabBarIcon: () => (
            <Ionicons name="cart-outline" size={20} />
        )
        }}
      />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarLabel: 'Profile',
        tabBarIcon: () => (
            <Ionicons name="person" size={20} />
        )
        }}
      />
    </Tab.Navigator>
    );
}