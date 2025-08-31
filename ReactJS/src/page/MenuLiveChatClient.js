import React, { Component, lazy, Suspense } from 'react';
import { DivAksesDitolak, tanggalIndo, api, openModal, cekProfile, pesan, submitForm, host, DivExpired } from '../Modul';
import { DxFormInput } from '../component/FormInput';
import { Tabs } from '../component/Tabs';
import SocketContext from '../SocketContext';
import { Row, Row4 } from '../component/Rows';
import imgUpload from '../assets/img/img-upload.png';

const ModalSettingDevice = lazy(() => import('../component/ModalSettingDevice.js'));
const ModalFormAutoText = lazy(() => import('../component/ModalFormAutoText.js'));
const ModalSettingAi = lazy(() => import('../component/ModalSettingAi.js'));

const audio = new Audio(require('../assets/bell.mp3'));
export default class Chat extends Component {
    static contextType = SocketContext;
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            ListChat: [],
            DataChat: [],
            UserID: 0,
            DeviceID: 0,
            Pesan: '',
            PerusahaanID: 0,
            DataDevice: [],
            ID: 0,
            Detail: { Setting: {} },
            DataAutoText: [],
            ChangeImg: "tidak",
            MaskotImg: imgUpload
        };
        this.reconnectTimeout = null;
        this.isManuallyClosed = false;
        this.chatBodyRef = React.createRef();
    }

    async componentDidMount() {
        let Profile = await cekProfile();
        this.setState({ PerusahaanID: Profile.data.PerusahaanID, SysAkses: Profile.data }, this.connectWebSocket);
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
            socket.send(JSON.stringify({ type: 'list chat admin' }));
            socket.onmessage = (e) => {
                let data = JSON.parse(e.data);
                let type = data.type;

                if (type === 'history') {
                    this.setState({ DataChat: data.data });
                } else if (type === 'pesan dari client') {
                    if (data.UserID == this.state.UserID) {
                        this.setState((prev) => ({
                            DataChat: [...prev.DataChat, data.data],
                        }), this.handleLastChat);
                    } else {
                        audio.play();
                        this.setState((prev) => {
                            const index = prev.ListChat.findIndex(item => item.UserID === data.UserID);
                            if (index === -1) {
                                return {
                                    ListChat: [
                                        ...prev.ListChat,
                                        { UserID: data.UserID, Nama: data.Nama, UserType: data.UserType, Device: data.Device, Waktu: data.Waktu, Unread: 1 }
                                    ]
                                };
                            } else {
                                const newList = [...prev.ListChat];
                                newList[index] = {
                                    ...newList[index],
                                    Unread: (newList[index].Unread || 0) + 1,
                                    Nama: newList[index].Nama,
                                    UserType: newList[index].UserType,
                                    Waktu: newList[index].Waktu,
                                    Device: newList[index].Device,
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
                                        { UserID: data.UserID, Name: data.Name || `User ${data.UserID}`, Unread: 0, IsTyping: 1 }
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
                                        { UserID: data.UserID, Name: data.Name || `User ${data.UserID}`, Unread: 0, IsTyping: 0 }
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
                } else if (type === 'list chat admin') {
                    this.setState({ ListChat: data.Kontak })
                } else if (type === "detail chat admin") {
                    this.setState({ DataChat: data.Chat }, this.handleLastChat)
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
                DeviceID: data.DeviceID,
                ListChat: newList
            };
        }, () => {
            if (socket) {
                socket.send(JSON.stringify({ type: 'detail chat admin', UserID: data.UserID }));
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
            socket.send(JSON.stringify({ type: "pesan ke client", pesan: this.state.Pesan, UserID: this.state.UserID, DeviceID: this.state.DeviceID }));
            this.setState((prev) => ({
                DataChat: [...prev.DataChat, { UserType: 'Admin', Pesan: prev.Pesan, Waktu: Date.now() }],
                Pesan: ''
            }), this.handleLastChat);
        }
    };

    async handleGetDevice() {
        let sql = await api("datadevicelivechat", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ DataDevice: sql.data }, () => {
            document.getElementById('btnTutupSetting').click();
        });
    }

    async modalSettingAI(ID) {
        let sql = await api("detailai", { ID });
        if (sql.status == "sukses") {
            this.setState({ ID, Detail: sql.data, Pesan: "" });
            openModal("modalSettingAI");
        } else {
            pesan(sql.status, sql.pesan, 'error');
        }
    }

    async modalAutoText(Detail) {
        let sql = await api("dataautotext", { DeviceID: Detail.ID, PerusahaanID: Detail.PerusahaanID });
        console.log(sql);
        if (sql.status == "sukses") {
            this.setState({ Detail, DataAutoText: sql.data });
            openModal("modalAutoText");
        }
    }

    async modalSetting(data) {
        let sql = await api("detaildevice", { ID: data.ID });
        if (sql.status == "sukses") {
            let Setting = sql.data.Setting;
            let MaskotImg = host + "file/" + Setting.maskot;
            this.setState({ Detail: sql.data, DataProdukDevice: sql.produk, ChangeImg: false, MaskotImg });
            openModal("modalSetting");
        }
    }

    async handleModalAdd() {
        let Detail = {
            Nama: "", Telp: "", IsUsingBot: 1, IsTakeOverAdmin: 1, IsPrompt: 1, Setting: { title: "Live Chat", color: "#0975f5", jenismaskot: "icon", maskot: "none" }
        }
        this.setState({ Detail, ChangeImg: false }, openModal("modalForm"));
    }

    render() {
        let { ListChat, UserID, DataChat, DataDevice, ID, Detail } = this.state;
        return (
            <div className="main-body">
                {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                    this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                        <div className="div-content mt-1">
                            <div className="container-fluid h-100">
                                <div className="main-title col-md-9 mb-2">Agent Live Chat</div>
                                <p></p>
                                <Tabs header={[
                                    { title: "Chat", id: "tabChat" },
                                    { title: "Setting", id: "tabSetting", fn: () => this.handleGetDevice() },
                                ]} >
                                    <div>
                                        <div className="row h-100">
                                            <div className="col-4 col-md-3 chat-list p-0">
                                                <DxFormInput type='search' placeholder='Cari nama...' />
                                                <p></p>
                                                <div className="list-group list-group-flush">
                                                    {
                                                        ListChat.map((item, i) => {
                                                            return (
                                                                <a href="#" className={UserID == item.UserID ? "list-group-item list-group-item-action active chat-item" : "list-group-item list-group-item-action chat-item"} key={i} onClick={(e) => this.handleDetailChat(item)}>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div><strong>{item.Nama} - {item.Device}</strong></div>
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
                                                <div className="chat-messages2 d-flex flex-column" ref={this.chatBodyRef}>
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
                                    <div>
                                        <Row>
                                            {
                                                DataDevice.map((div, i) => {
                                                    return (
                                                        <Row4 key={i}>
                                                            <div className='card card-shadow'>
                                                                <div className='card-header d-flex justify-content-between align-items-center'>
                                                                    <h6>{div.Nama}</h6>
                                                                    {
                                                                        div.IsLogin == 1 ?
                                                                            <button className='btn btn-sm btn-default-soft' onClick={() => this.handleModalLogout(div.SessionsID)}><i className="fas fa-power-off" style={{ paddingRight: "5px" }}></i> Matikan</button>
                                                                            :
                                                                            <button className='btn btn-sm btn-default' onClick={() => this.handleModalLogin(div.ID)}><i className="fas fa-power-off" style={{ paddingRight: "5px" }}></i> Aktifkan</button>
                                                                    }
                                                                </div>
                                                                <div className='card-body'>
                                                                    <div className='d-flex justify-content-end'>
                                                                        <b className={div.Sisa > 10 ? "color-default" : "text-danger btn btn-link"} onClick={() => this.handlePaket(div)}><i className='fas fa-calendar'></i> Berahir : {tanggalIndo(div.EndDate)} ({div.Sisa} hari)</b>
                                                                    </div>
                                                                    <ul className="list-group list-group-flush b-r-10">
                                                                        <li className="list-group-item px-4 py-4">
                                                                            <b className="fw-6">Jumlah Pesan</b>
                                                                            <p></p>
                                                                            <div className='table-responsive'>
                                                                                <table className='table table-striped'>
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td style={{ width: "200px" }}>Jumlah Pengunjung</td>
                                                                                            <td>:</td>
                                                                                            <td>{div.Pengunjung}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>Jumlah Chat</td>
                                                                                            <td>:</td>
                                                                                            <td>{div.Pesan}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>Jumlah Response AI</td>
                                                                                            <td>:</td>
                                                                                            <td>{div.PesanAi}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                    <p></p>

                                                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                                                        <button className="btn btn-warning w-50" onClick={() => this.modalSettingAI(div.ID)}><i className='fas fa-wrench' style={{ paddingRight: "5px" }}></i> Setting AI</button>
                                                                        <button className="btn btn-warning btn-sm w-50" onClick={(e) => this.handleModalHistoryChat(div)}><i className="fas fa-comments" style={{ paddingRight: "5px" }}></i>Riwayat Chat</button>
                                                                    </div>
                                                                    <p></p>
                                                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                                                        <button className="btn btn-primary btn-sm w-50" onClick={() => this.modalAutoText(div)}><i className="fas fa-keyboard" style={{ paddingRight: "5px" }}></i> Auto Text</button>
                                                                        <button className="btn btn-danger btn-sm w-50" onClick={(e) => this.modalSetting(div)}><i className="fas fa-tools" style={{ paddingRight: "5px" }}></i> Setting</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Row4>
                                                    )
                                                })
                                            }
                                            <Row4>
                                                <div className='card card-shadow' onClick={() => this.handleModalAdd()}>
                                                    <div className='card-body d-flex justify-content-center align-items-center' style={{ minHeight: "425px", cursor: "pointer" }}>
                                                        <center>
                                                            <i className='fas fa-plus'></i>
                                                            <p></p>
                                                            <h6>Tambah Device</h6>
                                                        </center>
                                                    </div>
                                                </div>
                                            </Row4>
                                        </Row>
                                    </div>
                                </Tabs>
                            </div>

                            <Suspense><ModalSettingAi Detail={this.state.Detail} PerusahaanID={this.state.PerusahaanID} submit={() => this.handleGetDevice()} /></Suspense>
                            <Suspense><ModalFormAutoText DeviceID={this.state.Detail.ID} PerusahaanID={this.state.PerusahaanID} DataAutoText={this.state.DataAutoText} submit={() => this.handleGetDevice()} /></Suspense>
                            <Suspense><ModalSettingDevice Detail={this.state.Detail} DataProdukDevice={this.state.DataProdukDevice} submit={() => this.handleGetDevice()} /></Suspense>
                        </div>
                        : <DivAksesDitolak />
                }
            </div>
        );
    }
}