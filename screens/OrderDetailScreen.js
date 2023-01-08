
import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { appStyles } from '../constants/style';

function OrderDetailScreen ({route, navigation}) {
    const { detail } = route.params
    const [ details, setDetails] = useState([])
    // const { id, userId, etail, address, subtotal, service, delivery, total, paymentType, status, } = detail 
    useEffect(() => {
        setDetails(detail.orderDetail)
        // console.log(JSON.stringify(details))
        
    }, [])

    return (
    <View style={styles.container}>
    <Text style={styles.productsHeader}>Products</Text>
      <FlatList
          style={styles.ordersContainer}
          data={details}
          contentContainerStyle={styles.ordersItemContainer}
          renderItem={({ item }, index) => (
              <View style={styles.innerCardContainer}>
                {/* <View style={styles.imageContainer}> */}
                  <Image
                      style={styles.productImage}
                      source={{ uri: item.productImage }}
                  />
                  {/* </View> */}
                  <View style={styles.infoContainer}>
                    <Text style={styles.productTitle}>{item.productName}</Text>
                  <Text style={styles.productPrice}>${Number(item.price).toFixed(2)} x {item.qty} pc</Text>
                  <Text style={styles.productTitle}>${(Math.round(item.price * item.qty)* 100)/100}</Text>
                </View>
              </View>
          )}
        />
        {/* <Text style={styles.orderDate}>{new Date(item.createdAt.toDate()).toDateString()}</Text>
        {(item.orderDetail.length > 1) && <Text style={styles.orderOthers}>+ {(item.orderDetail.length - 1)} more items</Text>}
                    {/* <Text style={styles.orderQty}>{item.totalQty} items</Text> 
                    <View style={styles.orderPriceContainer}>
                      <Text style={styles.orderPriceLabel}>Total</Text>
                      <Text style={styles.orderPrice}>${item.total}</Text>
                    </View> */}
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
    orderOthers: {
        justifyContent: 'center',
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
      flex: 2,
    },
    titleContainer: {
      flexDirection: 'row',
      flex: 1,
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
      flex: 1,
    },
    productImage: {
      width: "25%",
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
      flex: 1,
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
      flexWrap: 'wrap',
    },
})
}

export default OrderDetailScreen;