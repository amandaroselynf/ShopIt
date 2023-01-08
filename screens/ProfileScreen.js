import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TextInput, Button, TouchableOpacity, View, StyleSheet, Animated } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native';
import { firebase } from '../config'
import Icon from 'react-native-vector-icons/Ionicons';
import { appStyles } from '../constants/style';


function ProfileScreen({navigation}) {

    const [user, setUser] = useState('');
    const [fullName, setName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
  
    const db = firebase.firestore();
    const userId = firebase.auth().currentUser.uid;
    const userRef = db.collection('users').doc(userId);
  
    const handleSignOut = () => {
      firebase.auth().signOut().then(()=> {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login'}]
        });
      });
    }
    const onUpdatePress = () => {
      userRef.update
    }
    const handleSubmit = () => {
      userRef.update({fullName, address})
        .then(() => {
          setSuccess('Profile updated successfully');
          setError(null);
        })
        .catch(error => {
          setError(error.message);
          setSuccess(null);
        });
    };
  
    useEffect(() => {
      const fetchUser = async () => {
        userRef
          .get()
          .then(doc => {
            if(doc.exists)  {
              const data = doc.data()
                setUser(data)
                setName(data.fullName)
                setAddress(data.address)
            } else {
              console.log('Error', 'User not found.');
            }
          });
      };
      fetchUser()
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <Text onChangeText={setName}>{fullName}</Text>
        <TextInput
          style={styles.TextInput}
          value={fullName}
          onChangeText={setName}
        />
        <Text style={styles.label}>Address:</Text>
        <Text onChangeText={setAddress}>{address}</Text>
        <TextInput
          style={styles.TextInput}
          value={address}
          onChangeText={setAddress}
        />
        {error && <Text style={styles.error}>Error: {error}</Text>}
        {success && <Text style={styles.success}>Success: {success}</Text>}
        <Button
          title="Update"
          onPress={handleSubmit}
          style={styles.button}
        />
        <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.cartButtonText}> View Orders</Text>
          </TouchableOpacity>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          style={styles.button}
        />
      </View>
    );
  };
  
  export default ProfileScreen;

  const styles = {...appStyles, ...StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    label: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    TextInput: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    button: {
      backgroundColor: '#3f51b5', // Material Design color
      padding: 15,
      borderRadius: 5,
      width: '100%',
      margin: 10,
    },
    error: {
      color: 'red',
    },
    success: {
      color: 'green',
    },
  })
}
