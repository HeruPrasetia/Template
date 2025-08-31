import React, { Suspense } from "react";
import { Modal, ModalBody, ModalFooter } from './Modal.js';
const RendTables = React.lazy(() => import('./RendTable'));

export default class ModalFormPaket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: {},
            DataDevice: [],
            DataHistory: []
        };
        this.validationFormPaket = React.createRef();
    }

    componentDidMount() {
        this.setState({ Detail: this.props.Detail, DataDevice: this.props.DataDevice, DataHistory: this.props.DataHistory });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Detail !== this.props.Detail || prevProps.DataDevice !== this.props.DataDevice) this.setState({ Detail: this.props.Detail, DataDevice: this.props.DataDevice, DataHistory: this.props.DataHistory });
    }

    render() {
        let { Detail, DataDevice, DataHistory } = this.state;
        return (
            <Modal id='modalDetail' className='modal-xl' title='Detail Pelanggan' >
                <ModalBody>
                    <table className='table table-striped'>
                        <tbody>
                            <tr>
                                <td width="100px">Nama</td>
                                <td width="10px">:</td>
                                <td>{Detail.Nama}</td>
                            </tr>
                            <tr>
                                <td>Telp</td>
                                <td>:</td>
                                <td>{Detail.Telp}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>:</td>
                                <td>{Detail.Email}</td>
                            </tr>
                            <tr>
                                <td>Reff</td>
                                <td>:</td>
                                <td>{Detail.Reff}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h6>WhatsApp Agent</h6>
                    <Suspense fallback={<div className="spinner-grow text-primary" role="status" />}>
                        <RendTables
                            tbody={DataDevice}
                            thead={[
                                { cap: "", sort: "", type: "opsi" },
                                { cap: "Nama", sort: "Nama", type: "str" },
                                { cap: "SessionsID", sort: "SessionsID", type: "str" },
                                { cap: "No WhatsApp", sort: "Telp", type: "str" },
                                { cap: "Tanggal Aktif", sort: "StartDate", type: "date" },
                                { cap: "Tanggal Berakhir", sort: "EndDate", type: "date" },
                                { cap: "Using AI", sort: "IsUsingAi", type: "boolean2" },
                                { cap: "Response AI", sort: "PesanAi", type: "str" },
                                { cap: "Image Extract", sort: "PesanImg", type: "str" },
                                { cap: "Voice Extract", sort: "PesanVc", type: "str" },
                            ]}
                            opt={[
                                { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapusDevice(e) }
                            ]}
                        />
                    </Suspense>
                    <p></p>
                    <h6>History Perpanjang</h6>
                    <Suspense fallback={<div className="spinner-grow text-primary" role="status" />}>
                        <RendTables
                            tbody={DataHistory}
                            thead={[
                                { cap: "Tanggal", sort: "Waktu", type: "datetime" },
                                { cap: "Jenis", sort: "Jenis", type: "str" },
                                { cap: "Keteragan", sort: "Keteragan", type: "str" },
                                { cap: "Bukti TF", sort: "BuktiTfPelanggan", type: "img" },
                                { cap: "Bukti TF Partner", sort: "BuktiTfPaartner", type: "img" },
                                { cap: "Status", sort: "Status", type: "str" },
                            ]}
                        />
                    </Suspense>
                </ModalBody>
                <ModalFooter btnClose="btnTutupModalDetail" />
            </Modal>
        )
    }
}