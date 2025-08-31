import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons, cekProfile, host, Loading, saiki, tanggalIndo } from '../../Module';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataMenu: [
                { Nama: "", Icon: "fas fa-user" },
                { Nama: "", Icon: "fas fa-user" },
                { Nama: "", Icon: "fas fa-user" },
                { Nama: "", Icon: "fas fa-user" },
                { Nama: "", Icon: "fas fa-user" }
            ],
            Profile: {},
            Loading: true
        };
    }

    async componentDidMount() {
        let Profile = await cekProfile(true);
        if (Profile.status == "sukses") {
            this.setState({ DataMenu: Profile.Menu, Profile: Profile.data, Loading: false });
        }
    }

    handlePilihMenu(path) {
        this.props.navigation.navigate(path);
    }

    render() {
        let { DataMenu, Profile } = this.state;
        let Menu = ["/chat", "/historychat", "/client", "/", "/ig", "/lead", "/calendar", "/livechatclient", "/filemanager", "/promo", "/afiliet"]
        return (
            <SafeAreaView>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Image source={Profile.FotoProfile == "none" ? require('../assets/FotoProfile.png') : host + "files/" + Profile.FotoProfile} style={styles.avatar} />
                        <View>
                            <Text style={styles.greeting}>Hi, {Profile.Nama}</Text>
                            <Text style={styles.date}>{tanggalIndo(saiki())}</Text>
                        </View>
                        <TouchableOpacity style={{ marginLeft: 'auto' }}>
                            <Icons name="bell" size={20} color="#0B0B0B" />
                        </TouchableOpacity>
                    </View>

                    <Loading show={this.state.Loading} >
                        <ImageBackground source={require('../assets/BgOtherMenu.png')} resizeMode="cover" style={styles.menuContainer}>
                            {
                                DataMenu.map((div, i) => {
                                    if (!Menu.includes(div.Path)) {
                                        return this.renderMenuItem(div, i)
                                    }
                                })
                            }
                        </ImageBackground>

                        <View style={styles.card}>
                            <Image source={require('../assets/referral.png')} style={styles.cardIcon} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>Cooming Soon Referral</Text>
                                <Text style={styles.cardDesc}>Ajak teman anda untuk bergabung dengan BantuWin untuk mendapatkan voucher bonus</Text>
                            </View>
                            <Icons name="chevron-right" color="#aaa" />
                        </View>

                        <TouchableOpacity style={styles.card} onPress={() => Linking.openURL("https://youtube.com/@bantuwin?si=BuPttx5Kn8vsUc92")}>
                            <Image source={require('../assets/tutorial.png')} style={styles.cardIcon} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>Tutorial</Text>
                                <Text style={styles.cardDesc}>Tata Cara Penggunaan</Text>
                            </View>
                            <Icons name="chevron-right" color="#aaa" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card} onPress={() => Linking.openURL("https://course.bantuwin.id/")}>
                            <Image source={require('../assets/ecourse.png')} style={styles.cardIcon} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>Akses Ecourse</Text>
                                <Text style={styles.cardDesc}>Pelajari optimasi digital marketing GRATIS</Text>
                            </View>
                            <Icons name="chevron-right" color="#aaa" />
                        </TouchableOpacity>
                        <View style={{ paddingBottom: 50 }} />
                    </Loading>
                </ScrollView>
            </SafeAreaView>
        );
    }

    renderMenuItem(data, i) {
        return (
            <TouchableOpacity style={styles.menuItem} key={i} onPress={() => this.handlePilihMenu(data.Path)}>
                <View style={{ backgroundColor: "#ffffff", borderRadius: 20, padding: 10, width: 60, height: 60, alignItems: 'center' }}>
                    <Icons name={data.Icon.split("fa-")[1]} color="#1849D6" size={35} type="fontawsome" />
                </View>
                <Text style={styles.menuLabel}>{data.Nama}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#f4f6fa', padding: 10, marginBottom: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    greeting: { fontWeight: 'bold', fontSize: 16 },
    date: { color: '#999', fontSize: 12 },
    iconBell: { width: 20, height: 20 },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#e6ebff',
        borderRadius: 12,
        padding: 10,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    menuItem: { width: '23%', alignItems: 'center', marginVertical: 8 },
    menuIcon: { width: 40, height: 40, marginBottom: 4 },
    menuLabel: { fontSize: 10, textAlign: 'center', color: '#CE181B' },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
    },
    cardIcon: { width: 40, height: 40, marginRight: 10 },
    cardTitle: { fontWeight: 'bold', color: '#CE181B' },
    cardDesc: { fontSize: 12, color: '#666' },
    arrow: { fontSize: 20, color: '#aaa' },
});
