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
            })          
            setCarts(carts) 
          }
        )
        const products = []
        for(let i = 0; i < carts.length; i++) {
            await fetchProductDetail(carts[i].productId).then((product) => {
                const {name, price, image} = product
                products.push({
                    cartId: carts[i].id,
                    productName: name,
                    price,
                    image,
		                productId: carts[i].productId, 
                    qty: carts[i].qty}
                )
            });
        }
        setProducts(products)
      }

    return (
        <View style={styles.container}>
        <Text>AAA</Text>
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
                    <Image
                        style={styles.productImage}
                        source={{ uri: item.image }}
                    />
                    <Text style={styles.productTitle}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>${item.price}</Text>
                    </View>
                    <Text style={styles.productPrice}>{item.qty} pc</Text>
                    <TouchableOpacity onPress={() => console.log('Add to cart')}>
                        <Text style={styles.addToCartText }>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
              </Pressable>
            )}
          />
          <TouchableOpacity style={styles.btnCheckout} onPress={onCheckoutPress}>
              <Text style={styles.checkoutText}>Checkout</Text>
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
      productsContainer: {
        width: '100%',
        backgroundColor: '#FAFAFA',
      },
      productItemContainer: {
        justifyContent:'center',
      },    
      cardContainer: {
        width: '97%',
        backgroundColor: "#F8F8F8",
        padding: 15,
        borderRadius: 10,
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
        alignItems: 'center',
        flexDirection: 'column',
      },
});

