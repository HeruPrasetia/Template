import React, { Fragment } from "react";
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { Row, Row6 } from '../component/Rows.js'
import { api, pesan, tanggalIndo, numberFormat, host } from "../Modul.js";

export default class ModalFormPelanggan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: {},
            ID: "",
            DetailPaket: {}
        };
        this.validationForm = React.createRef();
    }

    componentDidMount() {
        this.setState({ Detail: this.props.Detail, ID: this.props.ID, DetailPaket: this.props.DetailPaket });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Detail !== this.props.Detail || prevProps.DetailPaket !== this.props.DetailPaket) this.setState({ Detail: this.props.Detail, ID: this.props.ID, DetailPaket: this.props.DetailPaket });
    }

    async handleProsesPayment(ID, Status) {
        let sql = await api("crudclient", { act: "proses payment", ID: ID, Status: Status });
        if (sql.status == "sukses") {
            pesan("", sql.pesan);
            this.props.submit();
            document.getElementById('btnTutupDetailPayment').click();
        } else {
            pesan("", sql.pesan, 'warning');
        }
    }

    render() {
        let { Detail, DetailPaket } = this.state;
        return (
            <Modal id='modalDetailPayment' className='modal-xl' title='Detail Pembayaran' >
                <ModalBody>
                    <Row>
                        <Row6>
                            <b>Detail Permintaan</b>
                            <p></p>
                            <table className='table table-striped'>
                                <tbody>
                                    <tr><td width="100px">Nama</td><td width="10px">:</td><td>{Detail.Nama}</td></tr>
                                    <tr><td>Telp</td><td>:</td><td>{Detail.Telp}</td></tr>
                                    <tr><td>Email</td><td>:</td><td>{Detail.Email}</td></tr>
                                    <tr><td>Jenis</td><td>:</td><td>{Detail.Jenis}</td></tr>
                                    <tr><td>Waktu</td><td>:</td><td>{Detail.Tanggal}</td></tr>
                                    <tr><td>Status</td><td>:</td><td>{Detail.Status}</td></tr>
                                    {Detail.Status == "Pending" ? "" : <tr><td>Waktu Proses</td><td>:</td><td>{tanggalIndo(Detail.WaktuApprove, true)}</td></tr>}
                                </tbody>
                            </table>
                        </Row6>
                        <Row6>
                            <b>Detail Paket</b>
                            <p></p>
                            <table className='table table-striped'>
                                <tbody>
                                    <tr><td width="200px">Nama Paket</td><td width="10px">:</td><td>{DetailPaket.Nama}</td></tr>
                                    <tr><td>Harga Paket</td><td>:</td><td>{numberFormat(DetailPaket.Harga)}</td></tr>
                                    <tr><td>Kuota AI response</td><td>:</td><td>{DetailPaket.KuotaAi}</td></tr>
                                    <tr><td>Kuota Image Extractor</td><td>:</td><td>{DetailPaket.KuotaImg}</td></tr>
                                    <tr><td>Kuota Voice Notes</td><td>:</td><td>{DetailPaket.KuotaVn}</td></tr>
                                    <tr><td>Kuota Broadcast</td><td>:</td><td>{DetailPaket.KuotaBlash}</td></tr>
                                    <tr><td>Kuota Scrap</td><td>:</td><td>{DetailPaket.KuotaScrap}</td></tr>
                                </tbody>
                            </table>
                        </Row6>
                    </Row>
                    {Detail.BuktiTfPelanggan != null ?
                        <Fragment>
                            <b>Bukti Transfer</b>
                            <p></p>
                            <img src={host + "file/" + Detail.BuktiTfPelanggan} style={{ width: "100%" }} />
                        </Fragment>
                        : ""
                    }
                </ModalBody>
                <ModalFooter btnClose="btnTutupDetailPayment">
                    {
                        Detail.Status == "Menunggu Konfirmasi Admin" || Detail.Status == "Pending" ?
                            <Fragment>
                                <button type='button' className='btn btn-danger' onClick={(e) => this.handleProsesPayment(Detail.ID, 'Reject')}><i className='fas fa-times-circle'></i> Reject</button>
                                <button type='button' className='btn btn-default' onClick={(e) => this.handleProsesPayment(Detail.ID, 'Approve')}><i className='fas fa-save'></i> Approve</button>
                            </Fragment>
                            : ""
                    }
                </ModalFooter>
            </Modal>
        )
    }
}