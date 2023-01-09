import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, FlatList, Pressable, TextInput, TouchableOpacity, View, StyleSheet, Animated, ScrollView } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import 'react-native-fonts';
// import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { ROLE_CUSTOMER } from '../constants/const';
// import Icon from 'react-native-vector-icons/Ionicons';

function HomeScreen({navigation}) {

  const [products, setProducts] = useState([])
  const productRef = firebase.firestore().collection('products');
  const [searchText, setSearchText] = useState('');
  const userId = firebase.auth().currentUser.uid;
  const cartRef = firebase.firestore().collection('carts');
  
  
  useEffect(() => {
    const fetchProducts = async () => {
      productRef
      .onSnapshot(
        querySnapshot => {
          const products = []
          querySnapshot.forEach((doc) => {
            const { name, desc, price, image} = doc.data()
            products.push({
              id: doc.id,
              name,
	      desc, 
              price,
              image
            })
          })
          setProducts(products)
        }
      )
    };

    fetchProducts();

  }, [])

  const addCart = async () => {
    const docId = cartRef.doc()
    await docId.set({
      id: docId.id,
      userId: userId,
      productId: product.id,
      qty: qty,
    })
    .then(() => {
      alert('The product has been added to your cart!');
    })
  }

  const updateExisting = async (qty) => {
    await cartRef.doc(doc.docs[0].id).update({
      qty: (qty+1)
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
          updateExisting(doc.docs[0].data().qty)
        }
          
          // navigation.navigate('Home', {userID: userData.id, userName: userData.fullName, userRole: userData.role})
    })
    .catch(e => {
        setError(e.message)
        // alert(error)
    });
  }

  const [bannerIndex, setBannerIndex] = useState(0);

  const bannerPosition = useRef(new Animated.Value(0)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
  
  return (  
    // <ScrollView>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="ios-search" size={20} color="#CED0CE" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                onChangeText={text => setSearchText(text)}
                value={searchText}
              />
          </View>
          {filteredProducts.length===0 && <Text style={styles.emptyResult}>No products found.</Text>}
          <FlatList
            style={styles.productsContainer}
            data={filteredProducts}
            columnWrapperStyle={styles.productRow}
            numColumns={2}
            renderItem={({ item }) => (
              <Pressable style={styles.cardContainer}
                onPress={() => navigation.navigate('ProductDetail', {
                  product: item,
                  action: ROLE_CUSTOMER
                })}
              >
                <View style={styles.innerCardContainer}>
                  <Image
                    style={styles.productImage}
                    source={{ uri: item.image }}
                  />
                <Text style={styles.productTitle}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
                {/* <View style={styles.priceContainer}> */}
                  {/* <TouchableOpacity 
                    onPress={handleAdd}>
                    <Text style={styles.addToCartText }>Add to Cart</Text>
                  </TouchableOpacity> */}
                {/* </View> */}
                </View>
              </Pressable>
            )}
          />
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  productsContainer: {
    backgroundColor: '#FAFAFA',
  },
  productRow: {
    flex: 1,
    justifyContent: "space-around",
  },
  cardContainer: {
    maxWidth: '47.5%',
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
  emptyResult: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    margin: 7,
    borderWidth: 0.5,
  },
  searchInput: {
    flex: 1,
    padding: 7,
    fontSize: 16,
  },
  searchIcon: {
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});


export default HomeScreen;
