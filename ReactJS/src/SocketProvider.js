import React from "react";
import SocketContext from "./SocketContext";

export class SocketProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            isConnected: false
        };
        this.socket = null;
        this.isManuallyClosed = false;
        this.reconnectTimeout = null;
    }

    componentDidMount() {
        setTimeout(() => this.connectWebSocket(), 2000);
    }

    componentWillUnmount() {
        this.isManuallyClosed = true;
        if (this.socket) this.socket.close();
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    }

    connectWebSocket = () => {
        const Token = localStorage.getItem("TokenUserWA");
        let Domain = window.location.hostname;
        const wsUrl = Domain === "localhost"
            ? `ws://localhost:3003/?token=${Token}&usertype=${this.props.IsPartner == true ? "Partner" : "Admin"}&domain=${Domain}`
            : `wss://ws.naylatools.com/?token=${Token}&usertype=${this.props.IsPartner == true ? "Partner" : "Admin"}&domain=${Domain}`;

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log("WebSocket connected");
            this.isManuallyClosed = false;
            this.setState({ isConnected: true, socket: this.socket });
        };

        this.socket.onclose = (e) => {
            console.log("WebSocket closed:", e.code, e.reason);
            this.setState({ isConnected: false, socket: null });
            if (Token) {
                if (!this.isManuallyClosed) {
                    console.log("Reconnecting in 3s...");
                    this.reconnectTimeout = setTimeout(() => {
                        this.connectWebSocket();
                    }, 3000);
                }
            }
        };

        this.socket.onerror = (e) => {
            console.error("WebSocket error:", e);
        };
    };

    render() {
        return (
            <SocketContext.Provider value={{ socket: this.socket, isConnected: this.state.isConnected }}>
                {this.props.children}
            </SocketContext.Provider>
        );
    }
}
