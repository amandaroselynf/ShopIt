import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox, InteractionManager } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';

function CheckoutScreen({ route, navigate }) {
     const { cart } = route.params
     const [ subtotal, setSubtotal] = useState(0)
     const service = 2
     const [ delivery, setDelivery] = useState(0)
     const [ total, setTotal] = useState(0)

     const userId = firebase.auth().currentUser.uid
     const ordersRef = firebase.firestore().collection('orders')
     
	useEffect(() => {
		var subtotal = 0
		
		for(let item of cart) {
			const { cartId, productName, price, image, productId, qty } = item
			subtotal += (price * qty)
	    } 
		setSubtotal(subtotal)
		setDelivery(generateFees(2, 10)) 
		setTotal(Math.round((subtotal + service + delivery) * 100)/100) 
	}, [] );
	
	const generateFees = (min, max) => {
	    const randomNumber = Math.floor(Math.random() * max) + min
	    return randomNumber;
	} 

	const handleCheckout = async () => {
	   const orders = [] 
	   for(item in cart) {
		const { id, name, image, price, qty } = item
		const order = ({ 
		  	id: cartRef.doc().id,
			userId: userId,
			productId: product.id,
			qty: qty,
		price: price});
		cartRef.add(order) 
     		.then(() => {
		 orders.push(order) 
       		  // alert('The product has been added to your cart!');
     		})
   	     }
           navigation.navigate('OrderDetail', {
		order: orders
}) 
	}
	   
	    
	return (
        <View style={styles.container}>
				<Text style={styles.subtotalLabel}>Subtotal</Text>
				<Text style={styles.subtotalText}>${subtotal}</Text>
				<Text style={styles.deliveryLabel}>Delivery Fee</Text>
				<Text style={styles.deliveryText}>${delivery}</Text>
				<Text style={styles.serviceLabel}>Service Fee</Text>
				<Text style={styles.serviceText}>${service}</Text>
				<Text style={styles.totalLabel}>Total Price</Text>
				<Text style={styles.totalText}>${total}</Text>
			<TouchableOpacity style={styles.button} onPress={handleCheckout}>
				<Text style={styles.purchaseText}>Purchase</Text>
			</TouchableOpacity>
	
		</View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FAFAFA',
      },
});

export default CheckoutScreen;
