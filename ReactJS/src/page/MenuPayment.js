import React, { Fragment } from 'react';
import { submitForm, openModal, cekProfile, saiki, api, host, DivAksesDitolak, VideoCard, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import DateRangeBox from 'devextreme-react/date-range-box';
import withRouter from "../withRouter";
import Tutorial from '../component/Tutorial';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Waktu", sort: "Waktu", type: "datetime" },
                { cap: "Pelanggan", sort: "Pelanggan", type: "str" },
                { cap: "Keterangan", sort: "Pesan", type: "str" },
                { cap: "Approve By", sort: "ApproveBy", type: "str" },
                { cap: "Waktu Approve", sort: "ApproveTime", type: "datetime" },
                { cap: "Status", sort: "Status", type: "str" }
            ],
            Detail: {},
            DataKontak: [],
            DataChat: [],
            DataPay: {},
            PerusahaanID: 0,
            D1: saiki("1"),
            D2: saiki(),
            RunStep: false
        };
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let { id } = this.props.params;
        if (id == undefined) {
            this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, this.handleMain);
        } else {
            let sql = await api("detailpayment", { ID: id, PerusahaanID: profile.PerusahaanID });
            if (sql.status == "sukses") {
                this.setState({ PerusahaanID: profile.PerusahaanID, ID: id, Detail: sql.data, DataChat: sql.chat, DataPay: sql.pay });
            }
        }
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datapayment", { PerusahaanID: this.state.PerusahaanID, D1: this.state.D1, D2: this.state.D2 });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ ID: data.ID });
        openModal("modalHapus");
    }

    async modalDetail(ID, mode = "int") {
        let sql = await api("detailpayment", { ID: ID, mode, PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ Detail: sql.data || {}, DataChat: sql.chat, DataPay: sql.pay || {} });
            openModal("modalDetail");
        }
    }

    onCurrentValueChange = ({ value: [startDate, endDate] }) => {
        this.setState({ D1: startDate, D2: endDate });
    };

    render() {
        let { Detail, DataPay, ID } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='row'>
                                    <div className="main-title col-md-6 mb-2">
                                        <label id='lblTitle'>Data Pembayaran</label>
                                        <button className='btn btn-link' onClick={() => {
                                            this.setState({ RunStep: true });
                                            setTimeout(() => {
                                                let Btn = document.getElementsByClassName("react-joyride__beacon");
                                                for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                            }, 200);
                                        }}><i className='fas fa-info-circle'></i></button>
                                    </div>
                                    <div className='col-md-6 mb-2'>
                                        <div className="d-flex justify-content-end align-items-end gap-1">
                                            <DateRangeBox
                                                defaultValue={[this.state.D1, this.state.D2]}
                                                onValueChanged={this.onCurrentValueChange}
                                                id='edtDateRange'
                                            />
                                            <button className='btn btn-default' onClick={() => this.handleMain()} id='btnPreview'><i className='fas fa-search'></i></button>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.ID == undefined ?
                                        <RendTables
                                            tbody={this.state.Data}
                                            thead={this.state.Field}
                                            opt={[
                                                { icon: "fas fa-info-circle", fn: (e) => this.modalDetail(e.ID) },
                                                { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) }
                                            ]}
                                            group={[
                                                { cap: "Tanggal", sort: "Tanggal" }
                                            ]}
                                            id="TableDataPayment"
                                        /> :
                                        <div className='container'>
                                            <p></p>
                                            <h6>Detail Lead</h6>
                                            <table className='table table-striped'>
                                                <tbody>
                                                    <tr>
                                                        <td>Nama</td>
                                                        <td>:</td>
                                                        <td>{Detail.Pelanggan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Telp</td>
                                                        <td>:</td>
                                                        <td>{Detail.Telp}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Keterangan</td>
                                                        <td>:</td>
                                                        <td>{Detail.Keterangan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status</td>
                                                        <td>:</td>
                                                        <td>{Detail.Status}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6>Detail Pembayaran</h6>
                                            <table className='table table-striped'>
                                                <tbody>
                                                    <tr>
                                                        <td>Tanggal</td>
                                                        <td>:</td>
                                                        <td>{DataPay.Waktu}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Pesan</td>
                                                        <td>:</td>
                                                        <td>{DataPay.Pesan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status</td>
                                                        <td>:</td>
                                                        <td>{DataPay.Status}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Approve By</td>
                                                        <td>:</td>
                                                        <td>{DataPay.ApproveBy} {DataPay.ApproveTime}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <img src={host + 'img/' + DataPay.File} width="300px" />
                                        </div>
                                }
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.SysAkses.Step} run={this.state.RunStep} /> : ""}
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalDetail' className='modal-lg' title='Detail Lead' >
                    <ModalBody>
                        <h6>Detail Lead</h6>
                        <table className='table table-striped'>
                            <tbody>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{Detail.Pelanggan}</td>
                                </tr>
                                <tr>
                                    <td>Telp</td>
                                    <td>:</td>
                                    <td>{Detail.Telp}</td>
                                </tr>
                                <tr>
                                    <td>Keterangan</td>
                                    <td>:</td>
                                    <td>{Detail.Keterangan}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>:</td>
                                    <td>{Detail.Status}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h6>Detail Pembayaran</h6>
                        <table className='table table-striped'>
                            <tbody>
                                <tr>
                                    <td>Tanggal</td>
                                    <td>:</td>
                                    <td>{DataPay.Waktu}</td>
                                </tr>
                                <tr>
                                    <td>Pesan</td>
                                    <td>:</td>
                                    <td>{DataPay.Pesan}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>:</td>
                                    <td>{DataPay.Status}</td>
                                </tr>
                                <tr>
                                    <td>Approve By</td>
                                    <td>:</td>
                                    <td>{DataPay.ApproveBy} {DataPay.ApproveTime}</td>
                                </tr>
                            </tbody>
                        </table>
                        <img src={host + 'img/' + DataPay.File} width="300px" />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDetail" />
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.ID} onSubmit={(e) => submitForm(e, { crud: "crudpayment", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
            </Fragment>
        )
    }

}

export default withRouter(Dashboard);
