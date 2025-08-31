import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { Icons, Loading, Pesan2, api, colorScheme } from '../../Module';
import FormInput from './FormInput';
import Btn from './Btn';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from './EmptyPage';
import InputHashtag from './InputTag'

export default class FormEditProfile extends Component {
    constructor(props) {
        super(props);
        const { Data, Device } = props.route.params;
        this.state = {
            DataDevice: Device,
            ID: Data.ID || "",
            DeviceID: Data.DeviceID || 0,
            Nama: Data.Nama || "",
            Jadwal: Data.Jadwal || "",
            JenisJadwal: Data.JenisJadwal || "",
            Tanggal: Data.Tanggal || new Date(),
            Jam: Data.Jam || "07:00",
            TermDate: Data.TermDate || new Date(),
            Triger: Data.Triger || "Pelanggan Tidak Menjawab",
            Pesan: Data.Pesan || "",
            Attach: Data.Attach || "",
            DataKontak: Data.DataKontak || "Semua",
            Kontak: Data.Kontak || [],
            LabelKontak: Data.LabelKontak || "",
            Status: Data.Status || "Draft",
            Loading: false,
            IconSave: "save",
            Data: [],
            IsSearch: false
        };
    }

    handleSave = async (e) => {
        this.setState({ IconSave: "loader" });
        let { ID, PerusahaanID, DeviceID, Nama, Jadwal, JenisJadwal, Tanggal, Jam, TermDate, Triger, Pesan, Attach, DataKontak, Kontak, LabelKontak, Status } = this.state;
        let sql = await api("crudblash", { ID, PerusahaanID, DeviceID, Nama, Jadwal, JenisJadwal, Tanggal, Jam, TermDate, Triger, Pesan, Attach, DataKontak, Kontak: JSON.stringify(Kontak), LabelKontak, Status, act: ID == "" ? "tambah" : "edit" });
        if (sql.status == "sukses") {
            Pesan2(sql.pesan, "Selamat");
            this.props.navigation.navigate("/blash");
        } else {
            this.setState({ IconSave: "save" });
            Pesan2(sql.pesan, "Gagal", 'error');
        }
    }

    async handleCari() {
        let { Search, Jenis, NextToken } = this.state;
        if (Search == "") return Pesan2("Silahkan masukan keyword", "Peringatan", "error");
        this.setState({ Loading: true, IconSearch: "loader" });
        let sql = await api("scrap", { search: Search, type: Jenis, NextToken });
        if (sql.status == "sukses") {
            this.setState({ Data: sql.data, NextToken: sql.NextToken, IconSearch: "search", Loading: false })
        }
    }

    async handleGetKontak() {
        let sql = await api("datakontak", {});
        if (sql.status == "sukses") this.setState({ Kontak: sql.data, Data: sql.data, DataKontak: "Sebagian" });
    }

    handleCari(val) {
        const { Data } = this.state;

        const filtered = Data.filter(item =>
            item.Nama.toLowerCase().includes(val.toLowerCase())
        );

        this.setState({ Kontak: filtered, Search: val });
    }

    modalDelete = () => {
        Alert.alert(
            "Konfirmasi Hapus",
            "Apakah kamu yakin mau hapus data ini?",
            [
                { text: "Batal", style: "cancel" },
                { text: "Hapus", style: "destructive", onPress: () => this.handleData() }
            ]
        );
    };

    async handleData() {
        let sql = await api('crudblash', { act: "hapus", ID: this.state.ID });
        if (sql.status == "sukses") {
            Pesan2(sql.pesan, "Berhasil");
            this.props.navigation.navigate("/blash");
        } else {
            Pesan2(sql.pesan, "Berhasil", "error");
        }
    }

