import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox, InteractionManager } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox'
import { Picker } from '@react-native-picker/picker';
import { appStyles } from '../constants/style';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PROCESSING } from '../constants/const';

function CheckoutScreen({ route, navigation }) {

     const { cart } = route.params
     const [ subtotal, setSubtotal] = useState(0)
     const service = 2
     const [ delivery, setDelivery] = useState(0)
     const [ total, setTotal] = useState(0)
	 const [ details, setDetails ] = useState([])
	 const [address, setAddress] = useState('');
	 const [error, setError] = useState('');
	 const [saveAddress, setSaveAddress] = useState(false);
	 const [cardNumber, setCardNumber] = useState();
	 const [cardExp, setCardExp] = useState();
	 const [cardCVV, setCardCVV] = useState();

	 const [selectedPayment, setSelectedPayment] = useState('CASH');

     const userId = firebase.auth().currentUser.uid
	 const userRef = firebase.firestore().collection('users')
     const ordersRef = firebase.firestore().collection('orders')
     const cartRef = firebase.firestore().collection('carts')	 
     
	useEffect(() => {
		var subtotal = 0
		
		fetchAddress()

		for(let item of cart) {
			const { cartId, productName, price, image, productId, qty } = item
			subtotal += (price * qty)
	    } 
		setSubtotal(subtotal)
		setDelivery(generateFees(2, 10)) 
		setTotal(Math.round((subtotal + service + delivery) * 100)/100) 
	}, [] );
	
	const fetchAddress = async () => {
		userRef.doc(userId)
			.get()
			.then(doc => {
			if(doc.exists)  {
				const data = doc.data()
				if(data.address !== 'string' && data.address.length == 0) {
					return
				} else {
					setAddress(data.address.toString())
				}
			} else {
				console.log('Error', 'User not found.');
			}
			});
	}

	const generateFees = (min, max) => {
	    const randomNumber = Math.floor(Math.random() * max) + min
	    return randomNumber;
	} 

	const handleCheckout = async () => {
		if(address !== 'string' && address.length === 0) {
			setError('Please enter your address.')
			return
		}
		const promises = [];
		const addressPromise = [];
		const details = [];
		for(let item of cart) {
			const { cartId, productName, image, price, productId, qty } = item
			details.push({
				productId: productId,
				productName: productName,
				productImage: image,
				qty: qty,
				price: price,
				status: PROCESSING
			})
		} 
	   	// creating order
	   	const doc = ordersRef.doc()
		const data = {
			// id: doc.id,
			userId: userId,
			orderDetail: details,
			address: address,
			subtotal: subtotal,
			service: service,
			delivery: delivery,
			total: total,
			paymentType: selectedPayment,
			status: PROCESSING,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		}
		ordersRef.add(data)
		.then((docRef) => {
			if(saveAddress) {
				const addressPromiseUpdate = userRef.doc(userId)
				.update({
					address: address,
				})
				addressPromise.push(addressPromiseUpdate)
			} else {
				addressPromise.push(Promise.resolve(true))
			}
			for(let item of cart) {
				const { cartId } = item
				const promise = cartRef.doc(cartId).delete()
				promises.push(promise)
			}
			Promise.all([promises, addressPromise]).then(() => {
				docRef.get().then((doc) => {
					data.createdAt = doc.data().createdAt
					navigation.reset({
						index: 0,
						routes: [{ name: 'Home'}]
					});
					navigation.navigate('OrderDetail', {
						detail: data
					});
				})
				
			})
		}).catch((e) => {
			alert(e.message)
		})
	}
	   
	    
	return (
        <KeyboardAwareScrollView 
			style={[ styles.container,{ flex: 1, width: '100%' }]}
			keyboardShouldPersistTaps="always"
		>
			<Text style={styles.paymentLabel}>Payment Options</Text>
			<View style={Platform.OS === 'ios'? styles.iosPicker : styles.picker}>
				<Picker
					selectedValue={selectedPayment}
					mode="dropdown"
					onValueChange={(itemValue, itemIndex) =>
						setSelectedPayment(itemValue)
					}>
					<Picker.Item label="Cash" value="CASH" />
					<Picker.Item label="Card" value="CARD" />
				</Picker>
			</View>
			{selectedPayment==='CARD' && (
				<View style={styles.paymentContainer}>
					<TextInput
						style={styles.input}
						placeholder='Card Number'
						value={cardNumber}
						onChangeText={setCardNumber}
					/>
					<View style={{flexDirection: 'row'}}>
						<TextInput
							style={[styles.input, styles.flex]}
							placeholder='Exp'
							value={cardExp}
							onChangeText={setCardExp}
						/>
						<TextInput
							style={[styles.input, styles.flex]}
							keyboardType='numeric'
							placeholder='CVV'
							value={cardCVV}
							onChangeText={setCardCVV}
						/>
					</View>
				</View>
			)}
			
			<View style={styles.addressContainer}>
			<Text style={styles.addressLabel}>Address</Text>
			<TextInput
				style={styles.addressInput}
				value={address}
				onChangeText={setAddress}
				multiline={true}
				numberOfLines={3}
				placeholder='Please enter your address.'
			/>
			<View style={styles.checkboxContainer}>
				<CheckBox
					value={saveAddress}
					onValueChange={setSaveAddress}
					style={styles.checkbox}
					/>
				<Text style={styles.label}> Would you like to save this address for next time?</Text>
			</View>
			</View>
			<View style={styles.LineAbove}></View>
			<View style={styles.SubtotalContainer}>
				<Text style={styles.subtotalLabel}>Subtotal</Text>
				<Text style={styles.subtotalText}>${subtotal.toFixed(2)}</Text>
			</View>

			<View style={styles.DeliveryContainer}>
				<Text style={styles.deliveryLabel}>Delivery Fee</Text>
				<Text style={styles.deliveryText}>${delivery.toFixed(2)}</Text>
			</View>	

			<View style={styles.ServiceContainer}>
				<Text style={styles.serviceLabel}>Service Fee</Text>
				<Text style={styles.serviceText}>${service.toFixed(2)}</Text>
			</View>
			<View style={styles.LineAbove}></View>
			<View style={styles.TotalContainer}>
				<Text style={styles.totalLabel}>Total Price</Text>
				<Text style={styles.totalText}>${total.toFixed(2)}</Text>
				{error && <Text style={styles.error}>{error}</Text>}
			</View>
			<View style={styles.LineAbove}></View>
			<TouchableOpacity 
				disabled={!address && (selectedPayment === 'CARD' && (!cardNumber && !cardExp && !cardCVV))}
				style={[(address && ((selectedPayment === 'CARD' && (cardNumber && cardExp && cardCVV))) || (selectedPayment === 'CASH'))? styles.button : styles.buttonDisabled, {marginHorizontal: 0}]}
				onPress={handleCheckout}>
				<Text style={styles.buttonText}>Purchase</Text>
			</TouchableOpacity>
	
		</KeyboardAwareScrollView>
    );
}

