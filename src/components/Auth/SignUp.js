import React, { Component } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';

class SignUp extends Component {
    state = {
        email: '',
        password: ''
    }
    render() {
        return (
            <View></View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 10
    },
    input: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 10,
        opacity: .8
    },
    button: {
        backgroundColor: '#274fc6',
        textAlign: 'center',
        color: '#FFFFFF',
        padding: 15
    }
});

export default SignUp;