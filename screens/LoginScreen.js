import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { ROLE_ADMIN, ROLE_CUSTOMER } from '../constants/const';
import { appStyles } from '../constants/style';

function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        setEmail("amanda@gmail.com")
        setPassword("12345678")
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
                        if(firestoreDocument.data().role === ROLE_CUSTOMER) {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home'}]
                            });
                            return;
                        }  else if(firestoreDocument.data().role === ROLE_ADMIN) {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Admin'}]
                            });
                            return;
                        } 
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
            <KeyboardAwareScrollView
                style={styles.fieldContainer}
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
        alignItems: 'center',
        flexDirection: 'column',
        padding: 50,
    },
    fieldContainer: {
        width: '100%',
        // padding: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    logo: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        flex: 5,
        alignSelf: "center",
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
