import React, { Component } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import { Redirect } from 'react-router-native';
import { APIV1, JSON_HEADERS } from './../../constants';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {
    state = {
        email: '',
        password: '',
        isAuth: false
    }

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    login() {
        fetch(`${APIV1}/auth/login`, {
            method: 'POST',
            headers: JSON_HEADERS,
            credentials: 'same-origin',
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .catch(e => console.log(e))
        .then((response) => response.json())
        .catch(e => console.log(e))
        .then((data) => this.setState({ isAuth: data.auth || false }));
    }

    render() {
        if (this.state.isAuth === true) {
            return <Redirect to="/profile"/>;
        } else {
            return (
                <KeyboardAvoidingView behavior="padding">
                    <Text style={styles.title}>Email/Password</Text>
                    <TextInput
                        style={styles.input}
                        autoFocus={true}
                        onChangeText={(text) => this.setState({email: text})}
                        value={this.state.email}
                        autoCorrect={false}
                        keyboardType="email-address"
                        returnKeyType="next"
                        onSubmitEditing={() => this.passwordInput.focus()}
                        placeholder="Email"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({password: text})}
                        value={this.state.password}
                        secureTextEntry
                        returnKeyType="go"
                        placeholder="Password"
                        ref={(input) => this.passwordInput = input}
                    />
                    <TouchableOpacity onPress={this.login}>
                        <Text style={styles.button}>Login</Text>
                    </TouchableOpacity>

                    {/* TODO don't have an account?  Sign Up */}
                    {/* TODO MAYBE Validation */}
                    {/* TODO proper message from res */}
                    {/* TODO Button should disable until submission is complete */}
                    {/* TODO Profile should b private route with redirect if unauth */}
                </KeyboardAvoidingView>
            );
        }
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

export default Login;