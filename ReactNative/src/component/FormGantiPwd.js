import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Icons, Pesan2, api } from '../../Module';
import FormInput from './FormInput';
import { replace } from '../..//NavigationService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class FormEditProfile extends Component {
    constructor(props) {
        super(props);
        const { ID } = props.route.params;
        this.state = {
            Password: "",
            NewPassword: "",
            RePassword: "",
            ID: ID,
            IconSave: "save"
        };
    }

    handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
            if (!response.didCancel && !response.errorCode) {
                this.setState({ FotoProfile: response.assets[0].uri });
            }
        });
    }

    handleSave = async () => {
        const { Password, NewPassword, RePassword, ID } = this.state;
        if (Password == "") return Pesan2("Silahkan isi kata sandi sebelumnya", "Maaf", "error");
        if (NewPassword == "") return Pesan2("Silahkan isi kata sandi baru", "Maaf", "error");
        if (RePassword == "") return Pesan2("Silahkan ulangi kata sandi baru", "Maaf", "error");
        if (NewPassword !== RePassword) return Pesan2("Kata sandi baru tidak sama", "Maaf", "error");
        this.setState({ IconSave: "loader" });
        let sql = await api("gantipassword", { ID, Password, NewPassword, RePassword }, true);
        if (sql.status == "sukses") {
            Pesan2(sql.pesan, "Selamat");
            replace("MainProfile");
        } else {
            Pesan2(sql.pesan, "Gagal", 'error');
            this.setState({ IconSave: "save" });
        }
    }

    render() {
        const { navigation } = this.props;

        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icons name="arrow-left" size={20} />
                </TouchableOpacity>

                <Text style={styles.title}>Ganti Password</Text>

                <FormInput type="password" placeholder="Kata Sandi Sebelumnya" value={this.state.Password} onChange={(e) => this.setState({ Password: e })} icon="lock" require />
                <FormInput type="password" placeholder="Kata Sandi Baru" value={this.state.NewPassword} onChange={(e) => this.setState({ NewPassword: e })} icon="lock" require />
                <FormInput type="password" placeholder="Ulangi Kata Sandi" value={this.state.RePassword} onChange={(e) => this.setState({ RePassword: e })} icon="lock" require />
                <TouchableOpacity style={styles.button} onPress={this.handleSave}>
                    <Icons name={this.state.IconSave} color="#fff" /><Text style={styles.buttonText}>Simpan</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    backButton: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#CE181B',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#CE181B',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#CE181B',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#CE181B',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        paddingLeft: 5
    },
});
