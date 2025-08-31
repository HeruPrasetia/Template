import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class InputHashtag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            tags: this.stringToArray(props.value || '')
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({ tags: this.stringToArray(this.props.value || '') });
        }
    }

    // Convert string "#a#b#c" -> ["#a", "#b", "#c"]
    stringToArray = (str) => {
        if (!str) return [];
        return str
            .split('#') // pisah berdasarkan #
            .filter(Boolean) // buang yang kosong
            .map(tag => `#${tag}`);
    };

    // Convert array -> string "#a#b#c"
    arrayToString = (arr) => {
        return arr.join('');
    };

    handleAddTag = () => {
        let { text, tags } = this.state;
        if (text.trim() !== '') {
            let tag = text.startsWith('#') ? text.trim() : `#${text.trim()}`;
            if (!tags.includes(tag)) {
                const newTags = [...tags, tag];
                this.setState({ tags: newTags, text: '' }, () => {
                    if (this.props.onChange) this.props.onChange(this.arrayToString(newTags));
                });
            } else {
                this.setState({ text: '' });
            }
        }
    };

    handleRemoveTag = (index) => {
        let newTags = [...this.state.tags];
        newTags.splice(index, 1);
        this.setState({ tags: newTags }, () => {
            if (this.props.onChange) this.props.onChange(this.arrayToString(newTags));
        });
    };

    render() {
        const { text, tags } = this.state;
        const { placeholder } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.tagContainer}>
                    {tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity onPress={() => this.handleRemoveTag(index)}>
                                <Text style={styles.remove}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder || "Tambah hashtag..."}
                        placeholderTextColor="#999"
                        value={text}
                        onChangeText={(val) => this.setState({ text: val })}
                        onSubmitEditing={this.handleAddTag}
                        onBlur={this.handleAddTag}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#CE181B',
        borderRadius: 8,
        padding: 5,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#CE181B',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        margin: 3,
    },
    tagText: {
        color: '#fff',
        fontSize: 14,
    },
    remove: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    input: {
        flexGrow: 1,
        minWidth: 100,
        padding: 5,
        fontSize: 14,
    },
});
