import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { cekProfile, host, tanggalIndo, api, Icons, Loading, formatTanggal, tanggal } from '../../Module';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../component/FormInput';
import EmptyState from '../component/EmptyPage';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: {},
            DataStatus: [
                { Status: "Baru" },
                { Status: "Cold" },
                { Status: "Closing" },
            ],
            Status: "Semua",
            DataLead: [
                { Nama: "Heru", Device: "none", Waktu: "2025-02-01", Keterangan: "Halu ini adalah pesan dari Heru" },
                { Nama: "Yuni", Device: "none", Waktu: "2025-02-01", Keterangan: "Halu ini adalah pesan dari Yuni" },
                { Nama: "Trida", Device: "none", Waktu: "2025-02-01", Keterangan: "Halu ini adalah pesan dari Trida" },
                { Nama: "Ira", Device: "none", Waktu: "2025-02-01", Keterangan: "Halu ini adalah pesan dari Ira" },
                { Nama: "Muhammad Ismail", Device: "none", Waktu: "2025-02-01", Keterangan: "Halu ini adalah pesan dari Muhammad" },
                { Nama: "Nayla Izzati Prasetia", Device: "none", Waktu: "2025-02-01", Keterangan: "Halu ini adalah pesan dari Nayla" },
            ],
            Loading: true,
            IsSearch: false,
            D1: new Date(tanggal(-7)),
            D2: new Date(tanggal()),
            ShowD1: false,
            ShowD2: false,
        };
    }

    async componentDidMount() {
        let Profile = await cekProfile();
        this.setState({ Profile: Profile.data }, this.handleMain);
    }

    handleMain = async () => {
        this.setState({ Loading: true });
        let sql = await api("datalead-android", {
            Status: this.state.Status,
            D1: formatTanggal(this.state.D1),
            D2: formatTanggal(this.state.D2)
        });
        if (sql.status == "sukses") this.setState({ DataLead: sql.Lead, DataStatus: sql.LeadStatus, Loading: false, IsSearch: false });
    }

    handlePilihStatus(ID) {
        this.setState({ Status: ID, Loading: true }, this.handleMain);
    }

    handleDetailLead(Data) {
        this.props.navigation.navigate('DetailChat', { Data });
    }

    handleCariLead(val) {
        let DataLead = this.state.DataLead;
        let query = this.state.Q.toLowerCase();
        let Temp = DataLead.filter((edt) =>
            edt.Pesan && edt.Pesan.toLowerCase().includes(query)
        );
        this.setState({ DataLead: Temp, IsSearch: false });
    }

    changeD1 = (event, selectedDate) => {
        if (selectedDate) this.setState({ D1: selectedDate }, this.handleMain);
        this.setState({ ShowD1: false });
    }

    changeD2 = (event, selectedDate) => {
        if (selectedDate) this.setState({ D2: selectedDate }, this.handleMain);
        this.setState({ ShowD2: false });
    }

    render() {
        const { navigation } = this.props;
        const { Profile, DataStatus, Status, DataLead, D1, D2 } = this.state;
        let Color = { "Hot": "#FF6384", "Cold": "#94E9B8", "Warm": "#FFCE56", "Closing": "#59c04bff", "Baru": "#AEC7ED", "Pembayaran": "#277cf3ff" }
        return (
            <SafeAreaView style={styles.container}>
                {
                    this.state.IsSearch == false ?
                        <View>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 20 }}>
                                    <Icons name="arrow-left" size={20} />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Data Lead</Text>
                                <TouchableOpacity onPress={() => this.setState({ IsSearch: true })} style={{ paddingLeft: 20 }}>
                                    <Icons name="search" size={20} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, marginBottom: 15 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingBottom: 5 }}>
                                    <TouchableOpacity onPress={(e) => this.handlePilihStatus("Semua")}>
                                        <View style={{ backgroundColor: Status == "Semua" ? "#277cf3ff" : "#fafafa", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                                            <Text style={{ color: Status == "Semua" ? "#fafafa" : "#691e82", fontSize: 14 }}>Semua Status</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        DataStatus.map((div, i) => (
                                            <TouchableOpacity onPress={(e) => this.handlePilihStatus(div.Status.trim())} key={i}>
                                                <View style={{ backgroundColor: div.Status.trim() == Status ? "#691e82" : Color[div.Status.trim()], padding: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                                                    <Text style={{ color: div.Status.trim() == Status ? "#fafafa" : "#691e82", fontSize: 14 }}>{div.Status.trim()}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10 }}>
                            <View style={{ flex: 1 }}>
                                <FormInput type="date" value={D1} onChange={this.changeD1} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput type="date" value={D2} onChange={this.changeD2} />
                            </View>
                            <TouchableOpacity onPress={() => this.handleMain()} style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#CE181B', paddingHorizontal: 12, borderRadius: 5, maxHeight: 42 }} >
                                <Icons name="search" size={20} color="#fefe" />
                            </TouchableOpacity>
                        </View>
                }

                <Loading show={this.state.Loading} >
                    {
                        DataLead.length > 0 ?
                            <FlatList style={{ flex: 1 }} data={DataLead} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                                <TouchableOpacity style={styles.itemWrapper} onPress={() => this.handleDetailLead(item)}>
                                    <View style={styles.itemLeft}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.itemText}>{item.Pelanggan}</Text>
                                            <Text style={{ color: "#4f5e7b", fontSize: 12 }}>{item.Device}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 11 }}>{tanggalIndo(item.Waktu)}</Text>
                                            <View style={{ backgroundColor: Color[item.Status.trim()], paddingLeft: 5, paddingRight: 5, borderRadius: 20 }}>
                                                <Text style={{ textAlign: "center" }}>{item.Status.trim()}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            />
                            : <EmptyState />
                    }
                </Loading>
                <View style={{ marginBottom: 50 }}></View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: 10
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: "bold"
    },
    searchHeader: {
        width: '100%',
        marginBottom: 20,
        marginTop: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 2,
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
