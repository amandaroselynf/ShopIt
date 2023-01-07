import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, FlatList, Pressable, TextInput, TouchableOpacity, View, StyleSheet, Animated } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native';
import { firebase } from '../config'
// import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons';

function HomeScreen({navigation}) {

  const [products, setProducts] = useState([])
  const productRef = firebase.firestore().collection('products');

  useEffect(() => {
    const fetchProducts = async () => {
      productRef
      .onSnapshot(
        querySnapshot => {
          const products = []
          querySnapshot.forEach((doc) => {
            const { name, price, image} = doc.data()
            products.push({
              id: doc.id,
              name,
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

  // function displayImage(imageRef) {
  //     imageRef.getDownloadURL().then(function(url) {
  //         setImageUrl.push(url);
  //     // TODO: Display the image on the UI
  //     }).catch(function(error) {
  //     // Handle any errors
  //     });
  // }
  // //

  const [bannerIndex, setBannerIndex] = useState(0);

  const bannerPosition = useRef(new Animated.Value(0)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;


  // useEffect(() => {
  //   const bannerInterval = setInterval(() => {
  //     setBannerIndex((prevIndex) => {
  //       return (prevIndex + 1) % BANNER_IMAGES.length;
  //     });
  //   }, 5000); // Update the banner every 5 seconds
  
  //   return () => clearInterval(bannerInterval);
  // }, []);

  // useEffect(() => {
  //   Animated.timing(bannerOpacity, {
  //     toValue: 1,
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();

  //   Animated.timing(bannerPosition, {
  //     toValue: bannerIndex,
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [bannerIndex]);

  // const bannerTranslateX = bannerPosition.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, -800],
  // });
  return (  
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <View style={styles.productsContainer}>
      <FlatList
        data = {products}
        numColumns={2}
        renderItem={({item}) => (
          <Pressable style={styles.cardContainer}
          onPress={() => navigation.navigate('Detail', {
            product: item
          })}>
            <View style={styles.innerCardContainer}>
              <Image
                style={styles.productImage}
                source={{ uri: item.image }}
              />
              <Text style={styles.productTitle}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
          </Pressable>
        )} />
      </View>
    </View>
  );
};


const BANNER_IMAGES = [
  'https://picsum.photos/800/400',
  'https://picsum.photos/800/401',
  'https://picsum.photos/800/402',
];

const styles = {
  container: {
    backgroundColor: '#FAFAFA',
  },
  productsContainer: {
    backgroundColor: '#FAFAFA',
    flex: 1, 
    height: '100%', 
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContainer: {
    width: '40%',
    backgroundColor: "#e5e5e5",
    padding: 15,
    borderRadius: 10,
    margin: 5,
  },
  innerCardContainer: {
    // alignItems: 'center',
    // flexDirection: 'column',
  },

    bannerContainer: {
        height: 400,
    },
    bannerImage: {
        flex: 1,
        width: null,
        height: null,
      },
      sectionContainer: {
        margin: 20,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      productCard: {
        width: 200,
        marginRight: 20,
      },
      productImage: {
        width: 100,
        height: 100,
      },
      productTitle: {
        fontSize: 16,
      },
      productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f00',
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
}


export default HomeScreen;