    handleRenderHeader() {
        let { ID, IsSearch, DeviceID, Nama, Jadwal, JenisJadwal, Tanggal, Jam, TermDate, Triger, Pesan, Attach, DataKontak, Kontak, LabelKontak, Status } = this.state;
        return (
            <Fragment>
                <FormInput label="Device" placeholder="Silahkan pilih Device" type="select" value={DeviceID} onChange={(e) => this.setState({ Device: e })} data={this.state.DataDevice} require />
                <FormInput label="Nama Campaign" placeholder="Silahkan masukan nama campaign" value={Nama} onChange={(e) => this.setState({ Nama: e })} require />
                <FormInput label="Jenis Campaign" type="select" placeholder="Silahkan tentukan jenis campaign" value={Jadwal} onChange={(e) => this.setState({ Jadwal: e })} require data={[
                    { ID: "Follow Up", Nama: "Follow Up" },
                    { ID: "Jadwal", Nama: "Jadwal" },
                ]} />
                {
                    Jadwal == "Jadwal" ?
                        <Fragment>
                            <FormInput label="Tanggal" type="date" placeholder="Silahkan tentukan Tanggal" value={Tanggal} onChange={(e) => this.setState({ Tanggal: e })} require />
                            <FormInput label="Jam" type="time" placeholder="Silahkan tentukan Jam" value={Jam} onChange={(e) => this.setState({ Jam: e })} require />
                        </Fragment> :
                        <Fragment>
                            <FormInput label="Triger Follow UP" type="select" placeholder="Silahkan tentukan triger" value={Triger} onChange={(e) => this.setState({ Triger: e })} require data={[
                                { ID: "Pelanggan Tidak Response", Nama: "Pelanggan Tidak Response" },
                                { ID: "Jatuh Tempo Pelanggan", Nama: "Jatuh Tempo Pelanggan" },
                            ]} />
                            <FormInput label="Waktu Follow UP" type="select" placeholder="Silahkan tentukan waktu" value={JenisJadwal} onChange={(e) => this.setState({ JenisJadwal: e })} require data={[
                                { ID: "Jam", Nama: "Jam" },
                                { ID: "Hari", Nama: "Hari" },
                                { ID: "Minggu", Nama: "Minggu" },
                            ]} />
                            <FormInput label={`Berapa ${JenisJadwal} Sebelum`} type="number" placeholder="Silahkan tentukan termdate" value={TermDate} onChange={(e) => this.setState({ TermDate: e })} require />
                        </Fragment>
                }
                <FormInput type="textarea" label="Pesan" placeholder="Silahkan masukan pesan broadcast" value={Pesan} onChange={(e) => this.setState({ Pesan: e })} require />
                <FormInput label="Status" type="select" placeholder="Silahkan tentukan status" value={Status} onChange={(e) => this.setState({ Status: e })} require data={[
                    { ID: "Aktif", Nama: "Aktif" },
                    { ID: "Draft", Nama: "Draft" },
                    { ID: "Selesai", Nama: "Selesai" },
                    { ID: "Batal", Nama: "Batal" },
                ]} />
                <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Target</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingBottom: 5 }}>
                    <TouchableOpacity onPress={() => this.setState({ DataKontak: "Semua", Kontak: [] })}>
                        <View style={{ backgroundColor: DataKontak == "Semua" ? "#691e82" : "#D4DEF1", padding: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                            <Text style={{ color: DataKontak == "Semua" ? "#fafafa" : "#691e82", fontSize: 14 }}>Semua</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleGetKontak()}>
                        <View style={{ backgroundColor: DataKontak == "Sebagian" ? "#691e82" : "#D4DEF1", padding: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                            <Text style={{ color: DataKontak == "Sebagian" ? "#fafafa" : "#691e82", fontSize: 14 }}>Sebagian</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ DataKontak: "Label", Kontak: [] })}>
                        <View style={{ backgroundColor: DataKontak == "Label" ? "#691e82" : "#D4DEF1", padding: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                            <Text style={{ color: DataKontak == "Label" ? "#fafafa" : "#691e82", fontSize: 14 }}>Label</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        DataKontak == "Sebagian" &&
                        <TouchableOpacity onPress={() => this.setState({ IsSearch: true })} style={{ paddingLeft: 20 }}>
                            <Icons name="search" size={20} />
                        </TouchableOpacity>
                    }
                </View>
                {
                    DataKontak == "Sebagian" && IsSearch == true && <FormInput type="search" placeholder="Cari Nama Kontak" onChange={(e) => this.handleCari(e)} onClose={() => this.setState({ IsSearch: false })} />
                }
                {
                    DataKontak == "Label" && <InputHashtag placeholder="Masukkan hashtag..." value={LabelKontak} onChange={(e) => this.setState({ LabelKontak: e })} />
                }
            </Fragment>
        )
    }

    render() {
        const { navigation } = this.props;
        let { ID, IsSearch, DeviceID, Nama, Jadwal, JenisJadwal, Tanggal, Jam, TermDate, Triger, Pesan, Attach, DataKontak, Kontak, LabelKontak, Status } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icons name="arrow-left" size={20} />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{ID == "" ? "Tambah Campaign" : "Edit Campaign"}</Text>
                    </View>
                    {
                        ID != "" && <Btn type="icon" icon="trash-2" color="#910000ff" label="Hapus" size={25} onClick={() => this.modalDelete()} />
                    }
                </View>

                <Loading show={this.state.Loading} >
                    <FlatList
                        style={{ flex: 1, paddingTop: 18 }}
                        data={Kontak}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <EmptyState message="Tidak ada kontak" />
                        )}
                        ListHeaderComponent={() => this.handleRenderHeader()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={styles.itemWrapper}>
                                <View style={styles.itemLeft}>
                                    <Image
                                        source={require("../assets/user.png")}
                                        style={{ width: 50, height: 50, borderRadius: 30 }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemText}>{item.Nama}</Text>
                                        <Text style={{ color: "#4f5e7b", fontSize: 12 }}>{item.Telp}</Text>
                                    </View>
                                    <View>
                                        <FormInput
                                            type="switch"
                                            margin={0}
                                            value={item.checked}
                                            onChange={(e) => {
                                                let Kontak = [...this.state.Kontak]; // copy biar aman
                                                Kontak[index].checked = e ? 1 : 0;
                                                this.setState({ Kontak });
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </Loading>
                <Btn type="floating" onClick={this.handleSave} icon={this.state.IconSave} disabled={this.state.IconSave == "save" ? false : true} />
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
});
