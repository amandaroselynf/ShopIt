import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { appStyles } from '../constants/style';
import { Picker } from '@react-native-picker/picker';
import { COMPLETED, DELIVERING, PROCESSING } from '../constants/const';

function ManageOrders({ navigation }) {
  const [ orders, setOrders] = useState([]) 

  const ordersRef = firebase.firestore().collection('orders')
  const usersRef = firebase.firestore().collection('users')
  
	useEffect(() => {
	  fetchOrders()
	}, [] );

  const updateStatus = (orderId, status) => {
      ordersRef.doc(orderId).update({
        status: status  
      }).catch((e)=> {
          alert('Something went wrong please try again later.')
      })
  }

	const fetchOrders = async () => {
    const promises = []
	  await ordersRef
    .orderBy('createdAt', 'desc')
		.onSnapshot(
      querySnapshot => {
        const orders = []
        querySnapshot.forEach((doc) => {
          const { userId, orderDetail, address, subtotal, service, delivery, total, paymentType, status, createdAt} = doc.data()
          var totalQty = 0
          for(let detail of orderDetail) {
            totalQty+=detail.qty
          }
          const promise = usersRef.doc(userId).get().then((userDoc) => {
              const userData = userDoc.data()
              orders.push({
                  id: doc.id,
                  customer: userData.fullName,
                  email: userData.email,
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
          promises.push(promise)
        });
        Promise.all(promises).then(() => {
            setOrders(orders)
        })
  });
} 
	   
  return (
    <View style={styles.container}>
      <FlatList
          style={styles.ordersContainer}
          data={orders}
          contentContainerStyle={styles.ordersItemContainer}
          renderItem={({ item }, index) => (
            <View>
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
                        <Text style={styles.productTitle}>{item.customer}</Text>
                        <Text style={styles.orderDate}>{new Date(item.createdAt.toDate()).toDateString()}</Text>
                      </View>
                        <Text style={styles.orderOthers}>{(item.orderDetail.length)} Products ({item.totalQty} Total Qty)</Text>
                      </View>
                    <View style={styles.orderPriceContainer}>
                      <Text style={styles.orderPaymentType}>{item.paymentType}</Text>
                      <Text style={styles.orderPriceLabel}>Total</Text>
                      <Text style={styles.orderPrice}>${item.total}</Text>
                    </View>
                    <TouchableWithoutFeedback style={{flex: 1}}>
                        <View style={styles.pickerContainer}>
                            <Picker
                                style={styles.picker}
                                selectedValue={item.status}
                                mode="dropdown"     
                                itemStyle={styles.itemStyle}           
                                onValueChange={(itemValue, itemIndex) => 
                                    updateStatus(item.id, itemValue)
                                }>
                                    <Picker.Item label="Process" value={PROCESSING} />
                                    <Picker.Item label="Deliver" value={DELIVERING} />
                                    <Picker.Item label="Complete" value={COMPLETED} />
                                </Picker>
                            </View>
                    </TouchableWithoutFeedback>
                </View>
              </View>
              
            
              </Pressable>
              
          </View>
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
    pickerContainer: {
        width: '75%',
        alignSelf: 'flex-end',
        backgroundColor: '#F5F6F7',
        borderRadius: 5,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 6,
        justifyContent: 'center',
        display: 'flex',
    },
    itemStyle: {
        fontSize: 15,
        height: 75,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    picker: {
        flex: 1,
        margin: -12,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        elevation: 2,
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
      flex: 1,
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
      justifyContent: 'center',
      alignSelf: 'center',
      textAlignVertical: 'center',
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

export default ManageOrders;