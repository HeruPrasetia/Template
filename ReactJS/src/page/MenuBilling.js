import React, { Fragment } from 'react';
import { api, pesan, openModal, cekProfile } from '../Modul';
import CardProduk from '../component/CardProduk';
import { Tabs } from '../component/Tabs';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            PerusahaanID: "",
            SysAkses: {},
            Service: {}
        };
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, () => this.handleMain("Register"));
    }

    async handleMain(PaketType) {
        let sql = await api("datapaket", { IsTrial: "1", PaketType: PaketType });
        if (sql.status == "sukses") this.setState({ Data: sql.data, Service: sql.Service });
    }

    async handlePilihPaket(data) {
        if (this.state.Service.PaymentType == "Midtrans") {
            try {
                let sql = await api("reqpayment", {
                    Nama: this.state.SysAkses.Name,
                    Email: this.state.SysAkses.Email,
                    Nominal: data.Harga - data.Diskon,
                    DocType: this.state.PaketType == "Register" ? "Perpanjang" : "Tambah Kuota",
                    PerusahaanID: this.state.PerusahaanID,
                    DeviceID: 0,
                    DataPaket: data,
                    PaketID: data.ID
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
            } catch (error) {
                console.error("Gagal buat transaksi:", error);
                pesan("", error, "error");
            }
        } else {
            this.setState({ DetailPaket: data }, openModal("modalPayment"));
            document.getElementById('btnTutupModalPaket').click();
        }
    }

    render() {
        return (
            <Fragment>
                <div className="main-body">
                    <div className="div-content mt-1">
                        <div className="main-title">
                            <label id='lblTitle'>Billing</label>
                        </div>
                        <Tabs header={[
                            { title: "Paket Perpanjang", id: "TabsPerpanjang", fn: () => this.handleMain("Register") },
                            { title: "Paket Top Up", id: "TabsTopUp", fn: () => this.handleMain("Top Up") },
                        ]} >
                            <div>
                                <div className='d-flex justift-content-start align-items-center gap-2' style={{ overflowX: "auto" }}>
                                    {
                                        this.state.Data.map((div, i) => {
                                            return <CardProduk opt={div} handleclick={(div) => this.handlePilihPaket(div)} />
                                        })
                                    }
                                </div>
                            </div>
                            <div>
                                <div className='d-flex justift-content-start align-items-center gap-2' style={{ overflowX: "auto" }}>
                                    {
                                        this.state.Data.map((div, i) => {
                                            return <CardProduk opt={div} handleclick={(div) => this.handlePilihPaket(div)} />
                                        })
                                    }
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </Fragment>
        )
    }

}

export default Dashboard;
