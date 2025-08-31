import React, { Component, createRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { WsHost, Pesan2, domain, Icons, tanggalIndo } from '../../Module';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';

export default class ChatCS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Pesan: '',
            DataChat: []
        };
        this.socket = null;
        this.isManuallyClosed = false;
        this.scrollViewRef = React.createRef();
        this.typingTimeout = null;
    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.connectWebSocket();
        });
        this.blurListener = this.props.navigation.addListener('blur', () => {
            if (this.socket) {
                console.log('Closing WebSocket on blur');
                this.isManuallyClosed = true;   // tandai close manual
                this.socket.close();
                this.socket = null;
            }
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
        });
    }

    componentWillUnmount() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isManuallyClosed = true;
        }
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        if (this.focusListener) this.focusListener();
        if (this.blurListener) this.blurListener();
    }

    connectWebSocket = async () => {
        let Token = await AsyncStorage.getItem('token');
        this.socket = new WebSocket(`${WsHost}?token=${Token}&usertype=Admin&domain=${domain}`);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
            setTimeout(() => {
                this.socket.send(JSON.stringify({ type: "detail chat partner" }));
            }, 3000);
        };

        this.socket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            console.log(data);
            let type = data.type;
            if (type == "detail chat partner") {
                this.setState({ DataChat: data.Chat });
                setTimeout(() => {
                    this.scrollToBottom();
                }, 500);
            } else if (type == "pesan dari partner") {
                this.setState((prev) => ({
                    DataChat: [...prev.DataChat, { UserType: data.UserType, Pesan: data.Pesan, Waktu: data.Waktu }]
                }), this.scrollToBottom);
            }
        };

        this.socket.onerror = (e) => {
            console.log('WebSocket error:', e.message);
        };

        this.socket.onclose = (e) => {
            console.log('WebSocket closed:', e.code, e.reason);
            if (!this.isManuallyClosed) {
                console.log('Reconnecting WebSocket...');
                this.reconnectTimeout = setTimeout(() => {
                    this.connectWebSocket();
                }, 3000);
            }
        };
    };

    playSendSound = () => {
        const sound = new Sound('../assets/send.mp3', (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
            sound.play(() => {
                sound.release();
            });
        });
    }

    scrollToBottom = () => {
        if (this.scrollViewRef.current) {
            this.scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    handleSend = () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            if (this.state.Pesan.trim()) {
                this.socket.send(JSON.stringify({ type: "pesan ke partner", pesan: this.state.Pesan }));
                this.setState((prev) => ({
                    DataChat: [...prev.DataChat, { UserType: 'Client', Pesan: prev.Pesan, Waktu: Date.now() }],
                    Pesan: ''
                }), this.scrollToBottom);
            }
        }
    }

    handleKeyPress(e) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            if (e.key === 'Enter') {
                this.handleSend;
                if (this.typingTimeout) clearTimeout(this.typingTimeout);
                this.socket.send(JSON.stringify({ type: "stop_typing" }));
            } else {
                this.socket.send(JSON.stringify({ type: "typing" }));

                if (this.typingTimeout) clearTimeout(this.typingTimeout);
                this.typingTimeout = setTimeout(() => {
                    this.socket.send(JSON.stringify({ type: "stop_typing" }));
                }, 1500);
            }
        }
    }

    render() {
        let { DataChat, Pesan } = this.state;
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: 10 }}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <View style={{ marginRight: 30 }}>
                            <Icons name="arrow-left" size={20} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Customer Service</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <View style={{ marginLeft: 30 }}>
                            <Icons name="search" size={20} />
                        </View>
                    </TouchableOpacity>
                </View>

                <FlatList style={{ flex: 1 }} ref={this.scrollViewRef} data={DataChat} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => (
                    <View key={index} style={[styles.messageWrapper, item.UserType === "Admin" ? styles.messageUser : styles.messageAdmin]}>
                        <Text style={{ color: item.UserType == "Admin" ? "#000" : "#fefe" }}>{item.Pesan}</Text>
                        <Text style={[styles.timeText, { color: item.UserType == "Admin" ? "#000" : "#fefe" }]}>{tanggalIndo(item.Waktu, true)}</Text>
                    </View>
                )}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#fff', backgroundColor: "#fff" }}>
                    <TextInput
                        style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8 }}
                        placeholder="Tulis pesan..."
                        value={Pesan}
                        onKeyPress={(e) => this.handleKeyPress(e)}
                        onChangeText={(text) => this.setState({ Pesan: text })}
                    />
                    <TouchableOpacity onPress={this.handleSend} style={{ marginLeft: 10, marginRight: 10 }}>
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
        flex: 1,
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
