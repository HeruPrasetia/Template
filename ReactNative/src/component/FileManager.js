// ./src/components/Gallery.js
import React, { Component } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        };
    }

    handleSelect = (item) => {
        this.setState({ selected: item });
        if (this.props.onSelect) {
            this.props.onSelect(item);
        }
    }

    renderItem = ({ item }) => {
        const { selected } = this.state;
        const isSelected = selected === item;
        return (
            <TouchableOpacity onPress={() => this.handleSelect(item)}>
                <Image
                    source={{ uri: item }}
                    style={[styles.image, isSelected && styles.selected]}
                />
            </TouchableOpacity>
        );
    }

    render() {
        const { photos } = this.props; // Array berisi URL foto
        return (
            <View style={styles.container}>
                <FlatList
                    data={photos}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    image: {
        width: screenWidth / 3 - 10,
        height: screenWidth / 3 - 10,
        margin: 5,
        borderRadius: 10,
    },
    selected: {
        borderWidth: 3,
        borderColor: 'blue',
    }
});
