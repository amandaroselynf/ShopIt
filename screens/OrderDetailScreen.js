
import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable, View, StyleSheet, LogBox } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config'
import { Ionicons } from '@expo/vector-icons';

function OrderDetailScreen ({route, navigation}) {
    const { detail } = route.params
    
    return (
        <View style={styles.container}>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FAFAFA',
      },
});

export default OrderDetailScreen;