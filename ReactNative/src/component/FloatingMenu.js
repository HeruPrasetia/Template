import React, { Component } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class FloatingMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.animation = new Animated.Value(0);
    }

    toggleMenu = () => {
        const { open } = this.state;
        this.setState({ open: !open }, () => {
            Animated.spring(this.animation, {
                toValue: this.state.open ? 1 : 0,
                useNativeDriver: true,
            }).start();
        });
    };

    render() {
        const { open } = this.state;

        const menuStyle = {
            opacity: this.animation,
            transform: [
                {
                    translateY: this.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, -10], // dari bawah ke atas
                    }),
                },
            ],
        };

        return (
            <View style={styles.container}>
                {/* Drop-up Menu */}
                {open && (
                    <Animated.View style={[styles.menu, menuStyle]}>
                        {['Menu 1', 'Menu 2', 'Menu 3'].map((item, index) => (
                            <TouchableOpacity key={index} style={styles.menuItem}>
                                <Text style={{ color: '#fff' }}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                )}

                {/* Floating Button */}
                <TouchableOpacity style={styles.fab} onPress={this.toggleMenu}>
                    <Icon name="add" color="#fff" size={24} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingBottom: 80,
    },
    fab: {
        backgroundColor: '#2F80ED',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    menu: {
        backgroundColor: '#333',
        borderRadius: 10,
        paddingVertical: 5,
        marginBottom: 10,
        alignItems: 'center',
        overflow: 'hidden',
    },
    menuItem: {
        padding: 10,
        width: 120,
        alignItems: 'center',
    },
});
