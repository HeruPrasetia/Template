import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

export default class VoucherList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vouchers: [
                {
                    id: "1",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/HarperCollins_logo.svg/2560px-HarperCollins_logo.svg.png",
                    title: "HARPER COLLINS",
                    desc: "₹ 70 OFF",
                    days: "3 DAYS LEFT",
                },
                {
                    id: "2",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Maple_Leaf.svg",
                    title: "MAPLE PRESS",
                    desc: "BUY 1 GET 1 FREE",
                    days: "5 DAYS LEFT",
                },
                {
                    id: "3",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Hachette_Livre_logo.svg",
                    title: "HACHETTE LIVRE",
                    desc: "₹ 50 OFF",
                    days: "12 DAYS LEFT",
                },
                {
                    id: "4",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Fingerprint_logo.svg/768px-Fingerprint_logo.svg.png",
                    title: "FINGERPRINT",
                    desc: "₹ 30 OFF",
                    days: "22 DAYS LEFT",
                }
            ]
        };
    }

    renderVoucher = ({ item }) => (
        <View style={styles.card}>
            {/* Kiri */}
            <View style={styles.left}>
                <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
            </View>

            {/* Tengah */}
            <View style={styles.middle}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnText}>REDEEM</Text>
                </TouchableOpacity>
            </View>

            {/* Kanan */}
            <View style={styles.right}>
                <Text style={styles.days}>{item.days}</Text>
            </View>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.vouchers}
                    renderItem={this.renderVoucher}
                    keyExtractor={(item) => item.id}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 12,
        padding: 12,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    left: {
        flex: 1,
        alignItems: "center",
    },
    logo: {
        width: 50,
        height: 50,
    },
    middle: {
        flex: 3,
        paddingHorizontal: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 4,
    },
    desc: {
        fontSize: 13,
        color: "#333",
        marginBottom: 6,
    },
    btn: {
        backgroundColor: "#ff9800",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    btnText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    right: {
        flex: 1,
        alignItems: "flex-end",
    },
    days: {
        fontSize: 12,
        color: "#999",
    },
});
F