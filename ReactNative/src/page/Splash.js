import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SplashScreen extends Component {
    async componentDidMount() {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            this.props.navigation.replace('Home');
        } else {
            this.props.navigation.replace('Login');
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#CE181B" />
                <Text>Mengecek login...</Text>
            </View>
        );
    }
}
