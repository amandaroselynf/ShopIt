
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
                        <View style={styles.subtotalContainer}>
                            <Text style={styles.subtotalLabel}>Subtotal</Text>
                            <Text style={styles.subtotal}>${(Math.round((item.price * item.qty)* 100)/100).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            )}
            />
        </View>
        <ScrollView>
            <Text style={styles.orderDelivery}>${Number(detail.subtotal).toFixed(2)}</Text>
            <Text style={styles.orderDelivery}>${Number(detail.delivery).toFixed(2)}</Text>
            <Text style={styles.orderDelivery}>${Number(detail.service).toFixed(2)}</Text>
            <Text style={styles.orderDelivery}>${Number(detail.total).toFixed(2)}</Text>
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
    orderStatus: {
        flex: 1,
        fontWeight: 'bold',
    },
    orderDate: {
        flex: 1,
        textAlign: 'right',
    },
    productsContainer: {
      flexDirection: 'column',
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
    subtotalContainer: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        width: '50%',
        flexDirection: 'row',
    },
    subtotalLabel: {
        flex: 1,
        marginEnd: 10,
    },
    subtotal: {
        textAlign: 'right',
        fontWeight: 'bold',
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