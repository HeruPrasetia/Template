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
            IconSave: "save",
            Loading: false,
            IconSearch: "search",
            modalVisible: false,
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

    async handleCekOngkir() {
        let sql = await api("tracking", { waybill: this.state.waybill, courier: this.state.courier });
        console.log(sql);
        if (sql.status == "sukses") {
            let Data = sql.data;
            let Manifest = Data.manifest;
            this.setState({ DataStatus: Manifest });
        }
    }

    render() {
        const { navigation } = this.props;
        let { Data, waybill, courier } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ marginBottom: 18, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icons name="arrow-left" size={20} />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cek Ongkir</Text>
                </View>
                <FormInput label="Kurir" placeholder="Silahkan pilih kurir" type="select" value={courier} onChange={(e) => this.setState({ courier: e })} data={[
                    { ID: "jne", Nama: "JNE" },
                    { ID: "sicepat", Nama: "SiCepat" },
                    { ID: "ide", Nama: "ID Express" },
                    { ID: "sap", Nama: "sap" },
                    { ID: "jnt", Nama: "J&T" },
                    { ID: "ninja", Nama: "Ninja" },
                    { ID: "tiki", Nama: "TIKI" },
                    { ID: "lion", Nama: "LION" },
                    { ID: "anteraja", Nama: "Anter Aja" },
                    { ID: "pos", Nama: "POS Indonesia" },
                    { ID: "ncs", Nama: "ncs" },
                    { ID: "rex", Nama: "rex" },
                    { ID: "rpx", Nama: "rpx" },
                    { ID: "sentral", Nama: "sentral" },
                    { ID: "star", Nama: "star" },
                    { ID: "wahana", Nama: "Wahana" },
                    { ID: "dse", Nama: "dse" }
                ]} />
                <FormInput label="No. Resi" placeholder="Masukan Nomor Resi" type="search" value={waybill} onChange={(e) => this.setState({ waybill: e })} />

                <Btn icon={this.state.IconSearch} label="Cek Resi" onClick={() => this.handleCekOngkir()} disabled={this.state.IconSearch == "search" ? false : true} />
                <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 18 }}>Status Pengiriman</Text>
                <Loading show={this.state.Loading} >
                    {
                        Data.length == 0 ? <EmptyState message="Tidak ada data" /> :
                            <FlatList style={{ flex: 1 }} data={Data} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
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
