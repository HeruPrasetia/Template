import React, { Component } from 'react';
import { Alert, View, Animated, Easing, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { replace } from './NavigationService';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import FontAwsome from 'react-native-vector-icons/FontAwesome5';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


// export const WsHost = "ws://192.168.9.229:3003/";
// export const host = "http://192.168.9.229:3001/";

// export const WsHost = "ws://192.168.1.3:3003/";
// export const host = "http://192.168.1.3:3001/";

export const WsHost = "ws://192.168.1.4:3003/";
export const host = "http://192.168.1.4:3001/";
export const domain = "localhost";

/* export const host = "https://wapi.naylatools.com/";
export const WsHost = "wss://ws.naylatools.com/";
export const domain = "apps.bantuwin.id"; */

export const colorScheme = Appearance.getColorScheme();


export const api = async function (url, data = {}, debug = false) {
    try {
        const token = await AsyncStorage.getItem('token');
        const PerusahaanID = await AsyncStorage.getItem("PerusahaanID");
        data.Token = token || '';
        data.PerusahaanID = PerusahaanID || '';
        data.Domain = domain;
        const response = await fetch(`${host}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const hasil = await response.text();

        if (debug) console.log("API Response:", hasil);

        try {
            return JSON.parse(hasil);
        } catch (err) {
            return { status: "gagal", pesan: "Gagal Koneksi Keserver" };
        }

    } catch (e) {
        Alert.alert("Terjadi Kesalahan", "Gagal menghubungi server.");
        console.log("API Error:", e);
        return { status: "gagal", pesan: e.message };
    }
};

export async function cekProfile(isMenu = false) {
    let sql = await api("getProfile", { Path: "", isMenu });
    if (sql.status == "gagal") handleLogout();
    return sql;
}

export async function handleLogout() {
    try {
        await AsyncStorage.clear();
        replace('Login');
    } catch (error) {
        console.error('Gagal logout:', error);
    }
}


export const Loading = ({ show, children }) => {
    if (!show) return children;
    return (
        <SkeletonPlaceholder
            backgroundColor={colorScheme == "dark" ? "#333" : "#e0e0e0"}
            highlightColor={colorScheme == "dark" ? "#555" : "#f5f5f5"}>
            {children}
        </SkeletonPlaceholder>
    );
};

export const saiki = function (first = null, hasil = "hari") {
    var today = new Date();
    var dd = first == null ? today.getDate() : first;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    if (hasil == "hari") {
        today = yyyy + '-' + mm + '-' + dd;
    } else if (hasil == "time") {
        today = H + ':' + i + ':' + s;
    } else if (hasil == 'timestamp') {
        today = yyyy + '-' + mm + '-' + dd + " " + H + ':' + i + ':' + s;
    }
    return today;
}

export const tanggal = (first = 0) => {
    let baseDate = new Date();

    if (typeof first === 'number' && first !== 0) {
        baseDate.setDate(baseDate.getDate() + first);
    }

    let year = baseDate.getFullYear();
    let month = ('0' + (baseDate.getMonth() + 1)).slice(-2);
    let day = ('0' + baseDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
};


export function Pesan2(Pesan, Judul = "", Jenis = "success", Position = "top") {
    Toast.show({
        type: Jenis,
        text1: Judul,
        text2: Pesan,
        position: Position
    });
}

export function Pesan(Pesan, Judul = "", Jenis = "success") {
    Alert.alert(Judul, Pesan);
}

export class Icons extends Component {
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        const { animasi } = this.props;

        if (animasi === 'rotate') {
            this.startRotate();
        } else if (animasi === 'bounce') {
            this.startBounce();
        } else if (animasi === 'fade') {
            this.startFade();
        }
    }

    startRotate() {
        this.animatedValue.setValue(0);
        Animated.loop(
            Animated.timing(this.animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }

    startBounce() {
        this.animatedValue.setValue(0);
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.animatedValue, {
                    toValue: -10,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(this.animatedValue, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }

    startFade() {
        this.animatedValue.setValue(0);
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.animatedValue, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(this.animatedValue, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }

    render() {
        const { name, size = 20, color = '#000', animasi, type = "feather" } = this.props;

        let animatedStyle = {};

        if (animasi === 'rotate') {
            const spin = this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
            });
            animatedStyle = { transform: [{ rotate: spin }] };
        } else if (animasi === 'bounce') {
            animatedStyle = { transform: [{ translateY: this.animatedValue }] };
        } else if (animasi === 'fade') {
            animatedStyle = { opacity: this.animatedValue };
        }

        if (type == "feather") {
            if (animasi) {
                return (
                    <Animated.View style={animatedStyle}>
                        <Feather name={name} size={size} color={color} />
                    </Animated.View>
                );
            }

            // tanpa animasi
            return <Feather name={name} size={size} color={color} />;
        } else if (type == "fontawsome") {
            if (animasi) {
                return (
                    <Animated.View style={animatedStyle}>
                        <FontAwsome name={name} size={size} color={color} />
                    </Animated.View>
                );
            }

            // tanpa animasi
            return <FontAwsome name={name} size={size} color={color} />;
        }
    }
}

export const formatTanggal = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';

    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
};

export const tanggalIndo = function (data, time = false) {
    let d = new Date(data);
    if (isNaN(d.getTime())) return '';

    let year = d.getFullYear();
    let month = ('0' + (d.getMonth() + 1)).slice(-2);
    let day = ('0' + d.getDate()).slice(-2);

    let hasil = [year, month, day].join('-');
    if (hasil === "0000-00-00" || hasil == null) return hasil;

    const BulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    let tgl = hasil.substring(8, 10);
    let bln = hasil.substring(5, 7);
    let thn = hasil.substring(2, 4);

    let result = `${tgl} ${BulanIndo[parseInt(bln, 10) - 1]} ${thn}`;

    if (time === true) {
        let jam = ('0' + d.getHours()).slice(-2);
        let menit = ('0' + d.getMinutes()).slice(-2);
        let detik = ('0' + d.getSeconds()).slice(-2);
        result += ` ${jam}:${menit}:${detik}`;
    }

    return result;
};

export const numberFormat = function (ini) {
    var formatter = new Intl.NumberFormat("en-GB", { style: "decimal" });
    var nmr = 0;
    if (isNaN(ini)) {
        nmr = 0;
    } else {
        nmr = ini;
    }
    return formatter.format(nmr.toString().replace(/,/g, ""));
}