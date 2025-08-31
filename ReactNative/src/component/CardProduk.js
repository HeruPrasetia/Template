import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { numberFormat, Icons } from "../../Module";

export default class CardProduk extends Component {
    render() {
        const { data } = this.props;

        return (
            <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(data.Link)}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: data.Image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    {data.IsPromo &&
                        <View style={styles.badge}>
                            <Icons name="tag" size={14} color="#fff" />
                            <Text style={styles.badgeText}> Promo</Text>
                        </View>
                    }
                </View>

                <View style={styles.info}>
                    <Text style={styles.title}>{data.Nama}</Text>
                    <Text style={styles.category}>{data.Kategori}</Text>

                    <View style={styles.row}>
                        <Icons name="truck" size={16} color="green" />
                        <Text style={styles.price}> Rp {numberFormat(data.Harga)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Icons name="clock" size={16} color="red" />
                        <Text style={styles.desc}> 20 min • 1.2 km</Text>
                    </View>

                    <View style={styles.row}>
                        <Icons name="star" size={16} color="orange" />
                        <Text style={styles.desc}> {data.Rating} • {data.JumlahRating}+ ratings</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginHorizontal: 10
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    badge: {
        position: "absolute",
        bottom: 8,
        left: 8,
        flexDirection: "row",
        backgroundColor: "red",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignItems: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
    },
    category: {
        fontSize: 12,
        color: "gray",
        marginBottom: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: "green",
    },
    desc: {
        fontSize: 12,
        color: "gray",
    },
});
