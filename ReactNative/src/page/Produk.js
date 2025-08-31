import React, { Component, Fragment } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Dimensions, ImageBackground } from "react-native";
import { Icons, Loading } from "../../Module";
import Swiper from 'react-native-swiper';
import CardProduk from '../component/CardProduk.js';
import EmptyState from "../component/EmptyPage.js";

export default class Produk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: {},
            Data: [
                { id: 1, Nama: "Burger Two Go", Link: "https://shopee.com", IsPromo: true, Kategori: "Satai, Chicken, Meat", Harga: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner1.jpg', Rating: "4.5", JumlahRatting: 20000, },
                { id: 2, Nama: "Burger Two Go", Link: "https://shopee.com", IsPromo: false, Kategori: "Satai, Chicken, Meat", Harga: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner2.jpg', Rating: "4.5", JumlahRatting: 20000, },
                { id: 3, Nama: "Burger Two Go", Link: "https://shopee.com", IsPromo: false, Kategori: "Satai, Chicken, Meat", Harga: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner3.jpg', Rating: "4.5", JumlahRatting: 20000, },
                { id: 3, Nama: "Burger Two Go", Link: "https://shopee.com", IsPromo: false, Kategori: "Satai, Chicken, Meat", Harga: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner3.jpg', Rating: "4.5", JumlahRatting: 20000, },
                { id: 3, Nama: "Burger Two Go", Link: "https://shopee.com", IsPromo: false, Kategori: "Satai, Chicken, Meat", Harga: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner3.jpg', Rating: "4.5", JumlahRatting: 20000, },
                { id: 3, Nama: "Burger Two Go", Link: "https://shopee.com", IsPromo: false, Kategori: "Satai, Chicken, Meat", Harga: 20000, Image: 'https://apis.naylatools.com/file/bernardi/Banner3.jpg', Rating: "4.5", JumlahRatting: 20000, },
            ],
            Loading: false,
            LoadingMore: false
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

    async handleLoadMore() {
        console.log("hallo");
    }

    render() {
        let { Data } = this.state;
        return (
            <Loading show={this.state.Loading} >
                <View style={{ backgroundColor: "#fff", flex: 1 }}>
                    <FlatList style={{ flex: 1 }}
                        data={Data}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, i }) => (
                            <CardProduk data={item} key={i} />
                        )}
                        ListHeaderComponent={
                            <View style={styles.container}>
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
                                                <ImageBackground source={require('../assets/Banner1.jpg')} style={styles.image} resizeMode="cover">
                                                    <Text style={styles.caption}>Promo Spesial Hari Ini 🎉</Text>
                                                </ImageBackground>
                                            </View>
                                            <View style={styles.slide}>
                                                <ImageBackground source={require('../assets/Banner2.jpg')} style={styles.image} resizeMode="cover">
                                                    <Text style={styles.caption}>Promo Spesial Hari Ini 🎉</Text>
                                                </ImageBackground>
                                            </View>
                                            <View style={styles.slide}>
                                                <ImageBackground source={require('../assets/Banner3.jpg')} style={styles.image} resizeMode="cover">
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
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'top', gap: 10, paddingBottom: 5 }}>
                                                <TouchableOpacity>
                                                    <View style={{ backgroundColor: "#F7F7F7", padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 20 }}>
                                                        <Icons name="sliders" />
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity>
                                                    <View style={{ backgroundColor: "#F7F7F7", padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                                                        <Text>Kategori</Text>
                                                        <Icons name="chevron-down" />
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity>
                                                    <View style={{ backgroundColor: "#F7F7F7", padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 20 }}>
                                                        <Text>Ratting</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity>
                                                    <View style={{ backgroundColor: "#F7F7F7", padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 20 }}>
                                                        <Text>Promo</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        }
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            this.state.LoadingMore && (
                                <Loading show={true}>
                                    {
                                        [1, 2, 3, 4, 5].map((item, i) => {
                                            return <CardProduk data={item} key={i} />
                                        })
                                    }
                                </Loading>
                            )
                        }
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                </View>
            </Loading>
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
