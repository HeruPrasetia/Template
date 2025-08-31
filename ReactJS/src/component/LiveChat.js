import React, { Component, Fragment } from 'react';
import { pesan, host, openModal, tanggalIndo } from '../Modul';
import '../assets/LiveChat.css';
import SocketContext from '../SocketContext';
import { Tabs } from './Tabs';
import { Modal, ModalBody, ModalFooter } from './Modal';
import RendTable from './RendTable';
const audio = new Audio(require('../assets/bell.mp3'));

export default class FloatingChat extends Component {
    static contextType = SocketContext;
    constructor(props) {
        super(props);
        this.state = {
            showChat: false,
            Pesan: '',
            DataPesan: [],
            Profile: this.props.Profile,
            DataQuery: [],
            Field: [],
            IsLoading: false,
            IsPesan: false
        };
        this.chatRef = React.createRef();
        this.typingTimeout = null;
        this.chatBodyRef = React.createRef();
        this.chatBodyAIRef = React.createRef();
    }

    componentDidMount() {
        this.setState({ Profile: this.props.Profile });
        document.addEventListener('mousedown', this.handleClickOutside);
        setTimeout(() => this.handleGetMessage(), 3000);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
    }

    componentDidUpdate(prev) {
        if (prev.Profile !== this.props.Profile) {
            this.setState({ Profile: this.props.Profile }, this.handleGetMessage());
        }
    }

    toggleChat = () => {
        this.setState((prev) => {
            const nextShow = !prev.showChat;
            if (nextShow) {
                const { socket } = this.context;
                if (socket) this.handleGetMessage();
            }

            return { showChat: nextShow, IsPesan: false };
        });
    }

    handleGetMessage() {
        const { socket, isConnected } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        if (socket) {
            socket.send(JSON.stringify({ type: "detail chat partner" }));
            socket.onmessage = (e) => {
                let data = JSON.parse(e.data);
                let type = data.type;
                if (type == "pesan dari partner") {
                    audio.play();
                    this.setState((prev) => ({
                        DataPesan: [...prev.DataPesan, { UserType: data.UserType, Pesan: data.Pesan, Waktu: data.Waktu }], IsLoading: false, IsPesan: true
                    }), this.handleLastChat);
                } else if (type == "detail chat partner") {
                    this.setState({ DataPesan: data.Chat, IsLoading: false }, this.handleLastChat);
                } else if (type == "hasil query") {
                    if (data.status == "sukses") {
                        let DataQuery = data.DataQuery;
                        let keys = Object.keys(DataQuery[0]);
                        let Field = [];
                        for (let dd of keys) Field.push({ cap: dd, sort: dd, type: "str" });
                        this.setState({ DataQuery, Field, IsLoading: false }, openModal("modalQuery"));
                    } else {
                        pesan("", "Mohon maaf permintaan anda belum dapat dilakukan", "error");
                    }
                }
            };
        }
    }

    handleClickOutside = (event) => {
        if (this.state.showChat && this.chatRef.current && !this.chatRef.current.contains(event.target)) {
            this.setState({ showChat: false });
        }
    }

    handleChange = (e) => {
        this.setState({ Pesan: e.target.value });
    }

    handleLastChat = () => {
        if (this.chatBodyRef.current) {
            this.chatBodyRef.current.scrollTop = this.chatBodyRef.current.scrollHeight;
        }
    }

    handleSend = () => {
        const { socket } = this.context;
        if (this.state.Pesan.trim()) {
            socket.send(JSON.stringify({ type: "pesan ke partner", pesan: this.state.Pesan }));
            this.setState((prev) => ({
                DataPesan: [...prev.DataPesan, { UserType: 'Client', Pesan: prev.Pesan, Waktu: Date.now() }],
                Pesan: ''
            }), this.handleLastChat);
        }
    }

    handleTyping(e) {
        const { socket } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        if (e.key === 'Enter') {
            this.handleSend();
            if (this.typingTimeout) clearTimeout(this.typingTimeout);
            socket.send(JSON.stringify({ type: "stop_typing" }));
        } else {
            socket.send(JSON.stringify({ type: "typing" }));

            if (this.typingTimeout) clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                socket.send(JSON.stringify({ type: "stop_typing" }));
            }, 1500);
        }
    }

    handleTanyaAI(e) {
        const { socket } = this.context;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        if (e.key === 'Enter') {
            audio.play();
            socket.send(JSON.stringify({ type: "tanya ai", pesan: this.state.Pesan }));
            this.setState((prev) => ({
                DataPesan: [...prev.DataPesan, { UserType: 'Client', Pesan: prev.Pesan, Waktu: Date.now() }, { UserType: 'Admin', Pesan: "Shiap.. silahkan di tunggu", Waktu: Date.now() }],
                Pesan: '',
                IsLoading: true
            }), () => {
                if (this.chatBodyAIRef.current) {
                    this.chatBodyAIRef.current.scrollTop = this.chatBodyAIRef.current.scrollHeight;
                }
            });
        }
    }

    render() {
        const { showChat, Pesan, DataPesan, Profile, IsLoading, IsPesan } = this.state;
        return (
            <Fragment>
                {showChat && (
                    <div ref={this.chatRef} className={IsLoading == true ? "floating-chat d-flex flex-column loading" : "floating-chat d-flex flex-column"}>
                        <div className="chat-header">Live Chat</div>
                        <Tabs header={[
                            { title: "Chat CS" },
                            { title: "Chat AI" },
                        ]} >
                            <div>
                                <div className="chat-body" ref={this.chatBodyRef}>
                                    {DataPesan.map((msg, i) => (
                                        <div key={i} className={`chat-message ${msg.UserType === 'Client' ? 'chat-message-me' : 'chat-message-user'}`}>
                                            {msg.Pesan}
                                            <br />
                                            <b style={{ fontSize: "10px" }}>{tanggalIndo(msg.Waktu, true)}</b>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input d-flex justify-content-between align-items-center">
                                    <input type="text" className="form-control form-control-sm" placeholder="Tulis pesan..." value={Pesan} onChange={this.handleChange} onKeyDown={(e) => this.handleTyping(e)} />
                                </div>
                            </div>
                            <div>
                                <div className="chat-body" ref={this.chatBodyAIRef}>
                                    {DataPesan.map((msg, i) => (
                                        <div key={i} className={`chat-message ${msg.UserType === 'Client' ? 'chat-message-me' : 'chat-message-user'}`}>
                                            {msg.Pesan}
                                            <br />
                                            <b style={{ fontSize: "10px" }}>{tanggalIndo(msg.Waktu, true)}</b>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input d-flex justify-content-between align-items-center">
                                    <input type="text" className="form-control form-control-sm" placeholder="Tulis pesan..." value={Pesan} onChange={this.handleChange} onKeyDown={(e) => this.handleTanyaAI(e)} />
                                </div>
                            </div>
                        </Tabs>
                    </div>
                )}

                <div className={IsPesan == true ? "floating-btn bounce2" : "floating-btn"} onClick={this.toggleChat}
                    style={{ backgroundColor: Profile.Maskot === "none" ? 'var(--color-primary)' : "transparent" }}>
                    {
                        Profile.Maskot === "none" ?
                            <i className='fas fa-comments'></i> :
                            <img src={host + 'file/' + Profile.Maskot} style={{ width: "100%" }} alt="Maskot" />
                    }
                </div>

                <Modal id='modalQuery' title='Hasil Query' className='modal-xl'>
                    <ModalBody>
                        <RendTable
                            tbody={this.state.DataQuery}
                            thead={this.state.Field}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalQuery" />
                </Modal>
            </Fragment>
        );
    }
}
