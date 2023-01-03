import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, Animated } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native';
import { firebase } from '../config'
import Icon from 'react-native-vector-icons/Ionicons';

function HomeScreen({navigation}) {

  const [bannerIndex, setBannerIndex] = useState(0);

  const bannerPosition = useRef(new Animated.Value(0)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setBannerIndex((prevIndex) => {
        return (prevIndex + 1) % BANNER_IMAGES.length;
      });
    }, 5000); // Update the banner every 5 seconds
  
    return () => clearInterval(bannerInterval);
  }, []);

  useEffect(() => {
    Animated.timing(bannerOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(bannerPosition, {
      toValue: bannerIndex,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [bannerIndex]);

  const bannerTranslateX = bannerPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -800],
  });


    return (
    <ScrollView>
    
      <View style={styles.bannerContainer}>
        <Image
          style={styles.bannerImage}
          source={{ uri: BANNER_IMAGES[bannerIndex] }}
        />
      </View>

      {/* <View style={styles.bannerContainer}>
        <Animated.View style={{ transform: [{ translateX: bannerTranslateX}]}}>
           {BANNER_IMAGES.map((image, index) => (
            <Animated.Image
              key={index}
              style={[styles.bannerImage, { opacity: bannerOpacity }]}
              source={{ uri: image }}
            />
          ))}
        </Animated.View>
      </View> */}
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <ScrollView horizontal>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={{ uri: 'https://picsum.photos/200/200' }}
            />
            <Text style={styles.productTitle}>Product 1</Text>
            <Text style={styles.productPrice}>$50</Text>
          </View>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={{ uri: 'https://picsum.photos/200/200' }}
            />
            <Text style={styles.productTitle}>Product 2</Text>
            <Text style={styles.productPrice}>$100</Text>
          </View>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={{ uri: 'https://picsum.photos/200/200' }}
            />
            <Text style={styles.productTitle}>Product 3</Text>
            <Text style={styles.productPrice}>$25</Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Top Categories</Text>
        <View style={styles.categoryGrid}>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Category 1</Text>
            <Image
              style={styles.categoryImage}
              source={{ uri: 'https://picsum.photos/200/200' }}
            />
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Category 2</Text>
            <Image
              style={styles.categoryImage}
              source={{ uri: 'https://picsum.photos/200/200' }}
            />
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Category 3</Text>
            <Image
              style={styles.categoryImage}
              source={{ uri: 'https://picsum.photos/200/200' }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
    );
};


const BANNER_IMAGES = [
  'https://picsum.photos/800/400',
  'https://picsum.photos/800/401',
  'https://picsum.photos/800/402',
];

const styles = {
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
        width: 200,
        height: 200,
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