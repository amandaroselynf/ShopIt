
import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'

function ProductDetailScreen({ route, navigation}) {
    const { product, otherParam } = route.params;

    useEffect(() => {
        const fetchUser = async () => {
          userRef
            .get()
            .then(doc => {
              if(doc.exists)  {
                const data = doc.data()
                  setUser(data)
                  setName(data.fullName)
                  setEmail(data.email)
              } else {
                console.log('Error', 'User not found.');
              }
            });
          // userRef.once('value', snapshot => {
          //   const userData = snapshot.val();
          //   setName(userData.fullname);
          //   setEmail(userData.email);
          // });
        };
        fetchUser()
      }, []);

      
    return(
        <View>
            <Text>{product.name}</Text>
            <Text>{product.price}</Text>
        </View>
    );
}

export default ProductDetailScreen;