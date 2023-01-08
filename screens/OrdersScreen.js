import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { appStyles } from '../constants/style';


function OrdersScreen({ navigation }) {
     const [ orders, setOrders] = useState([]) 

     const userId = firebase.auth().currentUser.uid
     const ordersRef = firebase.firestore().collection('orders')
     
	useEffect(() => {
	  fetchOrders()
	}, [] );

	const fetchOrders = async () => {
	  const orders = [] 
	  await ordersRef
		.where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
		.onSnapshot(
      querySnapshot => {
        const orders = []
        querySnapshot.forEach((doc) => {
          const { id, orderDetail, address, subtotal, service, delivery, total, paymentType, status, createdAt} = doc.data()
          var totalQty = 0
          for(let detail of orderDetail) {
            totalQty+=detail.qty
          }
            orders.push({
              id,
              orderDetail,
              address,
              subtotal, 
              service,
              delivery,
              total,
              status,
              paymentType,
              createdAt,
              totalQty
            });
        });
      setOrders(orders) 
  });
} 
	   
  return (
    <View style={styles.container}>
      <FlatList
          style={styles.ordersContainer}
          data={orders}
          contentContainerStyle={styles.ordersItemContainer}
          renderItem={({ item }, index) => (
            <Pressable style={styles.cardContainer}
              onPress={() => navigation.navigate('OrderDetail', {
                detail: item
              })} 
            >
              <View style={styles.innerCardContainer}>
                {/* <View style={styles.imageContainer}> */}
                  <Image
                      style={styles.productImage}
                      source={{ uri: item.orderDetail[0].productImage }}
                  />
                  {/* </View> */}
                  
                  <View style={styles.infoContainer}>
                    <View style={styles.topContainer}>
                      <View style={styles.titleContainer}>
                        <Text style={styles.productTitle}>{item.orderDetail[0].productName}</Text>
                        <Text style={styles.orderDate}>{new Date(item.createdAt.toDate()).toDateString()}</Text>
                      </View>
                        {(item.orderDetail.length > 1) && <Text style={styles.orderOthers}>+ {(item.orderDetail.length - 1)} more items</Text>}
                      </View>
                    {/* <Text style={styles.orderQty}>{item.totalQty} items</Text> */}
                    <View style={styles.orderPriceContainer}>
                      <Text style={styles.orderPaymentType}>{item.paymentType}</Text>
                      <Text style={styles.orderPriceLabel}>Total</Text>
                      <Text style={styles.orderPrice}>${item.total}</Text>
                    </View>
                </View>
              </View>
          </Pressable>
          )}
        />
    </View>
  );
}

const styles = {...appStyles, ...StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
    },
    ordersContainer: {
      flexDirection: 'column',
    },  
    ordersItemContainer: {
      justifyContent:'center',
    },
    titleContainer: {
      flexDirection: 'row',
    },
    topContainer: {
      flex: 1,
    },
    orderOthers: {
    },
    orderPaymentType: {
    },
    productTitle: {
      fontSize: 15,
      flex: 1,
      color: '#333',
      fontWeight: 'bold',
    },
    infoContainer: {
      flexDirection: 'column',
      marginLeft: 5,
      flex: 3,
    },
    
    orderPriceContainer: {
      flexDirection: 'row',
    },
    orderPriceLabel: {
      flex: 1,
      marginEnd: 10,
      textAlign: 'right',
    },
    orderPrice: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      textAlign: 'right',
      fontWeight: 'bold',
    },
    orderDate: {
      textAlign: 'right',
    },
    productPrice: {
      fontSize: 14,
      color: '#333',
      fontWeight: 'bold',
      marginLeft: 150,
    },
    productImage: {
      flex: 1,
      height: undefined,
      aspectRatio: 1,
      resizeMode: 'cover',
      borderRadius: 10,
      borderWidth: 2,  // add border width
      borderColor: '#ccc',  // add border color
    },
    button: {
      flex: 1,
      backgroundColor: '#788eec',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContainer: {
      width: '97%',
      backgroundColor: "#F8F8F8",
      padding: 15,
      borderRadius: 15,
      margin: 5,
      borderWidth: 2,
      borderColor: '#000',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
    },
    innerCardContainer: {
      // alignItems: 'center',
      flexDirection: 'row',
    },
})
}

export default OrdersScreen;
