import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from '@firebase/auth';
import { doc } from '@firebase/firestore';

function CartScreen({ navigation }) {
    const [products, setProducts] = useState([])
    const cartRef = firebase.firestore().collection('carts');
    const productRef = firebase.firestore().collection('products');
    const userId = firebase.auth().currentUser.uid;

    useEffect (() => {
        fetchCart();
    }, []);

    const fetchProductDetail = (productId) => {
        productRef.doc(productId).get().then(prod => {
            if(prod.exists)  {
                return new Promise (resolve => {
                    resolve({price, image} = prod.data())
                });
            }
        })
    }
    const fetchCart = async () => {
        cartRef
        .where('userId', '==', userId)
        .onSnapshot(
          querySnapshot => {
            const products = []
            querySnapshot.forEach((doc) => {
                const { id, productId, qty, userId} = doc.data()
                products.push(fetchProductDetail(productId))
                // setProducts(products)
            })           
            Promise.all(products).then((result) => {
                console.log("NOTF", "s")
                console.log(result.toString(), 'A')
                setProducts(result)
            });
          }
        )
      };

    return (
        <View style={styles.container}>
        <Text>AAA</Text>
        <FlatList
            style={styles.productsContainer}
            data={products}
            numColumns={2}
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
                  <TouchableOpacity onPress={() => console.log('Add to cart')}>
                    <Text style={styles.addToCartText }>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </Pressable>
            )}
          />
        </View>
    );
}

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        widght: '100%',
        backgroundColor: '#FAFAFA',
      },
      productsContainer: {
        backgroundColor: '#FAFAFA',
      },
      cardContainer: {
        width: '47%',
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

