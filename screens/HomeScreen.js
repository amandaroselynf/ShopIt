import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, FlatList, Pressable, TextInput, TouchableOpacity, View, StyleSheet, Animated, ScrollView } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import 'react-native-fonts';
// import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/Ionicons';

function HomeScreen({navigation}) {

  const [products, setProducts] = useState([])
  const productRef = firebase.firestore().collection('products');
  const [searchText, setSearchText] = useState('');
  
  

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

  const [bannerIndex, setBannerIndex] = useState(0);

  const bannerPosition = useRef(new Animated.Value(0)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;

  const filteredProducts = products.filter(product => product.name.includes(searchText));
  
  return (  
    // <ScrollView>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <View style={styles.searchContainer}>
        <Ionicons name="ios-search" size={20} color="#CED0CE" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              onChangeText={text => setSearchText(text)}
              value={searchText}
            />
        </View>
          <FlatList
            style={styles.productsContainer}
            data={filteredProducts}
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
};


const styles = StyleSheet.create({
  container: {
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
  noResultsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  addToCartText: {
    fontSize: 13,
    color: '#0066CC',
    marginTop: 6,
    marginRight: -65,
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
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10,
      },
      productCard: {
        width: 200,
        marginRight: 20,
      },
      productImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,
      },
      productTitle: {
        fontSize: 16,
        
      },
      productPrice: {
        fontSize: 18,
        color: '#000',
        position: 'absolute',
        left: -75,
        top: 0,
      },
      categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      categoryCard: {
        width: '33%',
        alignItems: 'center',
        marginBottom: 20,
      },
      categoryTitle: {
        fontSize: 16,
      },
      categoryImage: {
        width: 100,
        height: 100,
      },
});


export default HomeScreen;
