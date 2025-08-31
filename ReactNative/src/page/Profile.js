import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: "BOS GAMER",
                memberId: "ID123456",
                totalPoin: 250,
            },
            history: [
                { id: 1, desc: "Redeem Voucher Makanan", poin: -50, date: "2025-08-10" },
                { id: 2, desc: "Redeem Pulsa 10k", poin: -100, date: "2025-08-12" },
                { id: 3, desc: "Topup dari Event", poin: +150, date: "2025-08-20" },
            ],
        };
    }

    render() {
        const { user, history } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {/* Member Card */}
                    <LinearGradient
                        colors={["#850606ff", "#ff3d3d"]}
                        style={styles.memberCard}
                    >
                        <Text style={styles.memberTitle}>Member Card</Text>
                        <Text style={styles.memberName}>{user.name}</Text>
                        <Text style={styles.memberId}>#{user.memberId}</Text>
                    </LinearGradient>

                    {/* Total Poin */}
                    <View style={styles.pointBox}>
                        <Text style={styles.pointLabel}>Total Poin</Text>
                        <Text style={styles.pointValue}>{user.totalPoin}</Text>
                    </View>

                    {/* History */}
                    <View style={styles.historyBox}>
                        <Text style={styles.historyTitle}>History Pemakaian Poin</Text>
                        {history.map((item) => (
                            <View key={item.id} style={styles.historyItem}>
                                <View>
                                    <Text style={styles.historyDesc}>{item.desc}</Text>
                                    <Text style={styles.historyDate}>{item.date}</Text>
                                </View>
                                <Text
                                    style={[
                                        styles.historyPoin,
                                        { color: item.poin > 0 ? "green" : "red" },
                                    ]}
                                >
                                    {item.poin > 0 ? `+${item.poin}` : item.poin}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6",
    },
    memberCard: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
        elevation: 4,
    },
    memberTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    memberName: {
        color: "white",
        fontSize: 22,
        marginTop: 8,
    },
    memberId: {
        color: "white",
        fontSize: 14,
        marginTop: 4,
    },
    pointBox: {
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    pointLabel: {
        fontSize: 16,
        color: "#666",
    },
    pointValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ff3d3d",
    },
    historyBox: {
        margin: 16,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    historyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    historyDesc: {
        fontSize: 14,
    },
    historyDate: {
        fontSize: 12,
        color: "#888",
    },
    historyPoin: {
        fontSize: 16,
        fontWeight: "bold",
    },
});