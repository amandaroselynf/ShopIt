import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { ROLE_CUSTOMER } from '../constants/const';

export default function SignupScreen({navigation}) {

    const role = ROLE_CUSTOMER
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const onLoginNavPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = async () => {
        if (typeof email === 'string' &&  email.length === 0) {
            setError("Please enter an email.")
            return
        }
        if(typeof password === 'string' && password.length === 0) {
            setError("Please enter a password.")
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.")
            return
        }
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const data = {
                    id: uid,
                    email,
                    fullName,
                    role: role
                };
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                    
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home'}]
                        });
                        navigation.navigate('Home', {userID: uid, userName: fullName, userRole: role})
                    })
                    .catch((error) => {
                        setError(error)
                    });
            })
            .catch((error) => {
                setError(error)
        });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            keyboardShouldPersistTaps="always">
                {/* <Image
                    style={styles.logo}
                    source={require('../assets/apulogo.png')}
                /> */}
                <TextInput
                style={styles.input}
                placeholder='Full Name'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setFullName(text)}
                value={fullName}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                />
                <TextInput
                style={styles.input}
                placeholder='E-mail'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                />
                <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder='Password'
                onChangeText={(text) => setPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                />
                <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder='Confirm Password'
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                />
                {error && <Text style={styles.error}>Error: {error}</Text>}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onLoginNavPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        marginTop: 30,
      },
      logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
      },
      input: {
        height: 50,
        width: '100%',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      button: {
        backgroundColor: '#333',
        width: '80%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
      },
      buttonTitle: {
        color: '#FFF',
        fontSize: 20,
      },
      footerView: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
      },
      footerText: {
        fontSize: 16,
      },
      footerLink: {
        color: '#333',
        fontWeight: 'bold',
      },
      error: {
        color: 'red',
      }
})