import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { appStyles } from '../constants/style';
import { onAuthStateChanged } from '@firebase/auth';
import { doc } from '@firebase/firestore';

function CartScreen({ navigation }) {
    const [carts, setCarts] = useState([])
    // const [products, setProducts] = useState([])
    const cartRef = firebase.firestore().collection('carts');
    const productRef = firebase.firestore().collection('products');
    const userId = firebase.auth().currentUser.uid;

    useEffect (() => {
        fetchCart();
    }, []);


    const onCheckoutPress = () => {
        navigation.navigate('Checkout', {
        cart : carts } )
    } 

    const manageQty= (index, cartId, qty, action) => {
        var newQty = qty
            if(action === 'Add' ) {
                newQty++
            } else
        if(action === 'Remove') {
                if(qty==1) {
            return 
        } 
        newQty--
      } 
      cartRef.doc(cartId).update({
        qty: newQty
      }).catch((e) => {
        alert('Something went wrong please try again later.')
      })
      // .then(() => {
      //   alert('The product has been added to your cart!');
      // });
    } 
    
    const fetchCart = async () => {
      const promises = [];
        cartRef
        .where('userId', '==', userId)
        .onSnapshot(
          querySnapshot => {
            const carts = []
            querySnapshot.forEach((cart) => {
              const { id, productId, qty, userId} = cart.data();
              const promise = productRef.doc(productId).get().then(product => {
                  if(product.exists) {
                    const {name, price, image} = product.data()
                    carts.push({
                      cartId: id,
                      productName: name,
                      price,
                      image,
                      productId: productId, 
                      qty: qty
                    });
                  }
              })
              promises.push(promise)
              
            }) 
            Promise.all(promises).then(() => {
              setCarts(carts);
            });
          }  
          )}

    return (
        <View style={styles.container}>
         {/* <Text style={styles.sectionTitle}>Your Cart</Text> */}
        <FlatList
            style={styles.productsContainer}
            data={carts}
            contentContainerStyle={styles.productItemContainer}
            renderItem={({ item }, index) => (
              <Pressable style={styles.cardContainer}
                onPress={() => navigation.navigate('Detail', {
                  product: item
                })} 
              >
                <View style={styles.innerCardContainer}>

                <View>
                    <Image
                        style={styles.productImage}
                        source={{ uri: item.image }}
                    />
                    <Text style={styles.productTitle}>{item.productName}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>${item.price}</Text>
                    </View>


                    <View style={styles.qtyContainer}>
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => manageQty(index, item.cartId, item.qty, 'Remove' ) }
                    >
                      <Ionicons name="remove-outline" size={15} color="white" />
                    </TouchableOpacity>
                    <TextInput 
                      style={styles.inputQuantity}
                      value={'' + item.qty}
                      keyboardType="numeric"
                      onChangeText={(qty) => {
                        // setQty(qty);
                      }}
                    />
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => manageQty(index, item.cartId, item.qty, 'Add' ) }
                    >
                      <Ionicons name="add-outline" size={15} color="white" />
                    </TouchableOpacity>
                  </View>
                    <TouchableOpacity style={styles.btnRemove} onPress={() => console.log('Remove')}>
                        <Text style={styles.removeText }>Remove</Text>
                    </TouchableOpacity>
                </View>
                </View>
              </Pressable>
            )}
          />

          <TouchableOpacity 
            disabled={(!carts)}
            style={(!carts) ? styles.button : styles.buttonDisabled}
            onPress={onCheckoutPress}>
                <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
    );
}

export default CartScreen;

const styles = {...appStyles, ...StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FAFAFA',
      },
      btnRemove: {
        backgroundColor: 'red',
        padding: 3,
        width: '25%',
        borderRadius: 100,
        borderWidth: 0.5, 
        marginLeft: 185,
        top: 5,
      },
      removeText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
      },
      priceContainer: {
        marginLeft: 0,
      },
      productTitle: {
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold',
        marginLeft: 150,
      },
      productPrice: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        marginLeft: 150,
      },
      productImage: {
        width: 130,
        height: 100,
        borderRadius: 10,
        position: 'relative', 
        borderWidth: 2,  // add border width
        borderColor: '#ccc',  // add border color
      },
      productsContainer: {
        width: '100%',
        height: '85%',
        backgroundColor: '#FAFAFA',
      },
      productItemContainer: {
        justifyContent:'center',
      },    
      qtyContainer: {
        width: 150,
        flexDirection: 'row',
        alignContent: 'center',
        marginHorizontal: 150, 
        flexWrap: 'wrap',
      },
      inputQuantity: {
        flex: 2,
        height: 20,
        backgroundColor: '#FAFAFA',
        textAlign: 'center',
        justifyContent: 'center',
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
        flexDirection: 'column',
      },
      btnCheckout: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
        backgroundColor: '#788eec',
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
      },
      checkoutText: {
        color: 'white',
        fontWeight: 'bold'
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10,
      },
})};

