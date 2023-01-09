import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ManageOrders from '../screens/ManageOrders';
import AdminViewProducts from '../screens/AdminViewProducts';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

export function AdminTabBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ViewOrders" component={ManageOrders} options={{
        tabBarLabel: 'Orders',
        tabBarIcon: () => (
            <Ionicons name="document-text-outline" size={20} />
        ),
        }}/>
    <Tab.Screen name="ViewProducts" component={AdminViewProducts} options={{
        tabBarLabel: 'Products',
        tabBarIcon: () => (
            <Ionicons name="cart-outline" size={20} />
        )
        }}
      />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarLabel: 'Profile',
        tabBarIcon: () => (
            <Ionicons name="person-outline" size={20} />
        )
        }}
      />
    </Tab.Navigator>
    );
}