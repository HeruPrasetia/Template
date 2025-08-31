import React, { Component, createRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, Icons, Pesan2, tanggalIndo } from '../../Module';

export default class DetailChat extends Component {
    constructor(props) {
        super(props);
        const { Data } = props.route.params;
        this.state = {
            DataChat: [
                { Waktu: "2025-01-01 06:01:00", UserType: "User", IsAi: 0, Pesan: "hallo" },
                { Waktu: "2025-01-01 06:01:00", UserType: "Admin", IsAi: 1, Pesan: "hallo juga heru" },
                { Waktu: "2025-01-01 06:01:00", UserType: "User", IsAi: 0, Pesan: "hallo" },
                { Waktu: "2025-01-01 06:01:00", UserType: "Admin", IsAi: 1, Pesan: "hallo juga heru" },
                { Waktu: "2025-01-01 06:01:00", UserType: "User", IsAi: 0, Pesan: "hallo" },
                { Waktu: "2025-01-01 06:01:00", UserType: "Admin", IsAi: 1, Pesan: "hallo juga heru" },
            ],
            Detail: Data,
            ID: Data.ID,
            Loading: true,
            refreshing: false,
            Pesan: "",
            Device: {}
        };
        this.scrollViewRef = React.createRef();
    }

    async componentDidMount() {
        let sql = await api("historychat", { Telp: this.state.Detail.Telp, ID: this.state.Detail.DeviceID });
        if (sql.status == "sukses") this.setState({ DataChat: sql.data, Device: sql.Device, Loading: false }, () => {
            this.scrollToBottom();
        });
    }

    scrollToBottom = () => {
        this.scrollViewRef.current?.scrollToEnd({ animated: true });
    }

    async handleKirimPesan() {
        if (this.state.Pesan != "") {
            let sql = await api("send", { Telp: this.state.Device.Telp, number: this.state.Detail.Telp, message: this.state.Pesan })
            if (sql.status == "sukses") {
                let DataChat = this.state.DataChat;
                DataChat.push({ Waktu: Date.now(), Pesan: this.state.Pesan, UserTpe: "Admin" });
                this.setState({ DataChat, Pesan: "" }, () => {
                    this.scrollToBottom();
                });
            } else {
                Pesan2(sql.pesan, "Gagal", "error");
            }
        } else {
            Pesan2("Silahkan isi pesan", "Maaf", "error");
        }
    }

    render() {
        const { navigation } = this.props;
        let { DataChat, Detail } = this.state;
        if (this.state.Loading == true) {
            return (
                <SafeAreaView>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <View style={{ marginRight: 30 }}>
                                    <Icons name="arrow-left" size={20} />
                                </View>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{Detail.Nama}</Text>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <View style={{ marginLeft: 30 }}>
                                    <Icons name="search" size={20} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <SkeletonPlaceholder borderRadius={4}>
                            {DataChat.map((item, index) => {
                                const isUser = item.UserType === "User";
                                return (
                                    <View key={index} style={[styles.messageWrapper, isUser ? styles.messageUser : styles.messageAdmin]}>
                                        <View style={{ width: 150, height: 50 }} />
                                    </View>
                                );
                            })}
                        </SkeletonPlaceholder>
                    </ScrollView >
                </SafeAreaView>
            )
        }
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10 }}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <View style={{ marginRight: 30 }}>
                            <Icons name="arrow-left" size={20} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{Detail.Nama}</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <View style={{ marginLeft: 30 }}>
                            <Icons name="search" size={20} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Chat list */}
                <ScrollView
                    contentContainerStyle={styles.container}
                    ref={this.scrollViewRef}
                >
                    {DataChat.map((item, index) => {
                        const isUser = item.UserType === "Client";
                        return (
                            <View key={index} style={[styles.messageWrapper, isUser ? styles.messageUser : styles.messageAdmin]}>
                                <Text style={{ color: isUser ? "#000" : "#fefe" }}>{item.Pesan}</Text>
                                <Text style={[styles.timeText, { color: isUser ? "#000" : "#fefe" }]}>{tanggalIndo(item.Waktu, true)}</Text>
                            </View>
                        );
                    })}
                </ScrollView>

                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#fff', backgroundColor: "#fff" }}>
                    <TextInput
                        style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8 }}
                        placeholder="Tulis pesan..."
                        value={this.state.Pesan}
                        onChangeText={(text) => this.setState({ Pesan: text })}
                    />
                    <TouchableOpacity onPress={() => this.handleKirimPesan()} style={{ marginLeft: 10, marginRight: 10 }}>
                        <Icons name="send" size={24} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 55 }} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    messageWrapper: {
        maxWidth: '70%',
        borderRadius: 10,
        padding: 10,
        marginVertical: 4,
    },
    messageUser: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5ea',
    },
    messageAdmin: {
        alignSelf: 'flex-end',
        backgroundColor: '#4555e0ff',
    },
    timeText: {
        fontSize: 10,
        color: '#555',
        marginTop: 4,
        textAlign: 'right',
    },
});
