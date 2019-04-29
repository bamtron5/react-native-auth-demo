import React, { Component } from "react";
import { Text, View } from 'react-native';
import { APIV1, JSON_HEADERS } from './../../constants';
import AsyncStorage from '@react-native-community/async-storage';

class Profile extends Component {
    state = {
        email: ''
    };

    componentDidMount() {
        AsyncStorage.getItem('token')
            .then(token => this.getUser(token))
            .catch(e => console.log(e));
    }

    getUser(token) {
        fetch(`${APIV1}/auth/currentuser`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`,
                ...JSON_HEADERS
            }
        })
        .catch((err) => console.log(err))
        .then(data => data.json())
        .then(res => this.setState({email: res.email || false}));
    }

    render() {
        const { email } = this.state;
        const welcome = `Hello ${email}, you are logged in.`;
        return (
            <View>
                <Text>{email.length ? welcome : '...'}</Text>
                {/* if fail response redirect, show nothing until email retrieved */}
                {/* try catch is better */}
                {/* if i already have currentUser just go to profile */}
            </View>
        );
    }
}

export default Profile;