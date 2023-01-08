import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ManageOrders from '../screens/ManageOrders';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

export function AdminTabBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ManageOrders" component={ManageOrders} options={{
        tabBarLabel: 'Orders',
        tabBarIcon: () => (
            <Ionicons name="home" size={20} />
        ),
        }}/>
    {/* <Tab.Screen name="Cart" component={CartScreen} options={{
        tabBarLabel: 'Cart',
        tabBarIcon: () => (
            <Ionicons name="cart-outline" size={20} />
        )
        }}
      /> */}
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