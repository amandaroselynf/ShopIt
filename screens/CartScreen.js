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

    const manageQty= (cartId, qty, action) => {
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
        alert(e)
      })
      // .then(() => {
      //   alert('The product has been added to your cart!');
      // });
    } 

    const removeItem = (cartId) => {
      cartRef.doc(cartId).delete({

      }).catch((e) => {
        alert('Something went wrong please try again later.')
      })
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
        {carts.length===0 && <Text style={styles.emptyCart}>Your cart is empty.</Text>}
        <FlatList
            style={styles.productsContainer}
            data={carts}
            contentContainerStyle={styles.productItemContainer}
            renderItem={({ item }, index) => (
              <View style={styles.cardContainer}>
                <View style={styles.innerCardContainer}>
                    <Image
                        style={styles.productImage}
                        source={{ uri: item.image }}
                    />
                    <View style={styles.cartInfo}>
                      <View style={styles.topContainer}>
                          <Text style={styles.productTitle}>{item.productName}</Text>
                          <TouchableOpacity 
                          style={styles.btnRemove}
                          onPress={() => removeItem(item.cartId) }
                        >
                          <Ionicons style={styles.trash} name="trash-outline" size={15} color="white" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.priceContainer}>
                          <Text style={styles.productPrice}>${item.price}</Text>
                      </View>


                      <View style={styles.qtyContainer}>
                        <TouchableOpacity 
                          style={styles.buttonQty}
                          onPress={() => manageQty(item.cartId, item.qty, 'Remove' ) }
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
                          style={styles.buttonQty}
                          onPress={() => manageQty(item.cartId, item.qty, 'Add' ) }
                        >
                          <Ionicons name="add-outline" size={15} color="white" />
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
              </View>
            )}
          />

        <View style={{margin: 10}}>
          <TouchableOpacity 
            disabled={(carts.length===0)}
            style={(carts.length>0) ? styles.button : styles.buttonDisabled}
            onPress={onCheckoutPress}>
                <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
          </View>
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
      emptyCart: {
        padding: 15,
        fontSize: 15,
        alignSelf: 'center',
      },
      topContainer: {
        flexDirection: 'row',
      },
      trash: {
        color: 'blue',
        fontSize: 21,
      },
      btnRemove: {
        padding: 4,
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 0.5, 
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
        textAlignVertical: 'center',
        fontSize: 18,
        flex: 1,
        color: '#333',
        fontWeight: 'bold',
      },
      productPrice: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
      },
      cartInfo: {
        flex: 3,
        marginStart: 5,
        flexDirection: 'column',
      },
      productImage: {
        width: '100%',
        height: undefined,
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10,
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
        flexDirection: 'row',
        alignContent: 'center',
        flexWrap: 'wrap',
        marginVertical: 5,
      },
      inputQuantity: {
        backgroundColor: 'white',
        flex: 8,
        borderRadius: 5,
        marginHorizontal: 5,
        textAlign: 'center',
        justifyContent: 'center',
      },
      buttonQty: {
        flex: 1,
        padding: 10,
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
      btnCheckout: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
        backgroundColor: '#788eec',
        marginTop: 20,
        padding: 20,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
      },
      checkoutText: {
        color: 'white',
        fontWeight: 'bold'
      },
      // sectionTitle: {
      //   fontSize: 24,
      //   fontWeight: 'bold',
      //   textAlign: "center",
      //   marginTop: 20,
      //   marginBottom: 10,
      // },
})};