import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from '@firebase/auth';
import { doc } from '@firebase/firestore';

function CartScreen({ navigation }) {
    const [carts, setCarts] = useState([])
    const [products, setProducts] = useState([])
    const cartRef = firebase.firestore().collection('carts');
    const productRef = firebase.firestore().collection('products');
    const userId = firebase.auth().currentUser.uid;

    useEffect (() => {
        fetchCart();
    }, []);


    const onCheckoutPress = () => {
         navigation.navigate('Checkout', {
	 cart : products } )
    } 

    const fetchProductDetail = ((productId) => {
        productRef.doc(productId).get().then(prod => {
            if(prod.exists)  {
                return new Promise (resolve => {
                    resolve({price, image} = prod.data())
                });
            }
        })
        return new Promise
            ((resolve, reject) => {
                productRef.doc(productId).get().then(prod => {
                if(prod.exists)  {
                    resolve(prod.data())
                }
                else {
                    reject()
                }
            });
        });

    });

    const fetchCart = async () => {
        cartRef
        .where('userId', '==', userId)
        .onSnapshot(
          querySnapshot => {
            const carts = []
            querySnapshot.forEach((doc) => {
                const { id, productId, qty, userId} = doc.data()
                carts.push({
                    id,
                    productId,
                    qty,
                    userId
                })
                 products.push(fetchProductDetail(productId))
            })          
            setCarts(carts) 
            Promise.all(products).then((result) => {
                console.log("NOTF", "s")
                console.log(result.toString(), 'A')
                setProducts(result)
            });
          }
        )
        const products = []
        for(let i = 0; i < carts.length; i++) {
            await fetchProductDetail(carts[i].productId).then((product) => {
                const {name, price, image} = product
                console.log(name, price)
                products.push({
                    id: carts[i].id,
                    name,
                    price,
                    image,
		    productId: carts[i].productId, 
                    qty: carts[i].qty}
                )
                console.log(products[i].name, 'push')
            });
        }
        setProducts(products)
      }

    return (
        <View style={styles.container}>
         <Text style={styles.sectionTitle}>Your Cart</Text>
        <FlatList
            style={styles.productsContainer}
            data={products}
            contentContainerStyle={styles.productItemContainer}
            renderItem={({ item }) => (
              <Pressable style={styles.cardContainer}
                onPress={() => navigation.navigate('Detail', {
                  product: item
                })} 
              >
                <View style={styles.innerCardContainer}>

                <View style={{marginTop: -80}}>
                    <Image
                        style={styles.productImage}
                        source={{ uri: item.image }}
                    />
                    <Text style={styles.productTitle}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>${item.price}</Text>
                    </View>


                    <View style={styles.qtyContainer}>
                    <TouchableOpacity 
                      style={styles.button}
                      // onPress={removeQty}
                    >
                      <Ionicons name="remove-outline" size={15} color="white" />
                    </TouchableOpacity>
                    <TextInput 
                      style={styles.inputQuantity}
                      // value={'' + qty}
                      keyboardType="numeric"
                      onChangeText={(qty) => {
                        // setQty(qty);
                      }}
                    />
                    <TouchableOpacity 
                      style={styles.button}
                      // onPress={addQty}
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

          <TouchableOpacity onPress={() => console.log('Add to cart')}>
                      <View style={{width: 300}}>
                        <Text style={styles.btnCheckout}>Checkout</Text>
                      </View>
                    </TouchableOpacity>
        </View>
    );
}

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
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
        resizeMode: 'cover',
        borderRadius: 10,
        position: 'relative', 
        top: 82,
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
        fontWeight: 'bold',
        backgroundColor: 'green',
        padding: 7,
        textAlign: 'center',
        borderRadius: 4,
        marginLeft: 65,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10,
      },
});

