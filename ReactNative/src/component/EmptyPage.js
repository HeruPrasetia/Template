import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default class EmptyState extends Component {
    render() {
        const { message = 'Data kosong', imageSource } = this.props;

        return (
            <View style={styles.container}>
                <Image
                    source={imageSource || require('../assets/Empty.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.text}>{message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
        opacity: 0.7
    },
    text: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center'
    }
});
