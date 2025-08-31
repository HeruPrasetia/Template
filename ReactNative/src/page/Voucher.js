import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions, ImageBackground } from "react-native";
import { Icons } from "../../Module";
import Swiper from 'react-native-swiper';
import CardVoucher from '../component/CardVoucher.js';

export default class Produk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: {},
            DataVoucher: [
                { id: 1, Nama: "Burger Two Go", Link: "https://shopee.com", Kategori: "Satai", Nilai: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner1.jpg', Sisa: 100, Status: "Aktif" },
                { id: 2, Nama: "Burger Two Go", Link: "https://shopee.com", Kategori: "Chicken", Nilai: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner2.jpg', Sisa: 20, Status: "Aktif" },
                { id: 3, Nama: "Burger Two Go", Link: "https://shopee.com", Kategori: "Meat", Nilai: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner3.jpg', Sisa: 10, Status: "Aktif" },
            ]
        };
    }

    async componentDidMount() {
        // try {
        //     let Profile = await cekProfile();
        //     this.setState({ Profile: Profile.data });
        // } catch (e) {
        //     console.error('Gagal load profile:', e);
        // }
    }

    render() {
        const { width } = Dimensions.get('window');
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, backgroundColor: "#E60000", borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }}>
                    <View style={styles.header}>
                        <View style={styles.locationWrapper}>
                            <Icons name="map-pin" size={16} color="#E60000" />
                            <Text style={styles.location}>JL. Kampung Melon No. 32</Text>
                        </View>
                        <TouchableOpacity style={styles.bellWrapper}>
                            <Icons name="bell" size={20} color="#E60000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.hero}>
                        <Swiper autoplay={true} showsPagination={true} autoplayTimeout={5} height={290}>
                            <View style={styles.slide}>
                                <ImageBackground
                                    source={require('../assets/Banner1.jpg')}
                                    style={styles.image}
                                    resizeMode="cover"
                                >
                                    <Text style={styles.caption}>Promo Spesial Hari Ini 🎉</Text>
                                </ImageBackground>
                            </View>
                            <View style={styles.slide}>
                                <ImageBackground
                                    source={require('../assets/Banner2.jpg')}
                                    style={styles.image}
                                    resizeMode="cover"
                                >
                                    <Text style={styles.caption}>Promo Spesial Hari Ini 🎉</Text>
                                </ImageBackground>
                            </View>
                            <View style={styles.slide}>
                                <ImageBackground
                                    source={require('../assets/Banner3.jpg')}
                                    style={styles.image}
                                    resizeMode="cover"
                                >
                                    <Text style={styles.caption}>Promo Spesial Hari Ini 🎉</Text>
                                </ImageBackground>
                            </View>
                        </Swiper>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{ position: "absolute", top: -40, flexDirection: "row", alignItems: "center", alignSelf: "center", elevation: 3 }}>
                        <View style={styles.searchBox}>
                            <Icons name="search" size={18} color="#aaa" />
                            <TextInput placeholder="Makan apa hari ini?" style={styles.searchInput} />
                        </View>
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Text style={styles.sectionTitle}>Promo Hari ini</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginTop: 10, marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'top', gap: 15, paddingBottom: 5 }}>
                                {
                                    this.state.DataVoucher.map((item, i) => {
                                        return <CardVoucher data={item} key={i} />
                                    })
                                }
                            </View>
                        </ScrollView>
                        <Text style={styles.sectionTitle}>Promo Untuk anda</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'top', gap: 15, paddingBottom: 5 }}>
                                {
                                    this.state.DataVoucher.map((item, i) => {
                                        return <CardVoucher data={item} key={i} />
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={{ marginBottom: 100 }} />
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: { marginTop: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#E60000", paddingHorizontal: 16, },
    time: { color: "#fff", fontSize: 16, position: "absolute", top: -20 },
    locationWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", padding: 8, borderRadius: 20 },
    location: { color: "#E60000", marginLeft: 4 },
    bellWrapper: { backgroundColor: "#fff", padding: 8, borderRadius: 20 },
    hero: { marginTop: 20, flexDirection: "row", alignItems: "center" },
    heroText: { fontSize: 22, fontWeight: "bold", color: "#E60000", flex: 1 },
    heroImage: { width: 100, height: 100, resizeMode: "contain" },
    searchBox: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", borderRadius: 30, paddingHorizontal: 12, marginVertical: 20, shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    searchInput: { flex: 1, marginLeft: 8 },
    menuRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    menuItem: { width: "22%", alignItems: "center", marginVertical: 10 },
    menuIcon: { width: 50, height: 50, marginBottom: 8 },
    menuText: { fontSize: 12, textAlign: "center" },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold" },
    viewAll: { color: "#E60000", fontSize: 14 },
    slide: {
        flex: 1,
        paddingHorizontal: 10
    },
    image: {
        width: '100%',
        height: 250,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderRadius: 15,
    },
    caption: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
    }
});
