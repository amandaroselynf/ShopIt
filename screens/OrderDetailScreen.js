
import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';

function OrderDetailScreen ({route, navigation}) {
    const { detail } = route.params
    // const { id, userId, orderDetail, address, subtotal, service, delivery, total, paymentType, status, } = detail 
    useEffect(() => {
        
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
            style={styles.productsContainer}
            data={detail.orderDetail}
            contentContainerStyle={styles.productItemContainer}
            renderItem={({ item }, index) => (
            //   <Pressable style={styles.cardContainer}
            //     onPress={() => navigation.navigate('Detail', {
            //       product: item
            //     })} 
            //   >
                <View style={styles.innerCardContainer}>

                <View style={{marginTop: -80}}>
                    <Image
                        style={styles.productImage}
                        source={{ uri: item.image }}
                    />
                    <Text style={styles.productTitle}>{item.productName}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>${item.price}</Text>
                    </View>


                    <View style={styles.qtyContainer}>
                    <TextInput 
                      style={styles.inputQuantity}
                      value={'' + item.qty}
                      keyboardType="numeric"
                      onChangeText={(qty) => {
                        // setQty(qty);
                      }}
                    />
                  </View>
                    <TouchableOpacity style={styles.btnRemove} onPress={() => console.log('Remove')}>
                        <Text style={styles.removeText }>Remove</Text>
                    </TouchableOpacity>
                </View>
                </View>
            //   </Pressable>
            )}
          />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    },
});

export default OrderDetailScreen;