import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox'
import { Picker } from '@react-native-picker/picker';
import { appStyles } from '../constants/style';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ROLE_ADMIN } from '../constants/const';
import { COLOR_BTN_PRIMARY, COLOR_BTN_PRIMARY_DISABLED } from '../constants/colors';

import * as ImagePicker from 'expo-image-picker';

function ManageProduct({ route, navigation }) {

     const { product, action } = route.params

     const [ name, setName] = useState(0)
     const [ desc, setDesc] = useState('')
	 const [ price, setPrice ] = useState([])
     const [ image, setImage ] = useState()

	 const productsRef = firebase.firestore().collection('products')
     
	useEffect(() => {
		if(action === "Update") {
            setName(product.name)
            if(product.desc !== 'undefined') {
                setDesc(product.desc)
            }
            setImage(product.image)
            setPrice(product.price)
        }
	}, [] );
	
    const [uploading, setUploading] = useState(false)
    const selectImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

    const uploadImage = async () => {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', image, true);
          xhr.send(null);
        })
        let d = new Date();
        let dformat = `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
        const ref = firebase.storage().ref().child(dformat)
        const snapshot = ref.put(blob)
        snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
          ()=>{
            setUploading(true)
          },
          (error) => {
            setUploading(false)
            console.log(error)
            blob.close()
            return 
          },
          () => {
            snapshot.snapshot.ref.getDownloadURL().then((url) => {
              setUploading(false)
              setImage(url)
              blob.close()
              if(action === "Create"){
                handleCreate(url)
              } else {
                handleUpdate(url)
              }
              return url
            })
          }
          )
      }


    

    const handleCreate = async (url) => {
        // uploadImage((url) =>{
        //     console.log(url)
            productsRef.add({
                name,
                desc,
                price: Number(price),
                image: url,
            }).then(() => {
                navigation.goBack()
            // }).catch()
        });
        
    }

    const handleUpdate = async (url) => {
        // uploadImage((url) =>{
        //     console.log(url)
            const updated = ({
                name,
                desc,
                price: Number(price),
                image: url,
            })
            productsRef.doc(product.id).update(updated).then(() => {
                navigation.navigate("ProductDetail", {
                    product: updated,
                    action: ROLE_ADMIN
                })
            // }).catch()
        });
        
    }
	    
	return (
        <View style={styles.container}>
        <KeyboardAwareScrollView 
            style={{ flex: 1, width: '100%' }}
            keyboardShouldPersistTaps="always"
        >
        <View>
        <View style={styles.imageLayout}>
        <View style={styles.imageContainer}>
            <Image source={{uri: image}} style={styles.productImage}/>
        </View>
            <TouchableOpacity style={[styles.button, {marginTop: 0, borderRadius: 0}]} onPress={selectImage}>
                <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
        </View>
        
            <TextInput
                style={styles.input}
                placeholder='Product Name'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setName(text)}
                value={name}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TextInput
                style={[styles.input, {textAlignVertical: 'top'}]}
                placeholder='Product Description'
                multiline={true}
                numberOfLines={3}
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setDesc(text)}
                value={desc}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder='Product Price'
                keyboardType='decimal-pad'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setPrice(text)}
                value={price.toString()}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            { action === "Create" && 
                <TouchableOpacity 
                    disabled={name.length === 0 || price.length === 0 || typeof image === 'undefined'}
                    style={[(name.length > 0 && price!=0 && typeof image !== 'undefined')? styles.iconButton : styles.iconButtonDisabled, {marginHorizontal: 0}]}
                    onPress={uploadImage}>
                    <Ionicons name="pencil-outline" size={15} color="white" />
                    <Text style={styles.iconButtonText}>Add Product</Text>
                </TouchableOpacity>
            }
            { action === "Update" && 
                <TouchableOpacity 
                    disabled={name.length === 0 || price.length === 0 || typeof image === 'undefined'}
                    style={[(name.length > 0 && price!=0 && typeof image !== 'undefined')? styles.iconButton : styles.iconButtonDisabled, {marginHorizontal: 0}]}
                    onPress={uploadImage}>
                    <Text style={styles.iconButtonText}>Update Product</Text>
                </TouchableOpacity>
            }
            </View>
		</KeyboardAwareScrollView>
        </View>
    );
}

const styles = {...appStyles, ...StyleSheet.create({
	container: {
        backgroundColor: '#FAFAFA',
		padding:15,
		flex: 1,
	},
    productImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        justifyContent: 'center',
        resizeMode: 'cover',
    },
    imageLayout: {
        width: '70%',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    imageContainer: {
        
        borderWidth: 1,
    },
    iconButton: {
        backgroundColor: COLOR_BTN_PRIMARY,
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    iconButtonDisabled: {
        backgroundColor: COLOR_BTN_PRIMARY_DISABLED,
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    iconButtonText: {
        color: 'white',
    },
})};

export default ManageProduct;