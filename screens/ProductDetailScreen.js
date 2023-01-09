import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Alert, Button, TouchableOpacity,KeyboardAvoidingView, View, StyleSheet, Dimensions } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from '@firebase/auth';
import { doc } from '@firebase/firestore';
import { ROLE_ADMIN, ROLE_CUSTOMER } from '../constants/const';


function ProductDetailScreen({ route, navigation}) {
    const { product, action } = route.params;
    // const [minQty, setMinQty] = useState(true)
    // const [product, setProduct] = useState({});
    const [qty, setQty] = useState(1);
    const [error, setError] = useState(false);
    const userId = firebase.auth().currentUser.uid;
    const cartRef = firebase.firestore().collection('carts');
    const productsRef = firebase.firestore().collection('products');

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
      const docId = cartRef.doc()
      await docId.set({
        id: docId.id,
        userId: userId,
        productId: product.id,
        qty: qty,
      })
      .then(() => {
        Alert.alert('Success','The product has been added to your cart!');
      })
    }

    const updateExisting = async (docId) => {
      await cartRef.doc(docId).update({
        qty: qty
      }).then(() => {
        Alert.alert('Success','The quantity of the product in the cart has been updated!');
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
            updateExisting(doc.docs[0].id)
          }
            
            // navigation.navigate('Home', {userID: userData.id, userName: userData.fullName, userRole: userData.role})
      })
      .catch(e => {
          setError(e.message)
          // alert(error)
      });
    }

    const onUpdatePress= () => {
      navigation.navigate('ManageProduct', {
        product: product,
        action: "Update"
      })
    }

    const handleDelete = async () => {
      await productsRef.doc(product.id).delete().then(() => {
        navigation.goBack()
      }).catch((e) => {
        console.log(e)
          alert("Something went wrong please try again later.")
      })
  }
      
    return(
      <KeyboardAwareScrollView 
        style={{ flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
          <Image
              style={styles.productImage}
              source={{ uri: product.image }}
            />
            <View style={{flexDirection: 'row'}}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${Number(product.price).toFixed(2)}</Text>
          </View>
          <Text style={styles.productDesc}>{product.desc}</Text>

          
          { action === ROLE_CUSTOMER && 
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
        }
          {error && <Text style={styles.error}>{error}</Text>}
          { action === ROLE_CUSTOMER && 
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleAdd} >
              <Ionicons name="cart-outline" size={15} color="white" />
              <Text style={styles.iconButtonText}> Add To Cart</Text>
          </TouchableOpacity>
          }
          { action === ROLE_ADMIN &&  (
            <View>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={onUpdatePress} >
                  <Ionicons name="pencil-outline" size={15} color="white" />
                  <Text style={styles.iconButtonText}> Update Product</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={handleDelete}>
                <Ionicons name="trash-outline" size={15} color="white" />
                <Text style={styles.iconButtonText}> Delete Product</Text>
            </TouchableOpacity>
          </View>)
        }
          
        </KeyboardAwareScrollView>

  );
}

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flexDirection: 'column',
    // flex: 1,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  productImage: {
    width: '60%',
    height: undefined,
    alignSelf: 'center',
    aspectRatio: 1,
    resizeMode: 'cover',
    margin: 5,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 2,  // add border width
    borderColor: '#ccc',  // add border color
  },
  productName:{
    fontWeight: 'bold',
    textAlignVertical: 'center',
    justifyContent: 'center',
    flex: 3,
    fontSize: 28
  },
  productDesc:{
    marginTop: 10
  },
  productPrice:{
    color:'green',
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
    // flexWrap: 'wrap',
    right: 0,
  },
  button: {
    flex: 1,
    backgroundColor: '#788eec',
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  iconButton: {
    backgroundColor: '#788eec',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconButtonText: {
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