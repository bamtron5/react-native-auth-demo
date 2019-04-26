import React, { Component } from "react";
import { Text, View } from 'react-native';
import { APIV1, JSON_HEADERS } from './../../constants';

class Profile extends Component {
    state = {
        email: ''
    };

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        fetch(`${APIV1}/auth/currentuser`, {
            method: 'GET',
            credentials: 'include',
            headers: JSON_HEADERS
        })
        .catch((err) => {
            console.log(err);
        })
        .then(data => {
            console.log(data);
            return data.json();
        })
        .then(res => {
            console.log(res);
            return this.setState({email: res.email || false});
        })
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