import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'

function HomeScreen({navigation}) {
    return (
        <View>
            <Text>Welcome Home</Text>
        </View>
    );
}

export default HomeScreen;