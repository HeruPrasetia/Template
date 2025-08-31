import React, { Component, Fragment } from 'react';
import { View, TextInput, Text, TouchableOpacity, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { tanggalIndo } from '../../Module';

export default class FormInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            eyeIcon: 'eye-off',
            ShowDate: false,
        };
    }

    handleBlur = () => {
        const { value, required, label, placeholder, onBlur } = this.props;
        if (required && (!value || value === '')) {
            this.setState({ error: label || placeholder + ' wajib diisi' });
        } else {
            this.setState({ error: '' });
        }
        if (onBlur) onBlur();
    };

    handleFocus() {
        return false;
    }

    render() {
        const { type = 'text', value, onChange, label, placeholder, data, icon, theme = 'light', margin = true, disabled = false, onBlur, onFocus, onClose } = this.props;
        const { error, eyeIcon } = this.state;
        const isDark = theme === 'dark';

        const containerStyle = {
            flexDirection: 'row',
            alignItems: type === 'textarea' ? 'flex-start' : 'center',
            borderWidth: 1.5,
            borderRadius: 10,
            borderColor: error ? 'red' : isDark ? '#555' : '#CE181B',
            paddingLeft: icon ? 5 : 12,
            backgroundColor: disabled ? (isDark ? '#555' : '#eee') : isDark ? '#333' : '#fff',
            minHeight: type === 'textarea' ? 100 : (Platform.OS === 'ios' ? 45 : 30),
        };

        const inputStyle = {
            flex: 1,
            color: disabled ? '#999' : isDark ? '#fff' : '#000',
            textAlignVertical: type === 'textarea' ? 'top' : 'center',
        };

        const labelStyle = {
            position: 'absolute',
            left: 12,
            top: -12,
            fontSize: 15,
            color: '#CE181B',
            backgroundColor: '#fff',
            paddingHorizontal: 4
        };

        return (
            <View style={{ marginBottom: margin && 18 }}>
                {type === 'select' ? (
                    <View style={containerStyle}>
                        {label && <Text style={labelStyle}>{label || placeholder}</Text>}
                        {icon && <Icon name={icon} size={18} color={isDark ? '#fff' : '#CE181B'} style={{ marginRight: 8, marginLeft: 8 }} />}
                        <Picker enabled={!disabled} selectedValue={value} onValueChange={(itemValue) => onChange(itemValue)} style={inputStyle} onBlur={this.handleBlur}>
                            <Picker.Item label={placeholder || 'Pilih'} value="" />
                            {data && data.map((item, index) => (
                                <Picker.Item key={index} label={item.Nama} value={item.ID} />
                            ))}
                        </Picker>
                    </View>
                ) : type === "number" ?
                    (<View style={containerStyle}>
                        {label && <Text style={labelStyle}>{label || placeholder}</Text>}
                        {icon && <Icon name={icon} size={18} color={isDark ? '#fff' : '#CE181B'} style={{ marginRight: 8, marginLeft: 8, marginTop: type === 'textarea' ? 5 : 0 }} />}
                        <TextInput style={inputStyle} placeholder={placeholder} placeholderTextColor={isDark ? '#aaa' : '#999'} value={value} editable={!disabled} keyboardType={'numeric'}
                            onChangeText={(text) => {
                                if (type === 'number') {
                                    const numeric = text.replace(/[^0-9]/g, '');
                                    onChange(numeric);
                                } else {
                                    onChange(text);
                                }
                            }}
                            onBlur={this.handleBlur}
                        />
                    </View>)
                    : type == "password" ? (
                        <View style={containerStyle}>
                            {label && <Text style={labelStyle}>{label || placeholder}</Text>}
                            {icon && <Icon name={icon} size={18} color={isDark ? '#fff' : '#CE181B'} style={{ marginRight: 8, marginLeft: 8, marginTop: type === 'textarea' ? 5 : 0 }} />}
                            <TextInput style={inputStyle} placeholder={placeholder} placeholderTextColor={isDark ? '#aaa' : '#999'} secureTextEntry={eyeIcon === 'eye-off' ? true : false} value={value} editable={!disabled} onChangeText={(text) => onChange(text)} onBlur={this.handleBlur} />
                            <TouchableOpacity style={{ padding: 8 }} onPress={() => {
                                if (eyeIcon == "eye-off") {
                                    this.setState({ eyeIcon: "eye" });
                                } else {
                                    this.setState({ eyeIcon: "eye-off" });
                                }
                            }}>
                                <Icon name={eyeIcon} size={18} color={isDark ? '#fff' : '#CE181B'} />
                            </TouchableOpacity>
                        </View>
                    ) : type == "search" ? (
                        <View style={[containerStyle, { paddingLeft: 5 }]}>
                            {label && <Text style={labelStyle}>{label || placeholder}</Text>}
                            <Icon name="search" size={18} color={isDark ? '#fff' : '#CE181B'} style={{ marginRight: 8, marginLeft: 8 }} />
                            <TextInput style={inputStyle} placeholder={placeholder} placeholderTextColor={isDark ? '#aaa' : '#999'} value={value} editable={!disabled} onChangeText={(text) => onChange(text)} onBlur={this.handleBlur} onFocus={() => (onFocus?.(), this.handleFocus())} />
                            <TouchableOpacity style={{ padding: 8 }} onPress={onClose}>
                                <Icon name="x-circle" size={18} color={isDark ? '#fff' : '#CE181B'} />
                            </TouchableOpacity>
                        </View>
                    ) : type == "date" ? (
                        <Fragment>
                            <TouchableOpacity style={[containerStyle, { paddingLeft: 5 }]} onPress={() => this.setState({ ShowDate: true })}>
                                {label && <Text style={labelStyle}>{label || placeholder}</Text>}
                                <Icon name="calendar" size={18} color='#CE181B' style={{ marginRight: 8, marginLeft: 8 }} />
                                <TextInput value={tanggalIndo(value)} editable={false} style={inputStyle} />
                            </TouchableOpacity>
                            {this.state.ShowDate && (
                                <DateTimePicker value={value} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, selectedDate) => {
                                    onChange(event, selectedDate);
                                    this.setState({ ShowDate: false });
                                }} textColor="#432f88" />
                            )}
                        </Fragment>
                    ) : type == "time" ? (
                        <Fragment>
                            <TouchableOpacity style={[containerStyle, { paddingLeft: 5 }]} onPress={() => this.setState({ ShowDate: true })}>
                                {label && <Text style={labelStyle}>{label || placeholder}</Text>}
                                <Icon name="calendar" size={18} color='#CE181B' style={{ marginRight: 8, marginLeft: 8 }} />
                                <TextInput value={tanggalIndo(value)} editable={false} style={inputStyle} />
                            </TouchableOpacity>
                            {this.state.ShowDate && (
                                <DateTimePicker value={value} mode="time" display={Platform.OS === 'ios' ? 'inline' : 'default'} is24Hour={true} onChange={(event, selectedDate) => {
                                    onChange(event, selectedDate);
                                    this.setState({ ShowDate: false });
                                }} textColor="#432f88" />
                            )}
                        </Fragment>
                    ) : type == 'switch' ?
                        (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Switch
                                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    trackColor={{ false: "#767577", true: "#c5c1c9ff" }}
                                    thumbColor="#CE181B"
                                    ios_backgroundColor="#fff"
                                    value={!!value}
                                    onValueChange={(e) => onChange(e)}
                                />
                                {label && <Text style={{ marginLeft: 8, fontSize: 18 }}>{label}</Text>}
                            </View>
                        ) :
                        (
                            <View style={containerStyle}>
                                {label && <Text style={labelStyle}>{label || placeholder}</Text>}
                                {icon && <Icon name={icon} size={18} color={isDark ? '#fff' : '#CE181B'} style={{ marginRight: 8, marginLeft: 8, marginTop: type === 'textarea' ? 5 : 0 }} />}
                                <TextInput style={inputStyle} placeholder={placeholder} placeholderTextColor={isDark ? '#aaa' : '#999'} value={value} editable={!disabled} multiline={type === 'textarea'} onChangeText={(text) => onChange(text)} onBlur={onBlur || this.handleBlur} />
                            </View>
                        )}
                {error ? <Text style={{ color: 'red', marginTop: 4 }}>{error}</Text> : null}
            </View>
        );
    }
}