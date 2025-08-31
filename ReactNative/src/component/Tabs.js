import React, { Component, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={onPress}
                        style={[
                            styles.tabItem,
                            isFocused ? styles.activeTab : styles.inactiveTab,
                        ]}
                    >
                        <Text style={[styles.tabText, isFocused && styles.activeText]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default class Tabs extends Component {
    render() {
        const { header, children } = this.props;
        const childrenArray = React.Children.toArray(children);

        return (
            <Tab.Navigator tabBar={props => <MyTabBar {...props} />} >
                {header.map((item, index) => {
                    const targetChild = childrenArray.find(child => child.props.id === item.for);

                    // Penting: jadikan sebagai komponen tetap
                    const ScreenComponent = () => <>{targetChild}</>;

                    return (
                        <Tab.Screen
                            key={index}
                            name={item.caption}
                            component={memo(ScreenComponent)} // pake memo
                            options={{ title: item.caption }}
                        />
                    );
                })}
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        margin: 10,
        borderRadius: 25,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 20
    },
    activeTab: {
        backgroundColor: 'white',
    },
    inactiveTab: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontWeight: 'bold',
        color: '#666',
    },
    activeText: {
        color: '#CE181B',
    },
});
