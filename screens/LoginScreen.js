import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { appStyles } from '../constants/style';

function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        console.log('a', email || password)
    //  setEmail("amanda@gmail.com")
    //     setPassword("12345678")
    },[])   

    const onSignupNavPress = () => {
        navigation.navigate('SignUp')
    }

    const onLoginPress = async () => {
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
                            alert("User does not exist anymore.")
                            return;
                        }
                        const userData = firestoreDocument.data()
                
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home'}]
                        });
                        // navigation.navigate('Home', {userID: userData.id, userName: userData.fullName, userRole: userData.role})
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
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
                <TouchableOpacity
                    disabled={(!email && !password)}
                    style={(email && password) ? styles.button : styles.buttonDisabled}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onSignupNavPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default LoginScreen;

const styles = {...appStyles, ...StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        position: 'absolute',
        top: 55,
        fontSize: 35,
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
    customButton: {
        marginHorizontal: 20,
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
})}
