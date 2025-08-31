import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Image } from 'react-native';
import { Icons, Loading, numberFormat, api } from '../../Module';
import FormInput from './FormInput';
import Btn from './Btn';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from './EmptyPage';

export default class FormEditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            DataOngkir: [],
            Search: "",
            Tujuan: "",
            TujuanID: "",
            Asal: "",
            AsalID: "",
            Jenis: "Lain",
            IconSave: "save",
            Loading: false,
            IconSearch: "search",
            modalVisible: false,
            Src: "Asal",
            Jumlah: "1",
            Berat: "1"
        };
        this.__typingTimer = null;
    }

    async handleCari(e) {
        clearTimeout(this.__typingTimer);
        this.__typingTimer = setTimeout(async () => {
            let sql = await api("getdestination", { search: e });
            if (sql.status === "sukses") this.setState({ Data: sql.data });
        }, 1000);
    }

    handlePilih(ID, Label) {
        if (this.state.Src == "Asal") {
            this.setState({ Asal: Label, AsalID: ID, modalVisible: false });
        } else {
            this.setState({ Tujuan: Label, TujuanID: ID, modalVisible: false });
        }
    }

    async handleCekOngkir() {
        let { AsalID, TujuanID, Berat } = this.state;
        let sql = await api("getongkir", { asal: AsalID, tujuan: TujuanID, berat: Berat, });
        if (sql.status == "sukses") {
            console.log(sql);
            this.setState({ DataOngkir: sql.data });
        }
    }

    render() {
        const { navigation } = this.props;
        let { Data, modalVisible, Tujuan, Asal, Jumlah, Berat, DataOngkir } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ marginBottom: 18, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icons name="arrow-left" size={20} />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cek Ongkir</Text>
                </View>
                <FormInput label="Asal" placeholder="Cari Alamat Asal" type="search" value={Asal} onFocus={() => this.setState({ modalVisible: true, Src: "Asal" })} />
                <FormInput label="Tujuan" placeholder="Cari Alamat Tujuan" type="search" value={Tujuan} onFocus={() => this.setState({ modalVisible: true, Src: "Tujuan" })} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Jumlah" placeholder="Jumlah Paket" type="number" value={Jumlah} onChange={(e) => this.setState({ Jumlah: e })} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Berat" placeholder="Berat Paket" type="number" value={Berat} onChange={(e) => this.setState({ Berat: e })} />
                    </View>
                </View>
                <Btn icon={this.state.IconSearch} label="Cek Ongkir" onClick={() => this.handleCekOngkir()} disabled={this.state.IconSearch == "search" ? false : true} />
                <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 18 }}>List Ongkir</Text>
                <Loading show={this.state.Loading} >
                    {
                        DataOngkir.length == 0 ? <EmptyState message="Tidak ada data" /> :
                            <FlatList style={{ flex: 1 }} data={DataOngkir} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                                <TouchableOpacity style={styles.itemWrapper} onPress={() => this.handleForm(item.ID)}>
                                    <View style={styles.itemLeft}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.itemText}>{item.name}</Text>
                                            <Text style={{ color: "#4f5e7b", fontSize: 12 }}>{item.description}</Text>
                                        </View>
                                        <View>
                                            <View style={{ backgroundColor: "#94E9B8", paddingLeft: 5, paddingRight: 5, borderRadius: 20 }}>
                                                <Text style={{ fontSize: 11, textAlign: "center" }}>{numberFormat(item.cost)}</Text>
                                            </View>
                                            <Text style={{ fontSize: 11, textAlign: "center" }}>{item.etd}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )} />
                    }
                </Loading>
                <View style={{ marginBottom: 50 }}></View>

                <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <View style={styles.overlay}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Cari Tujuan</Text>
                            <FormInput label={"Cari " + this.state.Src} placeholder={"Ketik alamat" + this.state.Src} onChange={(e) => this.handleCari(e)} />
                            <Loading show={this.state.Loading} >
                                {
                                    Data.length == 0 ? <EmptyState message="Tidak ada data" /> :
                                        <FlatList style={{ flex: 1 }} data={Data} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.itemWrapper} onPress={() => this.handlePilih(item.id, item.label)}>
                                                <View style={styles.itemLeft}>
                                                    <Text style={styles.itemText}>{item.label}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )} />
                                }
                            </Loading>
                            <Btn label="Batal" onClick={() => this.setState({ modalVisible: false })} icon="x-circle" />
                        </View>
                    </View>
                </Modal>
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%', // atau fix px
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        height: 500
    },
});
