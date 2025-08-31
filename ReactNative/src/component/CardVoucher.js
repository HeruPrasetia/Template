import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { numberFormat } from "../../Module";

export default class CardVoucher extends Component {
    render() {
        const { data } = this.props;
        return (
            <TouchableOpacity style={styles.card}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: data.Image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.eventText}>{data.Kategori}</Text>
                    <Text style={styles.titleText}>{data.Nama}</Text>
                    <View style={styles.priceRow}>
                        <Image
                            source={require('../assets/coin.png')}
                            style={styles.coinIcon}
                        />
                        <Text style={styles.coinText}>{numberFormat(data.Nilai)}</Text>
                    </View>

                    <View style={styles.progressWrapper}>
                        <View style={styles.progressBackground}>
                            <LinearGradient
                                colors={["#FFA500", "#FF0000"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.progressFill, { width: `${data.Sisa}%` }]}
                            />
                        </View>
                    </View>

                    <Text style={styles.status}>{data.Status}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        width: 220,
        borderRadius: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
    },
    labelContainer: {
        flex: 1,
        backgroundColor: "#8E44AD",
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    labelText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    labelSub: {
        color: "#fff",
        fontSize: 10,
        marginTop: 4,
    },
    image: {
        width: "100%",
        height: 120,
    },
    content: {
        padding: 12,
    },
    eventText: {
        color: "gray",
        fontSize: 12,
    },
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        marginVertical: 4,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
    },
    coinIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
    },
    coinText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    progressWrapper: {
        marginTop: 8,
    },
    progressBackground: {
        width: "100%",
        height: 8,
        borderRadius: 5,
        backgroundColor: "#eee",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 5,
    },
    status: {
        fontSize: 12,
        marginTop: 4,
        color: "red",
        fontWeight: "600",
    },
});
