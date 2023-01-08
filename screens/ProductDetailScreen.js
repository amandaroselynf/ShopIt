
import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, TouchableOpacity, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from '@firebase/auth';
import { doc } from '@firebase/firestore';

function ProductDetailScreen({ route, navigation}) {
    const { product } = route.params;
    // const [minQty, setMinQty] = useState(true)
    // const [product, setProduct] = useState({});
    const [qty, setQty] = useState(1);
    const [error, setError] = useState(false);
    const userId = firebase.auth().currentUser.uid;
    const cartRef = firebase.firestore().collection('carts');

    const removeQty = () => {
      if(qty <= 1) {
        return
      }
      setQty(qty-1)
    }

    const addQty = () => {
      if(qty < 1) {
        setQty(1)
        setError(false)
        return
      }
      setQty(qty+1)
    }

    const addCart = async () => {
      await cartRef.add({
        id: cartRef.doc().id,
        userId: userId,
        productId: product.id,
        qty: qty,
      })
      .then(() => {
        alert('The product has been added to your cart!');
      })
    }

    const updateExisting = async () => {
      await cartRef.doc(doc.docs[0].id).update({
        qty: qty
      }).then(() => {
        alert('The product has been added to your cart!');
      });
    }

    const handleAdd = async () => {
      if(qty < 1 || typeof qty !== 'number') {
        setError('Please enter a valid quantity.')
        return
      }
      setError(false)
      cartRef.where('productId', '==', product.id).where('userId', '==', userId)
        .get()
        .then(doc => {
          if(doc.empty) {
            addCart()            
          } else {
            updateExisting()
          }
            
            // navigation.navigate('Home', {userID: userData.id, userName: userData.fullName, userRole: userData.role})
      })
      .catch(e => {
          setError(e.message)
          // alert(error)
      });
    }
      
    return(
        <View style={styles.container}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDesc}>{product.desc}</Text>
            <Text  style={styles.productPrice}>{product.price}</Text>

            <View style={styles.qtyContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={removeQty}>
                  <Ionicons name="remove-outline" size={15} color="white" />
                </TouchableOpacity>
              <TextInput 
                style={styles.inputQuantity}
                value = {'' + qty}
                keyboardType= 'numeric'
                onChangeText={(qty) => {
                  setQty(qty)
                  }
                }/>
              <TouchableOpacity 
                style={styles.button}
                onPress={addQty}>
                <Ionicons name="add-outline" size={15} color="white" />
                </TouchableOpacity>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
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
    marginVertical: 10,
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
    marginTop: 10,
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
  },
  error: {
    color: 'red',
    fontWeight: 'bold'
  }
});