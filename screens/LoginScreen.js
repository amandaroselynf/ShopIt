import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'

function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    useEffect(() => {
        // const checkLoggedIn = () => {
        //     let currentUser = firebase.auth();
        //     // console.log('checking', currentUser.toJSON)
        //     if(currentUser != null) {
        //         // console.log('checking', currentUser.currentUser.displayName)
        //         navigation.reset({
        //             index: 0,
        //             routes: [{ name: 'Home'}]
        //         });
        //     } else {
        //         navigation.reset({
        //             index: 0,
        //             routes: [{ name: 'Login'}]
        //         });
        //     }
        // }
        // checkLoggedIn()
        setEmail("amanda@gmail.com")
        setPassword("12345678")
    }, []);

    const onSignupNavPress = () => {
        navigation.navigate('SignUp')
    }

    const onLoginPress = async () => {
        if(typeof email === 'string' && email.length === 0) {
            setError('Please enter your email.')
            return
        }
        if(typeof password === 'string' && password.length === 0) {
            setError('Please enter your password.')
            return
        }
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            setError(true)
                            return;
                        }
                        setError(false)
                        const userData = firestoreDocument.data()
                
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home'}]
                        });
                        // navigation.navigate('Home', {userID: userData.id, userName: userData.fullName, userRole: userData.role})
                    })
                    .catch(e => {
                        setError(e.message)
                        // alert(error)
                    });
            })
            .catch(e => {
                setError('Invalid email or password.')
                // alert(error)
            })
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../assets/ShopIt.png')}
            /> 
            <Text style={styles.title}>Welcome to ShopIt</Text>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">

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
                {error && <Text style={styles.error}>{error}</Text>}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onSignupNavPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 30,
    },
    title: {
        position: 'absolute',
        left: 75,
        top: 55,
        fontSize: 35,
        fontFamily: 'Impact',
        fontWeight: 'bold',
        marginBottom: 150,
        textAlign: 'center'
    },
    logo: {
        marginTop: 50,
        flex: 1,
        height: 100,
        width: 150,
        alignSelf: "center",
        margin: -50,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: -0,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
    },
    button: {
        backgroundColor: '#788eec',
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d',
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    }
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
    },

})
