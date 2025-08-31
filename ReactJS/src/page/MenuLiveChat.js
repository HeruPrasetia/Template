import React, { Component } from 'react';
import { DivAksesDitolak, tanggalIndo, DivExpired } from '../Modul';
import { DxFormInput } from '../component/FormInput';
import SocketContext from '../SocketContext';
const audio = new Audio(require('../assets/bell.mp3'));

export default class Chat extends Component {
    static contextType = SocketContext;
    constructor(props) {
        super(props);
        this.state = {
            ListChat: [],
            DataChat: [],
            UserID: 0,
            Pesan: '',
            SysAkses: {},
            PerusahaanID: 0
        };
        this.reconnectTimeout = null;
        this.isManuallyClosed = false;
        this.chatBodyRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => this.connectWebSocket(), 3000);
    }

    handleLastChat = () => {
        if (this.chatBodyRef.current) {
            this.chatBodyRef.current.scrollTop = this.chatBodyRef.current.scrollHeight;
        }
    }

    connectWebSocket = () => {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        if (socket) {
            socket.send(JSON.stringify({ type: 'list chat partner' }));

            socket.onmessage = (e) => {
                let data = JSON.parse(e.data);
                let type = data.type;
                console.log(data);
                if (data.status == "gagal") socket.send(JSON.stringify({ type: 'list chat partner' }));

                if (type === 'detail chat partner') {
                    this.setState({ DataChat: data.Chat });
                } else if (type === 'pesan dari client partner') {
                    if (data.UserID == this.state.UserID) {
                        this.setState((prev) => ({
                            DataChat: [...prev.DataChat, data],
                        }), this.handleLastChat);
                    } else {
                        audio.play();
                        this.setState((prev) => {
                            const index = prev.ListChat.findIndex(item => item.UserID === data.UserID);
                            if (index === -1) {
                                return {
                                    ListChat: [
                                        ...prev.ListChat,
                                        {
                                            UserID: data.UserID,
                                            Name: data.Name || `User ${data.UserID}`,
                                            Pesan: data.Pesan,
                                            Waktu: data.Waktu,
                                            Unread: 1
                                        }
                                    ]
                                };
                            } else {
                                const newList = [...prev.ListChat];
                                newList[index] = {
                                    ...newList[index],
                                    Unread: (newList[index].Unread || 0) + 1,
                                    Pesan: data.Pesan,
                                    Waktu: data.Waktu
                                };
                                return { ListChat: newList };
                            }
                        }, this.handleLastChat);
                    }
                } else if (type === 'typing') {
                    if (data.UserID == this.state.UserID) {
                        // misalnya kamu mau nambah data typing juga, tapi sepertinya tidak perlu
                    } else {
                        this.setState((prev) => {
                            const index = prev.ListChat.findIndex(item => item.UserID === data.UserID);
                            if (index === -1) {
                                return {
                                    ListChat: [
                                        ...prev.ListChat,
                                        {
                                            UserID: data.UserID,
                                            Name: data.Name || `User ${data.UserID}`,
                                            Unread: 0,
                                            IsTyping: 1
                                        }
                                    ]
                                };
                            } else {
                                const newList = [...prev.ListChat];
                                newList[index] = {
                                    ...newList[index],
                                    IsTyping: 1
                                };
                                return { ListChat: newList };
                            }
                        });
                    }
                } else if (type === 'stop_typing') {
                    if (data.UserID == this.state.UserID) {
                        // misalnya kamu mau nambah data typing juga, tapi sepertinya tidak perlu
                    } else {
                        this.setState((prev) => {
                            const index = prev.ListChat.findIndex(item => item.UserID === data.UserID);
                            if (index === -1) {
                                return {
                                    ListChat: [
                                        ...prev.ListChat,
                                        {
                                            UserID: data.UserID,
                                            Name: data.Name || `User ${data.UserID}`,
                                            Unread: 0,
                                            IsTyping: 0
                                        }
                                    ]
                                };
                            } else {
                                const newList = [...prev.ListChat];
                                newList[index] = {
                                    ...newList[index],
                                    IsTyping: 0
                                };
                                return { ListChat: newList };
                            }
                        });
                    }
                } else if (type === 'list chat partner') {
                    this.setState({ ListChat: data.Kontak })
                }
            };
        }
    };

    handleDetailChat(data) {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        this.setState((prev) => {
            const newList = prev.ListChat.map(item => {
                if (item.UserID === data.UserID) {
                    return { ...item, Unread: 0 };
                }
                return item;
            });
            return {
                UserID: data.UserID,
                ListChat: newList
            };
        }, () => {
            if (socket) {
                socket.send(JSON.stringify({ type: 'detail chat partner', UserID: data.UserID }));
            }
        });
    }


    handleKeyDown = (e) => {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        if (e.key === 'Enter') {
            if (socket) this.handleSend();
        } else {
            if (socket) socket.send(JSON.stringify({ type: "typing" }));
        }
    }

    handleSend = () => {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        if (this.state.Pesan.trim()) {
            socket.send(JSON.stringify({ type: "pesan ke client partner", pesan: this.state.Pesan, UserID: this.state.UserID }));
            this.setState((prev) => ({
                DataChat: [...prev.DataChat, { UserType: 'Admin', Pesan: prev.Pesan, Waktu: Date.now() }],
                Pesan: ''
            }), this.handleLastChat);
        }
    };

    handleFilter(e) {
        let List = this.state.ListChat;
        let val = e.target.value.toLowerCase();
        List.filter((edt) =>
            edt.Nama && edt.Nama.toLowerCase().includes(val)
        );
        this.setState({ ListChat: List });
    }

    handleUvuv() {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify({ type: "uvuv" }));
    }

    render() {
        let { ListChat, UserID, DataChat } = this.state;
        return (
            <div className="main-body">
                {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                    this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                        <div className="div-content mt-1">
                            <div className="main-title col-md-9 mb-2">Live Chat</div>
                            <div className="container-fluid h-100">
                                <div className="row h-100">
                                    <div className="col-4 col-md-3 chat-list p-0">
                                        <div className='input-group'>
                                            <DxFormInput type='search' placeholder='Cari nama...' />
                                            <button className='btn btn-default' onClick={() => this.handleUvuv()}><i className='fas fa-search' /></button>
                                        </div>
                                        <p></p>
                                        <div className="list-group list-group-flush">
                                            {
                                                ListChat.map((item, i) => {
                                                    return (
                                                        <a href="#" className={UserID == item.UserID ? "list-group-item list-group-item-action active chat-item" : "list-group-item list-group-item-action chat-item"} key={i} onClick={(e) => this.handleDetailChat(item)}>
                                                            <div className="d-flex justify-content-between">
                                                                <div><strong>{item.Nama}</strong></div>
                                                                <small className="text-muted">{tanggalIndo(item.Waktu)}</small>
                                                            </div>
                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                <div className="text-muted small">{item.IsTyping == 0 ? item.Pesan : "Mengetik ..."}</div>
                                                                {item.Unread == 0 ? "" : <div className='badge bg-primary'>{item.Unread}</div>}
                                                            </div>
                                                        </a>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                    <div className="col-8 col-md-9 d-flex flex-column p-0">
                                        <div className="chat-messages d-flex flex-column" ref={this.chatBodyRef}>
                                            {
                                                DataChat.map((item, i) => {
                                                    return (
                                                        <div className={item.UserType == "Client" ? "message-bubble message-received" : "message-bubble message-sent"} key={i}>
                                                            {item.Pesan}
                                                            <br />
                                                            <b style={{ fontSize: "10px" }}>{tanggalIndo(item.Waktu, true)}</b>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="chat-input">
                                            <input type="text" className="form-control me-2" placeholder="Ketik pesan..." value={this.state.Pesan} onChange={(e) => this.setState({ Pesan: e.target.value })} onKeyDown={this.handleKeyDown} disabled={this.state.UserID == 0 ? true : false} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <DivAksesDitolak />}
            </div>
        );
    }
}