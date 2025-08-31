import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { cekProfile, host, tanggalIndo, api, Icons, Loading } from '../../Module';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../component/FormInput';
import EmptyState from '../component/EmptyPage';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: {},
            DataDevice: [
                { Nama: "Device 1", ID: 1 },
                { Nama: "Device 2", ID: 2 },
                { Nama: "Device 3", ID: 3 },
            ],
            DeviceID: 0,
            DataChat: [
                { Nama: "Heru", Image: "none", Waktu: "2025-02-01", Pesan: "Halu ini adalah pesan dari Heru" },
                { Nama: "Yuni", Image: "none", Waktu: "2025-02-01", Pesan: "Halu ini adalah pesan dari Yuni" },
                { Nama: "Trida", Image: "none", Waktu: "2025-02-01", Pesan: "Halu ini adalah pesan dari Trida" },
                { Nama: "Ira", Image: "none", Waktu: "2025-02-01", Pesan: "Halu ini adalah pesan dari Ira" },
                { Nama: "Muhammad Ismail", Image: "none", Waktu: "2025-02-01", Pesan: "Halu ini adalah pesan dari Muhammad" },
                { Nama: "Nayla Izzati Prasetia", Image: "none", Waktu: "2025-02-01", Pesan: "Halu ini adalah pesan dari Nayla" },
            ],
            Loading: true,
            Q: "",
            IsSearch: false
        };
    }

    async componentDidMount() {
        let Profile = await cekProfile();
        this.setState({ Profile: Profile.data }, this.handleMain);
    }

    handleMain = async () => {
        let sql = await api("datapesan-android", { DeviceID: this.state.DeviceID });
        if (sql.status == "sukses") this.setState({ DataChat: sql.Chat, DataDevice: sql.Device, Loading: false });
    }

    handlePilihDevice(ID) {
        this.setState({ DeviceID: ID, Loading: true }, this.handleMain);
    }

    handleDetailChat(Data) {
        this.props.navigation.navigate('DetailChat', { Data });
    }

    handleCariPesan(val) {
        let DataChat = this.state.DataChat;
        let query = this.state.Q.toLowerCase();
        let Temp = DataChat.filter((edt) =>
            edt.Pesan && edt.Pesan.toLowerCase().includes(query)
        );
        this.setState({ DataChat: Temp, IsSearch: false });
    }


    render() {
        const { Profile, DataDevice, DeviceID, DataChat, Q } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                {
                    this.state.IsSearch == false ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10 }}>
                            <Text style={{ fontSize: 20 }}>Chat</Text>
                            <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => this.setState({ IsSearch: true })}>
                                <Icons name="search" size={20} />
                            </TouchableOpacity>
                        </View> :
                        <FormInput type="search" placeholder="Cari Chat" value={this.state.Q} onChange={(e) => this.setState({ Q: e })} onBlur={(e) => this.handleCariPesan()} icon="search" />
                }
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'top', gap: 10, paddingBottom: 5 }}>
                        <TouchableOpacity onPress={(e) => this.handlePilihDevice(0)}>
                            <View style={{ backgroundColor: DeviceID == 0 ? "#e8f0fb" : "#fafafa", padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 20 }}>
                                <Text>Semua Device</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            DataDevice.map((div, i) => (
                                <TouchableOpacity onPress={(e) => this.handlePilihDevice(div.ID)} key={i}>
                                    <View style={{ backgroundColor: DeviceID == div.ID ? "#e8f0fb" : "#fafafa", padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 20 }}>
                                        <Text>{div.Nama}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </ScrollView>
                <Loading show={this.state.Loading} >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {DataChat.length == 0 ? <EmptyState message="Tidak ada chat" /> :
                            DataChat.map((div, i) => {
                                return (
                                    <TouchableOpacity style={styles.itemWrapper} onPress={() => this.handleDetailChat(div)} key={i}>
                                        <View style={styles.itemLeft}>
                                            <Image source={div.Image == "none" ? require("../assets/user.png") : host + 'files/' + div.Image} style={{ width: 50, height: 50, borderRadius: 30 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.itemText}>{div.Nama}</Text>
                                                <Text style={{ color: "#4f5e7b", fontSize: 12 }}>{div.Pesan}</Text>
                                            </View>
                                            <Text style={{ fontSize: 11 }}>{tanggalIndo(div.Waktu)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        <View style={{ paddingBottom: 50 }}></View>
                    </ScrollView >
                </Loading>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: '#f8f9fd',
        flex: 1
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 2,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    imageWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#ffcc00',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        backgroundColor: '#691e82',
        borderRadius: 12,
        padding: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#CE181B',
    },
    infoBox: {
        gap: 5,
    },
    itemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        elevation: 1,
        marginBottom: 5
    },
    itemLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12
    },
    itemText: {
        fontSize: 15,
        color: '#333',
    },
});
