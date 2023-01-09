import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import { appStyles } from '../constants/style';
import { Picker } from '@react-native-picker/picker';
import { COMPLETED, DELIVERING, PROCESSING, ROLE_ADMIN } from '../constants/const';
import { COLOR_BTN_PRIMARY } from '../constants/colors';

function AdminViewProducts({ navigation }) {
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

  const onCreatePress = () => {
    navigation.navigate('ManageProduct', {
      action: 'Create'
    })
  }

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
          <FlatList
            style={styles.productsContainer}
            data={filteredProducts}
            columnWrapperStyle={styles.productRow}
            numColumns={2}
            renderItem={({ item }) => (
              <Pressable style={styles.cardContainer}
                onPress={() => navigation.navigate('ProductDetail', {
                  product: item,
                  action: ROLE_ADMIN,
                })}
              >
                <View style={styles.innerCardContainer}>
                  <Image
                    style={styles.productImage}
                    source={{ uri: item.image }}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{item.name}</Text>
                    <Text numberOfLines={4} style={styles.productDesc}>{item.desc}</Text>
                    <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    </View>
                </View>
                </View>
              </Pressable>
            )}
          />
            <TouchableOpacity onPress={onCreatePress} style={styles.fab}>
                <Ionicons name='add-outline' style={styles.fabIcon}/>
            </TouchableOpacity>
      </View>
  );
};

const styles = {...appStyles, ...StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
    },
    fab: { 
        position: 'absolute', 
        padding: 10,
        alignItems: 'center', 
        justifyContent: 'center', 
        right: 20, 
        bottom: 20, 
        backgroundColor: COLOR_BTN_PRIMARY, 
        borderRadius: 50, 
        elevation: 5 
    }, 
    fabIcon: { 
        fontSize: 35,
        color: 'white' 
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
    productInfo: {
        flex: 2,
        flexDirection: 'column',
        marginStart: 10,
    },
    productDesc: {
        flex: 1,
        textAlign: 'justify',
    },
    pickerContainer: {
        width: '75%',
        alignSelf: 'flex-end',
        backgroundColor: '#F5F6F7',
        borderRadius: 5,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 6,
        justifyContent: 'center',
        display: 'flex',
    },
    itemStyle: {
        fontSize: 15,
        height: 75,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    picker: {
        flex: 1,
        margin: -12,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    ordersContainer: {
      flexDirection: 'column',
    },  
    ordersItemContainer: {
      justifyContent:'center',
    },
    titleContainer: {
      flexDirection: 'row',
    },
    topContainer: {
        
    },
    orderOthers: {
    },
    orderPaymentType: {
    },
    productTitle: {
      fontSize: 15,
      color: '#333',
      fontWeight: 'bold',
    },
    infoContainer: {
      flexDirection: 'column',
      marginLeft: 5,
      flex: 3,
    },
    
    orderPriceContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    orderPriceLabel: {
      flex: 1,
      marginEnd: 10,
      textAlign: 'right',
    },
    orderPrice: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      textAlign: 'right',
      fontWeight: 'bold',
    },
    orderDate: {
      textAlign: 'right',
    },
    productPrice: {
      fontSize: 14,
      color: '#333',
      fontWeight: 'bold',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    productImage: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
      textAlignVertical: 'center',
      height: undefined,
      aspectRatio: 1,
      resizeMode: 'cover',
      borderRadius: 10,
      borderWidth: 2,  // add border width
      borderColor: '#ccc',  // add border color
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
      flexDirection: 'row',
    },
})
}

export default AdminViewProducts;