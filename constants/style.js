// 'use strict';
import { StyleSheet } from 'react-native';
import { COLOR_BTN_PRIMARY, COLOR_BTN_PRIMARY_DISABLED } from './colors';

export const appStyles = StyleSheet.create({
    buttonText: {
		color: 'white',
		fontWeight: 'bold',
        fontSize: 15,
	},
    button: {
        backgroundColor: COLOR_BTN_PRIMARY,
        marginHorizontal: 10,
        marginTop: 20,
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonDisabled: {
        backgroundColor: COLOR_BTN_PRIMARY_DISABLED,
        marginHorizontal: 10,
        marginTop: 20,
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    disabled: {
        backfaceVisibility: COLOR_BTN_PRIMARY_DISABLED,
    },  
    input: {
        padding: 10,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginVertical:5,
        width: '100%',
        // paddingLeft: 16,
    },
    error: {
		color: 'red',
		fontWeight: 'bold',
	}
});
