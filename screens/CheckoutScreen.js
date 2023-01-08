import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';

import { firebase} from './config'

function CheckoutScreen({ route, navigate }) {
     const { cart } = route.params
     const userId = firebase.auth().currentUser.uid
     const ordersRef = firebase.firestore().collection('orders')
     
	const handleCheckout = async () => {
	    

	} 

}



export default CheckoutScreen;
