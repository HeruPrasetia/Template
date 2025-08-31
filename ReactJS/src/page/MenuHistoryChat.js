import React, { Component } from 'react';
import { cekProfile, DivAksesDitolak, DxSubmitForm, openModal, pesan, tanggalIndo, api, submitForm, DivExpired } from '../Modul';
import { DxFormInput, FormSwitch, FormInput, createTag } from '../component/FormInput';
import SocketContext from '../SocketContext';
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
const audio = new Audio(require('../assets/bell.mp3'));

export default class Chat extends Component {
    static contextType = SocketContext;
    constructor(props) {
        super(props);
        this.state = {
            ListChat: [],
            DataChat: [],
            Telp: 0,
            DeviceID: "",
            SessionsID: "",
            Pesan: '',
            SysAkses: {},
            PerusahaanID: 0,
            DataDevice: [],
            DetailKontak: { IsAiActive: 1 },
            TagName: "",
            Search: "",
            IsShowArchive: false
        };
        this.reconnectTimeout = null;
        this.isManuallyClosed = false;
        this.chatBodyRef = React.createRef();
        this.reffFormKontak = React.createRef();
    }

    async componentDidMount() {
        let Profile = await cekProfile();
        if (Profile.status == "sukses") this.setState({ SysAkses: Profile.data, PerusahaanID: Profile.data.PerusahaanID }, () => {
            setTimeout(() => this.connectWebSocket(), 2000);
        })
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
            socket.send(JSON.stringify({ type: 'history chat', DeviceID: this.state.DeviceID, PerusahaanID: this.state.PerusahaanID }));

            socket.onmessage = (e) => {
                let data = JSON.parse(e.data);
                let type = data.type;
                if (data.status == "gagal") socket.send(JSON.stringify({ type: 'history chat', DeviceID: this.state.DeviceID, PerusahaanID: this.state.PerusahaanID }));

                if (type === 'detail chat') {
                    this.setState({ DataChat: data.pesan }, this.handleLastChat);
                } else if (type === 'pesan masuk') {
                    if (data.Telp == this.state.Telp) {
                        this.setState((prev) => ({
                            DataChat: [...prev.DataChat, data],
                        }), this.handleLastChat);
                    } else {
                        audio.play();
                        this.setState((prev) => {
                            const index = prev.ListChat.findIndex(item => item.Telp === data.Telp);

                            if (index === -1) {
                                return {
                                    ListChat: [
                                        {
                                            Telp: data.Telp,
                                            Name: data.Nama || data.Telp,
                                            Pesan: data.Pesan,
                                            Waktu: data.Waktu,
                                            Unread: 1
                                        },
                                        ...prev.ListChat
                                    ]
                                };
                            } else {
                                // Kontak sudah ada → update & pindah ke atas
                                const newList = [...prev.ListChat];
                                const updatedItem = {
                                    ...newList[index],
                                    Unread: (newList[index].Unread || 0) + 1,
                                    Pesan: data.Pesan,
                                    Waktu: data.Waktu
                                };

                                // Hapus dari posisi lama
                                newList.splice(index, 1);

                                // Masukkan ke paling atas
                                return {
                                    ListChat: [updatedItem, ...newList]
                                };
                            }
                        }, this.handleLastChat);
                    }
                } else if (type === 'typing') {
                    if (data.Telp == this.state.Telp) {
                    } else {
                        this.setState((prev) => {
                            const index = prev.ListChat.findIndex(item => item.Telp === data.Telp);
                            if (index === -1) {
                                return {
                                    ListChat: [
                                        ...prev.ListChat,
                                        {
                                            Telp: data.Telp,
                                            Name: data.Nama || data.Telp,
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
                    if (data.Telp == this.state.Telp) {
                        // misalnya kamu mau nambah data typing juga, tapi sepertinya tidak perlu
                    } else {
                        this.setState((prev) => {
                            const index = prev.ListChat.findIndex(item => item.Telp === data.Telp);
                            if (index === -1) {
                                return {
                                    ListChat: [
                                        ...prev.ListChat,
                                        {
                                            Telp: data.Telp,
                                            Name: data.Name || data.Telp,
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
                } else if (type === 'history chat') {
                    this.setState({ ListChat: data.pesan, DataDevice: data.device })
                }
            };
        }
    };

    handleDetailChat(data) {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        this.setState((prev) => {
            const newList = prev.ListChat.map(item => {
                if (item.Telp === data.Telp) {
                    return { ...item, Unread: 0 };
                }
                return item;
            });
            return {
                Telp: data.Telp,
                ListChat: newList
            };
        }, () => {
            if (socket) {
                socket.send(JSON.stringify({ type: 'detail chat', Telp: data.Telp, PerusahaanID: this.state.PerusahaanID, DeviceID: this.state.DeviceID }));
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
        let { SessionsID, Telp, PerusahaanID, Pesan } = this.state;
        if (SessionsID == "") return pesan("Gagal", "Silakan pilih dikirim dengan device mana", "error");
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        if (this.state.Pesan.trim()) {
            socket.send(JSON.stringify({ type: "kirim chat", Pesan, Telp, PerusahaanID, WA: SessionsID }));
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

    handleChangeDevice(Device) {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify({ type: "history chat", DeviceID: Device.ID, PerusahaanID: this.state.PerusahaanID }));
        this.setState({ DeviceID: Device.ID, SessionsID: Device.SessionsID })
    }

    async handleModalKontak(item) {
        let sql = await api("detailkontak", { Telp: item.Telp, PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ DetailKontak: sql.data, TagName: "" }, () => {
            let Tag = sql.data.Tag;
            if (Tag != null) {
                for (let dd of Tag.split("#")) {
                    createTag("#" + dd, "edtTag");
                }
            }
            openModal("modalKontak");
        });
    }

    handleChange(e, obj) {
        let DetailKontak = this.state.DetailKontak;
        DetailKontak[obj] = e.value;
        this.setState({ DetailKontak });
    }

    handleUpdateKontak() {
        let ListChat = this.state.ListChat;
        let Temp = [];
        let Detail = this.state.DetailKontak;
        for (let dd of ListChat) {
            if (dd.Telp == Detail.Telp) {
                dd.Nama = Detail.Nama;
                dd.IsArchive = Detail.IsArchive == 1 ? 0 : 1;
                let Tag = "";
                if (this.state.TagName != "") {
                    if (dd.Tag != null) {
                        for (let ddd of dd.Tag.split("#")) {
                            if (this.state.TagName != ddd) Tag += `${ddd}#`;
                        }
                    }
                    dd.Tag = Tag
                } else {
                    dd.Tag = Detail.Tag;
                }
            }
            Temp.push(dd);
        }
        this.setState({ ListChat: Temp, DetailKontak: {}, TagName: "" });
    }

    render() {
        let { ListChat, Telp, DataChat, DeviceID, DataDevice, ID, DetailKontak, IsShowArchive, Search } = this.state;
        return (
            <div className="main-body">
                {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                    this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                        <div className="div-content mt-1">
                            <div className="container-fluid h-100">
                                <div className="row h-100">
                                    <div className="col-4 col-md-3 chat-list p-0">
                                        <div className='d-flex gap-2'>
                                            <DxFormInput type='search' placeholder='Cari nama...' id='edtSearch' value={Search} onChange={(e) => this.setState({ Search: e.value })} />
                                            <button className='btn btn-default' onClick={async (e) => {
                                                let btn = e.target;
                                                btn.disabled = true
                                                await this.connectWebSocket(e);
                                                btn.disabled = false;
                                            }}><i className="fa-solid fa-rotate-right"></i></button>
                                            <button className='btn btn-default' onClick={() => this.setState({ IsShowArchive: !this.state.IsShowArchive })}><i className={IsShowArchive == false ? 'fas fa-archive' : "fas fa-close"} /></button>
                                        </div>
                                        <div className='d-flex justfy-content-start align-items-center gap-2'>
                                            <span className={DeviceID == "" ? "badge bg-primary" : "badge bg-secondary"} onClick={() => this.handleChangeDevice({ ID: "", SessionsID: "" })}>Semua Device</span>
                                            {
                                                DataDevice.map((item, i) => {
                                                    return <span className={DeviceID == item.ID ? "badge bg-primary" : "badge bg-secondary"} onClick={() => this.handleChangeDevice(item)}>{item.Nama}</span>
                                                })
                                            }
                                        </div>
                                        <p></p>
                                        <div className="list-group list-group-flush" style={{ maxHeight: "78vh", height: "100%", overflowY: "auto" }}>
                                            {
                                                ListChat
                                                    .filter(item => item.IsArchive == (IsShowArchive ? 1 : 0))
                                                    .filter(item => {
                                                        if (Search === "") return true;
                                                        const keyword = Search.toLowerCase();
                                                        return (
                                                            item.Nama.toLowerCase().includes(keyword) ||
                                                            item.Pesan.toLowerCase().includes(keyword)
                                                        );
                                                    })
                                                    .map((item, i) => {
                                                        return (
                                                            <a
                                                                href="#"
                                                                className={Telp == item.Telp
                                                                    ? "list-group-item list-group-item-action active chat-item"
                                                                    : "list-group-item list-group-item-action chat-item"}
                                                                key={i}
                                                                onClick={(e) => this.handleDetailChat(item)}
                                                            >
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div><strong>{item.Nama}</strong></div>
                                                                    <div className='d-flex align-items-center'>
                                                                        <small className="text-muted">{tanggalIndo(item.Waktu)}</small>
                                                                        <div className='dropstart'>
                                                                            <button className='btn btn-sm' data-bs-toggle="dropdown" aria-expanded="false">
                                                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                                                            </button>
                                                                            <ul className="dropdown-menu">
                                                                                <li><button className="dropdown-item" onClick={() => this.handleModalKontak(item)}>Edit Kontak</button></li>
                                                                                <li><button className="dropdown-item" onClick={() => this.setState({ DetailKontak: item }, () => openModal("modalArchive"))}>{item.IsArchive == 1 ? "Buka Arsip" : "Arsipkan"}</button></li>
                                                                                <li><button className="dropdown-item" onClick={() => this.setState({ DetailKontak: item }, () => openModal("modalHapus"))}>Hapus Chat</button></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                    <div className="text-muted small">
                                                                        {item.IsTyping == 0
                                                                            ? item.Pesan.length > 100
                                                                                ? item.Pesan.substring(0, 50) + "..."
                                                                                : item.Pesan
                                                                            : "Mengetik ..."}
                                                                    </div>
                                                                    {item.Unread == 0 ? "" : <div className='badge bg-primary'>{item.Unread}</div>}
                                                                </div>

                                                                {item.Tag != null &&
                                                                    <div className='d-flex justify-content-start align-items-center gap-2' style={{ overflowX: "auto" }}>
                                                                        {item.Tag.split("#").map((tag, ii) => {
                                                                            if (tag != "") {
                                                                                return (
                                                                                    <div className='badge bg-primary d-flex justify-content-between align-items-center' key={ii}>
                                                                                        <span>#{tag}</span>
                                                                                        <i
                                                                                            className='fas fa-close icon-label'
                                                                                            onClick={() => {
                                                                                                this.setState({ TagName: tag, DetailKontak: item }, openModal("modalDeleteLabel"))
                                                                                            }}
                                                                                        ></i>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </div>
                                                                }
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
                                                            <span style={{
                                                                whiteSpace: "pre-wrap",
                                                                wordWrap: "break-word"
                                                            }}>{item.Pesan}</span>
                                                            <br />
                                                            <b style={{ fontSize: "10px" }}>{tanggalIndo(item.Waktu, true)} {item.IsAi == 1 && <span className='badge bg-danger'>Dijawab AI</span>} {item.Boradcast != null && <span className='badge bg-danger'>{item.Broadcast}</span>}</b>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="chat-input">
                                            <input type="text" className="form-control me-2" placeholder="Ketik pesan..." value={this.state.Pesan} onChange={(e) => this.setState({ Pesan: e.target.value })} onKeyDown={this.handleKeyDown} disabled={this.state.Telp == 0 ? true : false} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <DivAksesDitolak />}

                <Modal id='modalKontak' title={"Edit Kontak" + DetailKontak.Tag} form={true} validationRef={this.reffFormKontak} onSubmit={(e) => DxSubmitForm(e, this.reffFormKontak, { crud: 'crudkontak', fn: () => this.handleUpdateKontak() })}>
                    <ModalBody>
                        <input type='hidden' name='act' value="edit" />
                        <input type='hidden' name='ID' value={DetailKontak.ID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='IsAiActive' value={DetailKontak.IsAiActive} />
                        <DxFormInput id='edtNama' label='Nama' name='Nama' value={DetailKontak.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} />
                        <DxFormInput id='edtTelp' type='text' label='Telp' name='Telp' value={DetailKontak.Telp || "62"} onChange={(e) => this.handleChange(e, 'Telp')} required={true} />
                        <DxFormInput id='edtEmail' type='email' label='Email' name='Email' placeholder='Masukan Alamat Email' value={DetailKontak.Email || ""} onChange={(e) => this.handleChange(e, 'Email')} />
                        <DxFormInput id='edtAlamat' type='textarea' label='Alamat' name='Alamat' placeholder='Masukan alamat' value={DetailKontak.Alamat || ""} onChange={(e) => this.handleChange(e, 'Alamat')} />
                        <FormInput id="edtTag" type='tag' label='Kelompok / Tag' name='Tag' value={DetailKontak.Tag || ""} onChange={(e) => this.handleChange(e, 'Tag')} PerusahaanID={this.state.PerusahaanID} />
                        <FormSwitch id='chkAi' label="Jawab Dengan AI" checked={DetailKontak.IsAiActive || false} onChange={(e) => {
                            let data = this.state.DetailKontak;
                            data.IsAiActive = e.target.checked == true ? 1 : 0;
                            this.setState({ DetailKontak: data });
                        }} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' id='btnSave' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalArchive' title="Arsipkan" form={true} onSubmit={(e) => submitForm(e, { crud: "crudkontak", fn: () => this.handleUpdateKontak() })}>
                    <ModalBody>
                        <input type='hidden' name='act' value="setting archive" />
                        <input type='hidden' name='ID' value={DetailKontak.CardID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='IsArchive' value={DetailKontak.IsAiActive} />
                        <h6>Apakah anda yakin akan mengarsipkan pesan ini !</h6>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalHapusTag">
                        <button type='submit' className='btn btn-danger'><i className='fas fa-trash-alt'></i> Arsipkan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalDeleteLabel' title="Konfirmasi" form={true} onSubmit={(e) => submitForm(e, { crud: "crudkontak", fn: () => this.handleUpdateKontak() })}>
                    <ModalBody>
                        <input type='hidden' name='act' value="hapus label" />
                        <input type='hidden' name='ID' value={DetailKontak.CardID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='TagName' value={this.state.TagName} />
                        <h6>Apakah anda yakin akan menghapus label {this.state.TagName}</h6>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalHapusTag">
                        <button type='submit' className='btn btn-danger'><i className='fas fa-trash-alt'></i> Hapus</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalHapus' title="Konfirmasi" form={true} onSubmit={(e) => submitForm(e, { crud: "crudkontak", fn: () => this.connectWebSocket() })}>
                    <ModalBody>
                        <input type='hidden' name='act' value="hapus chat" />
                        <input type='hidden' name='Telp' value={DetailKontak.Telp} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <h6>Apakah anda yakin akan menghapus seluruh chat ini !</h6>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalHapusTag">
                        <button type='submit' className='btn btn-danger'><i className='fas fa-trash-alt'></i> Hapus</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}