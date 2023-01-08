
import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, TouchableOpacity, View, StyleSheet } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';

function ProductDetailScreen({ route, navigation}) {
    const { product } = route.params;
    const [minQty, setMinQty] = useState(true)
    // const [product, setProduct] = useState({});
    const [qty, setQty] = useState(1);
    // const userId = firebase.auth().currentUser.userId;
    // const orders = firebase.firestore().collection('orders');

    const manageQty = (action) => {
      setQty(qty+action)
      if(qty <= 1) {
        setMinQty(true)
      } else {
        setMinQty(false)
      }
    }

    const handleAdd = async () => {
      await orders.add({
        userId: userId,
        productId: product.id,
        qty: qty,
      })
      .then(() => {
        console.log('Success', 'YES')
      })
    }
      
    return(
        <View style={styles.container}>
            <Text>{product.name}</Text>
            <Text>{product.price}</Text>

            <View style={styles.qtyContainer}>
              <TouchableOpacity 
                style={styles.button}
                disabled={minQty}
                onPress={() => manageQty(-1)}>
                  <Ionicons name="remove-outline" size={15} color="white" />
                </TouchableOpacity>
              <TextInput 
                style={styles.inputQuantity}
                value = {'' + qty}
                onChangeText={(qty) => {
                    setQty(qty)
                    if(Number(qty) <= 1) {
                      setMinQty(true)
                    } else {
                      setMinQty(false)
                    }
                  }
                }/>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => manageQty(1)}>
                <Ionicons name="add-outline" size={15} color="white" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={handleAdd} >
                <Ionicons name="cart-outline" size={15} color="white" />
                <Text style={styles.cartButtonText}> Add To Cart</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flexDirection: 'column',
    flex: 1,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    backgroundColor: '#788eec',
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  cartButton: {
    backgroundColor: '#788eec',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: 'white',
  },
  inputQuantity: {
    flex: 2,
    height: 40,
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    justifyContent: 'center',
  }
});