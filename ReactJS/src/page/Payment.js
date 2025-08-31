import React, { Fragment } from 'react';
import { api, pesan, numberFormat, DxSubmitForm, tanggalIndo } from '../Modul';
import '../Login.css';
import withRouter from "../withRouter";
import { ValidationGroup } from 'devextreme-react/validation-group';
import CardPayment from '../component/CardPayment';

class Login extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        const transactionStatus = params.get("transaction_status");
        const orderId = params.get("order_id");
        this.state = {
            Email: "",
            SysAkses: {},
            Pwd: "",
            Profile: {},
            status: transactionStatus || "",
            orderId: orderId || "",
            id: "",
            Detail: {},
            Data: {}
        };
        this.validationReff = React.createRef();
    }

    async componentDidMount() {
        let { id } = this.props.params;
        if (id == undefined) window.location.href = '../';
        let sql = await api("getProfile", { service: true });
        if (sql.status == "sukses") {
            let Profile = sql.profile;
            document.documentElement.style.setProperty('--color-primary', sql.profile.ColorDefault);
            document.getElementById('scriptMidtrans').dataset.clientKey = sql.profile.PaymentClientKey;
            document.getElementById('scriptMidtrans').src = sql.profile.PaymentMode == "Trial" ? "https://app.sandbox.midtrans.com/snap/snap.js" : "https://app.midtrans.com/snap/snap.js";
            this.setState({ Profile: sql.profile, SysAkses: sql.data, id: id }, async () => {
                let Register = await api("detailregister", { ID: id });
                if (Register.status == "sukses") {
                    if (!Register.data) window.location.href = '../';
                    let Paket = Register.data.DataPaket;
                    this.setState({ Detail: Register.data, Data: Register.data.DataPaket, id }, () => {
                        if (Register.data.Status == "Pending" && Paket.IsTrial == "0") {
                            if (Profile.PaymentType == "Midtrans") {
                                let Paket = Register.data.DataPaket;
                                this.handlePilihPaket(Paket);
                            }
                        }
                    });
                } else {
                    pesan("", "Nomor Register tidak di ketahui", 'error');
                }
            });
        }
    }

    async handlePilihPaket(data) {
        try {
            if (this.state.Detail.Total > 0) {
                let sql = await api("reqpayment", {
                    Nama: this.state.SysAkses.Name,
                    Email: this.state.SysAkses.Email,
                    Nominal: this.state.Detail.Total,
                    DocType: this.state.Detail.DocType,
                    PerusahaanID: this.state.Detail.PerusahaanID,
                    DeviceID: this.state.Detail.ID,
                    DataPaket: data,
                    PaketID: data.ID,
                    ID: this.state.id
                });
                let snapToken = sql.token;
                window.snap.pay(snapToken, {
                    onSuccess: async function (result) {
                        pesan("", "✅ Pembayaran berhasil!", "info");
                        await api("updatepayment", { TokenID: snapToken, Status: "Sukses", Midtrans: result });
                        console.log(result);
                    },
                    onPending: async function (result) {
                        pesan("", "⏳ Pembayaran tertunda...", "warning");
                        await api("updatepayment", { TokenID: snapToken, Status: "Pending", Midtrans: result });
                        console.log(result);
                    },
                    onError: async function (result) {
                        pesan("", "❌ Pembayaran gagal!", "error");
                        await api("updatepayment", { TokenID: snapToken, Status: "Gagal", Midtrans: result });
                        console.log(result);
                    },
                    onClose: async function (result) {
                        await api("updatepayment", { TokenID: snapToken, Status: "Batal", Midtrans: result });
                        pesan("", "⚠️ anda menutup popup sebelum menyelesaikan pembayaran", "warning");
                    },
                });
            } else {
                pesan("Gagal", "Nominal tidak boleh 0, silahkan hubungi admin untuk masalah ini.")
            }
        } catch (error) {
            console.error("Gagal buat transaksi:", error);
            pesan("", error, "error");
        }
    }

    async handleCekStatus(e) {
        let btn = e.target;
        btn.disabled = true;
        let Register = await api("detailregister", { ID: this.state.id });
        if (Register.status == "sukses") {
            if (!Register.data) window.location.href = '../';
            let Paket = Register.data.DataPaket;
            this.setState({ Detail: Register.data, Data: Register.data.DataPaket }, () => {
                if (Register.data.Status == "Pending" && Paket.IsTrial == "0") {
                    if (this.state.Profile.PaymentType == "Midtrans") {
                        let Paket = Register.data.DataPaket;
                        this.handlePilihPaket(Paket);
                    }
                }
                btn.disabled = false;
            });
        } else {
            pesan("", "Nomor Register tidak di ketahui", 'error');
        }
    }

    render() {
        let { Profile, Data, Detail } = this.state;
        return (
            <div className='container d-flex justify-content-center vh-100 align-items-center' style={{ overflowY: "auto" }}>
                <div className='card shadow' style={{ borderRadius: "20px" }}>
                    <div className='card-body'>
                        {Detail.Status == "Pending" ?
                            Profile.PaymentType == "Manual" ?
                                <Fragment>
                                    <h5 style={{ textAlign: "Center" }}>Pembayaran</h5>
                                    <p></p>
                                    Silahkan melakukan transfer ke :
                                    <table className='table table-striped'>
                                        <tbody>
                                            <tr><td>Bank</td><td>:</td><td>{Profile.Bank}</td></tr>
                                            <tr><td>No.Rekening</td><td>:</td><td>{Profile.NoRek}</td></tr>
                                            <tr><td>A/n</td><td>:</td><td>{Profile.NamaRek}</td></tr>
                                            <tr><td>Nominal</td><td>:</td><td>{numberFormat(Data.Harga)}</td></tr>
                                            <tr><td>Pembelian</td><td>:</td><td>{Data.Nama}</td></tr>
                                        </tbody>
                                    </table>
                                    <span>Selanjutnya silahkan isi data berikut, serta lampirkan bukti Transfer</span>
                                    <p></p>
                                    <ValidationGroup ref={this.validationReff}>
                                        <form onSubmit={(e) => DxSubmitForm(e, this.validationReff, { crud: "uploadbuktitransfer", fn: () => window.location.href = './' })} >
                                            <input type='hidden' name='DocNumber' value={this.state.id} />
                                            <CardPayment />
                                            <p></p>
                                            <button className="btn btn-default w-100" type='submit'><i className='fas fa-save' style={{ paddingRight: "10px" }} /> Kirim Bukti Pembayaran</button>
                                        </form>
                                    </ValidationGroup>
                                </Fragment> :
                                Data.IsTrial == 0 ?
                                    <Fragment>
                                        <h5 style={{ textAlign: "Center" }}>Pembayaran</h5>
                                        <p></p>
                                        <span>Silahkan lakukan pembayaran, berikut detail transaksi : </span>
                                        <p></p>
                                        <table className='table table-striped'>
                                            <tbody>
                                                <tr><td>Nominal</td><td>:</td><td>{numberFormat(Data.Harga)}</td></tr>
                                                <tr><td>Pembelian</td><td>:</td><td>{Data.Nama}</td></tr>
                                                <tr><td>Status</td><td>:</td><td>{Detail.Status}</td></tr>
                                            </tbody>
                                        </table>
                                        <button className="btn btn-default w-100" onClick={() => this.handlePilihPaket(this.state.Data)}>Lakukan Pembayaran</button>
                                    </Fragment> :
                                    <Fragment>
                                        <h5 style={{ textAlign: "Center" }}>Status Pendaftaran</h5>
                                        <p></p>
                                        <span>Selamat pendaftaran anda berhasil, berikut detail pendaftaran : </span>
                                        <p></p>
                                        <table className='table table-striped'>
                                            <tbody>
                                                <tr><td>Paket</td><td>:</td><td>{Data.Nama}</td></tr>
                                                <tr><td>Keterangan</td><td>:</td><td>{Data.Keterangan}</td></tr>
                                                <tr><td>Status</td><td>:</td><td>{Detail.Status}</td></tr>
                                            </tbody>
                                        </table>
                                        <button className="btn btn-default w-100" onClick={(e) => this.handleCekStatus(e)}>Cek Status</button>
                                        <p></p>
                                        <button className="btn btn-default w-100" onClick={(e) => window.location.href = "../"}>Halaman Login</button>
                                    </Fragment> :
                            <Fragment>
                                <h5 style={{ textAlign: "Center" }}>Pembayaran</h5>
                                <p></p>
                                <span>Berikut detail transaksi : </span>
                                <p></p>
                                <table className='table table-striped'>
                                    <tbody>
                                        <tr><td>Tanggal Pembayaran</td> <td>:</td><td>{tanggalIndo(Detail.Waktu, true)}</td></tr>
                                        <tr><td>Tanggal Approve</td><td>:</td><td>{tanggalIndo(Detail.WaktuApprove, true)}</td></tr>
                                        <tr><td>Keterangan</td><td>:</td><td>{Detail.KeteranganApprove}</td></tr>
                                        <tr><td>Nominal</td><td>:</td><td>{numberFormat(Data.Harga)}</td></tr>
                                        <tr><td>Pembelian</td><td>:</td><td>{Data.Nama}</td></tr>
                                        <tr><td>Status</td><td>:</td><td>{Detail.Status}</td></tr>
                                    </tbody>
                                </table>
                            </Fragment>
                        }
                    </div>
                </div>
            </div >
        )
    }
}

export default withRouter(Login);