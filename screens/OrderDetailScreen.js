import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, ScrollView, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { appStyles } from '../constants/style';
import { DELIVERING, PROCESSING } from '../constants/const';

function OrderDetailScreen ({route, navigation}) {
    const { detail } = route.params
    const [ details, setDetails] = useState([])
    // const { id, userId, etail, address, subtotal, service, delivery, total, paymentType, status, } = detail 
    useEffect(() => {
        setDetails(detail.orderDetail)
    }, [])

    return (
    <View style={styles.container}>
    {(detail.customer !== undefined && detail.email !== undefined) ? 
    <View>
      <View style={styles.UserContainer}>
        {/* {detail.customer !== 'undefined' && <Text style={styles.userLabel}>Username:</Text>} */}
        <Text style={styles.userText}>{detail.customer}</Text>
        <Text style={styles.userText}>{detail.email}</Text>
      </View>
      <View style={styles.LineAbove}></View>
     </View>
    : null}
    {/* <View style={styles.UserContainer}>
      <Text style={styles.userLabel}>Email:</Text>
      {detail.email !== 'undefined' && <Text style={styles.userText}>{detail.email}</Text>}
    </View> */}
    

    <View style={styles.topContainer}>
        <Text style={[ styles.orderStatus, detail.status === PROCESSING ? {color: 'red'} : detail.status === DELIVERING ? {color: 'orange'} : {color: 'green'}]}>{detail.status}</Text>
    {/* (detail.status=== PROCESSING) ? {color: 'red'}: {color: 'white'} */}
        {/* <Text style={[styles.orderStatus, { }]}>{detail.status}</Text> */}
        <Text style={styles.orderDate}>{new Date(detail.createdAt.toDate()).toDateString()}</Text>
    </View>
    <Text style={styles.productsHeader}>Products</Text>
    <View style={{flexDirection: 'column'}}>
        <View>
        <FlatList
            style={styles.productsContainer}
            data={details}
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
                        <View style={styles.priceContainer}>
                            <Text style={styles.subtotalLabel}>Subtotal</Text>
                            <Text style={styles.subtotal}> ${(Math.round((item.price * item.qty)* 100)/100).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            )}
            />
        </View>

        <ScrollView>
            {/* <View style={styles.LineAbove}></View> */}
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Address</Text>
              <Text 
                style={styles.addressInput}>
                {detail.address}
              </Text>
            </View>


            <View style={styles.LineAbove}></View>
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalText}>${Number(detail.subtotal).toFixed(2)}</Text>
            </View>

            <View style={styles.DeliveryContainer}>
              <Text style={styles.deliveryLabel}>Delivery Fee</Text>
              <Text style={styles.deliverText}>${Number(detail.delivery).toFixed(2)}</Text>
            </View>	

            <View style={styles.ServiceContainer}>
              <Text style={styles.serviceLabel}>Service Fee</Text>
              <Text style={styles.serviceText}>${Number(detail.service).toFixed(2)}</Text>
            </View>

            <View style={styles.LineAbove}></View>
            <View style={styles.TotalContainer}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalText}>${Number(detail.total).toFixed(2)}</Text>
            </View>
            <View style={styles.LineAbove}></View>
          
            
        </ScrollView>
        </View>
    </View>
    );
}

const styles = {...appStyles, ...StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#FAFAFA',
    },
    topContainer: {
        flexDirection: 'row',
    },
    userContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
    },
    userLabel: {
      color: '#333'
    },
    userText: {
      flex: 1,
      color: '#333',
    },
    orderStatus: {
        flex: 1,
        fontWeight: 'bold',
    },
    orderDate: {
        flex: 1,
        textAlign: 'right',
        textDecorationLine: 'underline',
    },
    orderSubtotal: {
      marginTop: 10,
    },
    productsContainer: {
      flexDirection: 'column',
      height: '50%',
      borderWidth: 2,  // add border width
      borderColor: '#333',  // add border color
    },  
    productsHeader: {
      fontSize: 20,
      fontWeight: 'bold',
    },  
    orderOthers: {
        justifyContent: 'center',
    },
    addressContainer: {
      marginTop: 5,
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
      fontWeight: 'bold',
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
      padding: 15,
      // borderWidth: 2,
      // borderColor: '#D3D3D3'
    },
    titleContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    priceContainer: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        width: '75%',
        flexDirection: 'row',
    },
    subtotalLabel: {
        flex: 1,
        textAlignVertical: 'center',
        marginEnd: 10,
    },
    subtotal: {
        textAlignVertical: 'center',
        textAlign: 'right',
        fontWeight: 'bold',
    },
    orderPriceLabel: {
      flex: 1,
      marginEnd: 10,
      textAlign: 'right',
    },
    LineBelow: {
      borderBottomWidth: 2,
      marginTop: 5,
      borderBottomColor: '#D3D3D3',
    },
    LineAbove: {
      borderBottomWidth: 2,
      borderBottomColor: '#D3D3D3',
    },
    orderPrice: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      textAlign: 'right',
      fontWeight: 'bold',
    },
    productPrice: {
      fontSize: 14,
      color: '#333',
      fontWeight: 'bold',
      flex: 1,
    },
    productImage: {
      width: "25%",
      height: "95%",
      marginLeft: 3,
      marginTop: 2,
      borderRadius: 15,
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
      borderWidth: 2,
      borderRadius: 15,
      margin: 6,
      borderColor: '#000'
    },
    subtotalContainer: {
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
})
}

export default OrderDetailScreen;