import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TextInput, Button, TouchableOpacity, View, StyleSheet, Animated } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native';
import { firebase } from '../config'
import Icon from 'react-native-vector-icons/Ionicons';

function ProfileScreen({navigation}) {

    const [user, setUser] = useState('');
    const [fullname, setName] = useState('');
    const [email, setEmail] = useState('');
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
    // const onUpdatePress = () => {
    //   userRef.update
    // }
    // const handleSubmit = () => {
    //   userRef.update({fullname, email})
    //     .then(() => {
    //       setSuccess('Profile updated successfully');
    //       setError(null);
    //     })
    //     .catch(error => {
    //       setError(error.message);
    //       setSuccess(null);
    //     });
    // };
  
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

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <Text onChangeText={setName}>{fullname}</Text>
        {/* <TextInput
          style={styles.TextInput}
          value={fullname}
          onChangeText={setName}
        /> */}
        <Text style={styles.label}>Email:</Text>
        <Text onChangeText={setEmail}>{email}</Text>
        {/* <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        /> */}
        {/* {error && <Text style={styles.error}>Error: {error}</Text>}
        {success && <Text style={styles.success}>Success: {success}</Text>}
        <Button title="Update" onPress={onUpdatePress} /> */}
        <Button title="Sign Out" onPress={handleSignOut} /> 
      </View>
    );
  };
  
  export default ProfileScreen;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 20,
      marginBottom: 10,
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      padding: 10,
    },
    error: {
      color: 'red',
    },
    success: {
      color: 'green',
    },
  });