const styles = {...appStyles, ...StyleSheet.create({
	container: {
        backgroundColor: '#FAFAFA',
		padding:15,
		flex: 1,
	},
	paymentContainer: {
		margin: 5,
		padding: 5,
		backgroundColor: "#AAAAAA",
		borderRadius: 5,
	},
	picker:{
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 10,
		marginTop: 10,
	},
	paymentLabel: {
		fontSize: 16,
	},
	checkboxContainer: {
		padding: 5,
		flexDirection: "row",
		marginBottom: 5,
	},
	checkbox: {
		width: 20,
	},
	flex: {
		flex: 1,
	},
	addressContainer: {
	},
	addressInput: {
		textAlignVertical: 'top',
		padding: 10,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginVertical:5,
	},
	addressLabel: {
		fontSize: 18,
		marginTop: 10,
		fontWeight: 'bold'
	},
	LineAbove: {
		borderBottomWidth: 2,
		borderBottomColor: '#D3D3D3',
	},
	SubtotalContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
	},
	subtotalLabel: {
		fontSize: 16,
		color: '#333'
	  },
	subtotalText: {
		fontSize: 16,
		color: '#333',
	  },
	DeliveryContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 5,
	},
	deliveryLabel: {
		color: '#333'
	},
	deliveryText: {
		color: '#333',
	},
	ServiceContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 5,
	},
	serviceLabel: {
		color: '#333'
	},
	serviceText: {
		color: '#333',
	},
	TotalContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10
	},
	totalLabel: {
		fontSize: 18,
		color: '#333',
		fontWeight: 'bold'
	},
	totalText: {
		fontSize: 18,
		color: '#333',
		fontWeight: 'bold'
	},
	LineBelow: {
		borderBottomWidth: 2,
		marginTop: 5,
		borderBottomColor: '#D3D3D3',
	},
	error: {
		fontSize: 16,
		color: 'red',
	},
})};

export default CheckoutScreen;