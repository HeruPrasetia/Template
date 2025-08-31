import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { api, Pesan2, Icons } from '../../Module';
import FormInput from '../component/FormInput';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Pwd: '',
            Icons: "log-in"
        };
    }

    componentDidMount() {
        // GoogleSignin.configure({
        //     webClientId: '271316405524-8ifhn1cm8helo48mc2im0ds7k246cb8u.apps.googleusercontent.com', // ini yang type: Web application
        //     offlineAccess: true,
        // });
    }

    handleLogin = async () => {
        const { Email, Pwd } = this.state;
        if (!Email || !Pwd) {
            Pesan2('Email dan password wajib diisi', 'Error', "error");
            return;
        }
        this.setState({ Icons: "loader" });
        let sql = await api("loginapp", { Email, Pwd }, true);
        if (sql.status == "sukses") {
            const token = sql.Token;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('PerusahaanID', String(sql.PerusahaanID));
            Pesan2('Login berhasil', "Selamat");
            this.props.navigation.replace('MainHome');
        } else {
            Pesan2(sql.pesan, 'Gagal', 'error');
            this.setState({ Icons: "log-in" });
        }
    };

    signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('User Info:', userInfo);
            let sql = await api("loginappgoogle", { Email: userInfo.email });

            if (sql.status == "sukses") {
                const token = sql.Token;
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('PerusahaanID', sql.PerusahaanID);
                Pesan2('Login berhasil', "Selamat");
                this.props.navigation.replace('MainHome');
            } else {
                Pesan2(sql.pesan, 'Gagal', 'error');
                this.setState({ Icons: "log-in" });
            }

            const tokens = await GoogleSignin.getTokens();
            console.log('Access token:', tokens.accessToken);

        } catch (error) {
            console.log('Error detail:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Pesan2("Login dibatalkan", "Gagal", "error");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Pesan2("Login sedang diproses, coba lagi nanti", "Gagal", "error");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Pesan2("Google Play Services tidak tersedia", "Gagal", "error");
            } else {
                Pesan2(error.message || JSON.stringify(error), "Gagal", "error");
            }
        }

    };

    render() {
        return (
            <ImageBackground source={require('../assets/BgLogin.jpg')} style={styles.background} resizeMode="cover">
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.wrapper}>
                        <View style={styles.top}>
                            <Image source={require('../assets/Logo.png')} style={styles.Logo} />
                        </View>
                        <FormInput label="Username" icon="user" type="text" placeholder="Masukan Username" value={this.state.Email} onChange={(text) => this.setState({ Email: text })} />
                        <FormInput label="Password" icon="lock" type="password" placeholder="Masukan Password" value={this.state.Pwd} onChange={(text) => this.setState({ Pwd: text })} />
                        <TouchableOpacity onPress={this.handleLogin} activeOpacity={0.8}>
                            <LinearGradient colors={['#78378e', '#432f88']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 30 }}>
                                <View style={styles.button}>
                                    <Icons name={this.state.Icons} animasi={this.state.Icons == 'log-in' ? '' : 'rotate'} size={20} color="#fff" />
                                    <Text style={styles.buttonText}>Masuk</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>


                        {/* <TouchableOpacity style={styles.buttonWrapper} onPress={this.signInWithGoogle}>
                        <LinearGradient colors={['#78378e', '#432f88']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
                            <Image source={require('../assets/GoogleLogin.png')} style={{ width: 20, height: 20, marginRight: 10, }} /> <Text style={{ color: "#fefe", fontWeight: 'bold' }}>Masuk Dengan Google</Text>
                        </LinearGradient>
                    </TouchableOpacity> */}
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    top: {
        alignItems: 'center',
        marginBottom: 40,
    },
    middle: {
        alignItems: 'center',
    },
    Logo: {
        width: 180,
        height: 100,
        resizeMode: 'contain',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 50,
        marginBottom: 16,
        borderColor: '#004691',
        borderWidth: 1,
    },

    buttonWrapper: {
        borderRadius: 30,
        marginTop: 8,
        width: '100%',
    },

    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8
    },
});
