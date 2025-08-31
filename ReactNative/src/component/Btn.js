import React, { Component, Fragment } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default class Btn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            eyeIcon: 'eye-off',
            ShowDate: false,
        };
    }

    render() {
        const { type = 'text', label, onClick, size = 20, icon, theme = 'light', disabled = false, color = "#CE181B", posisi = 80 } = this.props;
        const isDark = theme === 'dark';

        const FloatingStyle = {
            position: 'absolute',
            bottom: posisi,
            right: 20,
            backgroundColor: color,
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
        };

        return (
            <Fragment>
                {type === 'floating' ? (
                    <TouchableOpacity disabled={disabled} style={FloatingStyle} onPress={onClick}>
                        <Icon name={icon} color="#fff" size={20} />
                    </TouchableOpacity>
                ) : type == "icon" ? (
                    <TouchableOpacity
                        disabled={disabled}
                        style={{
                            backgroundColor: color,
                            width: label ? 100 : size,
                            height: size,
                            borderRadius: label ? 10 : 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                        onPress={onClick}
                    >
                        <Icon name={icon} color="#fff" size={size - 8} />
                        {label ? (
                            <Text style={{ color: "#fff", marginLeft: 5 }}>{label}</Text>
                        ) : null}
                    </TouchableOpacity>

                ) :
                    (
                        <TouchableOpacity disabled={disabled} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: color,
                            padding: 14,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginTop: 10
                        }} onPress={onClick}>
                            <Icon name={icon} color="#fff" size={20} /><Text style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                paddingLeft: 5
                            }}>{label}</Text>
                        </TouchableOpacity>
                    )}
            </Fragment>
        );
    }
}