import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';

import { firebase } from './config'

function OrdersScreen({ route, navigate }) {
     const { cart } = route.params
     const [ orders, setOrders] = useState([]) 

     const userId = firebase.auth().currentUser.uid
     const ordersRef = firebase.firestore().collection('orders')
     
	useEffect(() => {
	   
	}, [] );

	const fetchOrders = async () => {
	   const orders = [] 
	   ordersRef.
		where('userId', '==', userId)
		.onSnapshot(
      querySnapshot => {
        const orders = []
        querySnapshot.forEach((doc) => {
		    const { id, productId, productName, qty, price, subtotal, service, delivery, total} = doc.data()
          orders.push({
          id,
          productId,
          productName, 
          qty,
          price, 
          subtotal, 
          service, 
          delivery, 
          total,
        });
      });
    setOrders(orders) 
  });
} 
	   
  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FAFAFA',
      },
});

export default OrdersScreen;
