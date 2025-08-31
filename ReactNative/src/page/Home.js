import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions, ImageBackground } from "react-native";
import { Icons, Loading } from "../../Module";
import Swiper from 'react-native-swiper';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: {},
            Banner: [
                { id: 1, image: 'https://picsum.photos/800/300?random=1' },
                { id: 2, image: 'https://picsum.photos/800/300?random=2' },
                { id: 3, image: 'https://picsum.photos/800/300?random=3' },
            ],
            Loading: false
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
                        <Loading show={this.state.Loading} >
                            <Text style={styles.sectionTitle}>Promo</Text>
                            <View style={styles.menuRow}>
                                {menuData.map((item, i) => (
                                    <TouchableOpacity key={i} style={styles.menuItem}>
                                        <Image source={item.icon} style={styles.menuIcon} />
                                        <Text style={styles.menuText}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Untuk Anda</Text>
                                <Text style={styles.viewAll}>Lihat Semua</Text>
                            </View>

                            <View style={styles.menuRow}>
                                {cuisineData.map((item, i) => (
                                    <TouchableOpacity key={i} style={styles.menuItem}>
                                        <Image source={item.icon} style={styles.menuIcon} />
                                        <Text style={styles.menuText}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Special For You</Text>
                                <Text style={styles.viewAll}>View All</Text>
                            </View>
                        </Loading>
                    </View>
                </View>
            </ScrollView >
        );
    }
};

const menuData = [
    { title: "Near Me", icon: require('../assets/Promo1.png') },
    { title: "Big Promo", icon: require('../assets/Promo2.png') },
    { title: "Best Seller", icon: require('../assets/Promo3.png') },
    { title: "Budget Meal", icon: require('../assets/Promo4.png') },
    { title: "Healthy Food", icon: require('../assets/Promo5.png') },
    { title: "Open 24 Hours", icon: require('../assets/Promo6.png') },
    { title: "Popular Restaurant", icon: require('../assets/Promo7.png') },
    { title: "More", icon: require('../assets/PromoMore.png') },
];

const cuisineData = [
    { title: "Chicken", icon: require('../assets/Produk1.png') },
    { title: "Burger", icon: require('../assets/Produk2.png') },
    { title: "Pizza", icon: require('../assets/Produk3.png') },
    { title: "Bakery", icon: require('../assets/Produk4.png') },
    { title: "Salad", icon: require('../assets/Produk5.png') },
];

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
    },
});
