import React, { Fragment, Suspense, lazy } from 'react';
import { pesan, submitForm, openModal, host, spinText, api, DivExpired, cekProfile, DivAksesDitolak, VideoCard, tanggalIndo, DxSubmitForm } from '../Modul';
import { FormControl, FormSwitch, FormInput, FormTextarea } from '../component/FormInput';
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { Row, Row6, Row4 } from '../component/Rows';
import { QRCodeCanvas } from "qrcode.react";
import imgAI from '../assets/img/AI.png';
import imgWA from '../assets/img/wa.png';
import imgImagesAI from '../assets/img/img.png';
import imgVN from '../assets/img/vn.png';
import imgBC from '../assets/img/bc.png';
import { Tabs } from '../component/Tabs';

const ModalSettingDevice = lazy(() => import('../component/ModalSettingDevice.js'));
const ModalFormAutoText = lazy(() => import('../component/ModalFormAutoText.js'));
const ModalSettingAi = lazy(() => import('../component/ModalSettingAi.js'));
const RendTable = lazy(() => import('../component/RendTable'));
const FileManager = lazy(() => import('../component/FileManager'));
const CardProduk = lazy(() => import('../component/CardProduk'));
const CardPayment = lazy(() => import('../component/CardPayment'));

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [],
            DataKontak: [],
            Kontak: [],
            ArrKontak: [],
            Detail: {},
            ID: "",
            ModeView: localStorage.getItem('ModeView') || "blash",
            Pesan: "",
            Nomor: "62",
            LoginStatus: false,
            qrCode: "",
            DataHistory: [],
            ExpandGrid: false,
            Promp: "",
            JawabanAI: "",
            DataChat: [],
            DetailChat: [],
            Delay: "",
            DataAutoText: [],
            DataFile: [],
            Attach: '',
            DataLead: [],
            DataGroup: [],
            Telp: "",
            choose: false,
            DataMember: [],
            DataProdukDevice: [],
            PenjelasanProduk: "",
            HasilPrompt: "",
            PesanTest: "",
            DataPaket: [],
            DetailPaket: {},
            Service: {},
            IsShowFile: false,
            PaketType: "Register"
        };
        this.validationRef = React.createRef()
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, this.handleMain);

        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    handleChange(e) {
        let Detail = this.state.Detail;
        Detail[e.target.name] = e.target.value;
        this.setState({ Detail });
    }

    convertToWaNumber(phoneNumber) {
        phoneNumber = phoneNumber.replace(/^\+/, '');
        if (phoneNumber.startsWith('62')) {
            return phoneNumber;
        } else {
            return `62${phoneNumber.slice(1)}`;
        }
    }

    async handleKirimPesan(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.state.Attach == "") {
            let sql = await api("send", { Telp: this.state.ID, PerusahaanID: this.state.Detail.PerusahaanID, message: this.state.Pesan, number: this.state.Nomor }, true);
            if (sql.status == "sukses") {
                pesan("Berhasil", sql.pesan, "info");
            } else {
                pesan("Gagal", sql.pesan, "error");
            }
        } else {
            let sql = await api("send-media", { Telp: this.state.ID, PerusahaanID: this.state.Detail.PerusahaanID, pesan: this.state.Pesan, number: this.state.Nomor, path: this.state.Attach }, true);
            if (sql.status == "sukses") {
                pesan("Berhasil", sql.pesan, "info");
            } else {
                pesan("Gagal", sql.pesan, "error");
            }
        }
    }

    async handleModalLogin(Telp) {
        const sql = await api("login", { Telp }, true);
        if (sql.status === "sukses") {
            let counter = 0;
            let lastQr = null;
            let interpal = 3000;
            let SessionsID = sql.SessionsID;
            this.qrInterval = setInterval(async () => {
                const status = await api("status", { Telp: SessionsID }, true);
                if (status.connected) {
                    clearInterval(this.qrInterval);
                    this.qrInterval = null;
                    pesan("sukses", "Berhasil login!", "info");
                    this.handleMain();
                    document.getElementById('btnTutupModalLogin').click();
                    return;
                }

                const res = await api("qr", { Telp: SessionsID }, true);
                if (res.status === "sukses" && res.qr) {
                    if (res.qr !== lastQr) {
                        this.setState({ qrCode: res.qr });
                        lastQr = res.qr;
                    }
                    counter = 0;
                } else {
                    counter++;
                    if (counter >= 10) {
                        clearInterval(this.qrInterval);
                        this.qrInterval = null;
                        pesan("gagal", "QR gagal diambil, coba ulangi login.", "error");
                    }
                }
                interpal = 10000;
            }, interpal);
            openModal("modalLogin");

            document.getElementById("modalLogin").addEventListener("hidden.bs.modal", () => {
                this.handleCloseModalLogin();
            });
        } else {
            pesan("Gagal", sql.pesan, "error");
        }
    }

    handleCloseModalLogin() {
        if (this.qrInterval) {
            clearInterval(this.qrInterval);
            this.qrInterval = null;
        }
        this.setState({ qrCode: null });
    }

    async handleModalLogout(Telp) {
        this.setState({ ID: Telp });
        openModal("modalLogout");
    }

    async handleLogout(e) {
        e.preventDefault();
        e.stopPropagation();
        let sql = await api("logoutwa", { Telp: this.state.ID });
        if (sql.status == "sukses") {
            pesan("Sukses", sql.pesan, "info");
            this.handleMain();
            document.getElementById('btnTutupModalLogout').click();
        } else {
            pesan("gagal", sql.pesan, "error");
        }
    }

    async getLead(data) {
        let sql = await api("dataleadperdevice", { DeviceID: data.ID, PerusahaanID: data.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ DataLead: sql.data });
            openModal("modalLead");
        } else {
            pesan("Gagal", sql.pesan, "error");
        }
    }

    async modalTambahDevice(ID = "") {
        if (ID == "") {
            let sql = await api("ceklimit", { ID: "" });
            if (sql.status == "sukses") {
                this.setState({ ID: "", Detail: { Nama: "", Telp: "" } });
                openModal("modalFormDevice");
            } else {
                pesan(sql.status, `Akun anda memiliki maksimal device ${sql.data.MaxDevice} dan Device anda saat ini ${sql.device}`, "error");
            }
        } else {
            let sql = await api("detailai", { ID });
            if (sql.status == "sukses") {
                this.setState({ ID, Detail: sql.data });
                openModal("modalFormDevice");
            }
        }
    }
    async handleMain() {
        let sql = await api("datadevice", { id: "" });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    handleChange(e) {
        let Detail = this.state.Detail;
        Detail[e.target.name] = e.target.value;
        this.setState({ Detail });
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

    async handleModalBlash(Telp, PerusahaanID) {
        let sql = await api("datakontak", { PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ Kontak: sql.data, ID: Telp, Attach: "", Detail: { PerusahaanID } });
            openModal("modalBlash");
        }
    }

    async handleBlash(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!e.target.checkValidity()) {
            e.target.classList.add('was-validated');
            return;
        }

        let Kontak = [...this.state.Kontak];
        for (let dd in Kontak) {
            if (Kontak[dd].checked == true) {
                let delay = Math.floor(Math.random() * (6000 - 2000 + 1)) + 10000;
                this.setState({ Delay: delay });
                this.startCountdown();

                await new Promise(resolve => setTimeout(resolve, delay));

                let Pesan = this.state.Pesan.replaceAll("@nama", Kontak[dd].Nama);
                Pesan = Pesan.replaceAll("@alamat", Kontak[dd].Alamat);
                Pesan = spinText(Pesan);
                if (this.state.Attach == "") {
                    let sql = await api("send", {
                        Telp: this.state.ID,
                        number: Kontak[dd].Telp,
                        message: Pesan,
                        PerusahaanID: Kontak[dd].PerusahaanID
                    });
                    Kontak[dd].stts = sql.status;
                } else {
                    let sql = await api("send-media", {
                        Telp: this.state.ID,
                        number: Kontak[dd].Telp,
                        pesan: Pesan,
                        PerusahaanID: Kontak[dd].PerusahaanID,
                        path: this.state.Attach
                    });
                    Kontak[dd].stts = sql.status;
                }
                this.setState({ Kontak: Kontak, Delay: "" });
            }
        }
    }

    handlePilihKontak(data) {
        let chk = document.getElementById(`tableKontak${data.ID}`);
        let Menu = this.state.Kontak;
        let Akses = [];
        for (let dd in Menu) {
            if (Menu[dd].ID == data.ID) {
                Menu[dd].checked = chk.checked;
            }
            if (Menu[dd].checked == true) Akses.push(Menu[dd]);
        }
        this.setState({ Kontak: Menu, ArrKontak: Akses });
    }

    startCountdown = () => {
        this.timer = setInterval(() => {
            this.setState(prevState => {
                if (prevState.Delay <= 100) {
                    clearInterval(this.timer);
                    return { Delay: 0 };
                }
                return { Delay: prevState.Delay - 100 };
            });
        }, 100);
    }

    async modalAutoText(Detail) {
        let sql = await api("dataautotext", { DeviceID: Detail.ID, PerusahaanID: Detail.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ Detail, DataAutoText: sql.data });
            openModal("modalAutoText");
        }
    }

    async modalSetting(data) {
        let sql = await api("detaildevice", { ID: data.ID });
        if (sql.status == "sukses") {
            this.setState({ Detail: sql.data, DataProdukDevice: sql.produk });
            openModal("modalSetting");
        }
    }

    async handlePaket(data) {
        let sql = await api("datapaket", { IsTrial: "0", PaketType: this.state.PaketType });
        if (sql.status == "sukses") this.setState({ DataPaket: sql.data, Detail: data, Service: sql.Service }, openModal("modalPaket"));
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
                    DeviceID: this.state.Detail.ID,
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
        let { Data, Detail, qrCode, ID, Kontak } = this.state;
        let PlaceHolder = `
        Gunakan kata @nama untuk mengganti dengan nama dari master kontak. 
        @alamat akan di ganti dengan alamat dari master kontak.
        
        Contoh format spintext : Kamu {Hebat|Pintar|Luarbiasa} sekali.
        kalau spintext dalam spintext {Kamu {Pintar|Cerdas}|Luar Biasa} Sekali.
        `;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className="main-title">WhatsApp Agent</div>
                                <p></p>
                                <Row>
                                    {Data.map((div, i) => {
                                        return (
                                            <Row4 key={i}>
                                                <div className='card card-shadow'>
                                                    <div className='card-header card-device d-flex justify-content-between align-items-center'>
                                                        <h6>{div.Nama} - {div.WhatsApp}</h6>
                                                        {
                                                            div.IsLogin == 1 ?
                                                                <button className='btn btn-sm btn-default-soft' onClick={() => this.handleModalLogout(div.SessionsID)}><i className="fas fa-sign-out-alt"></i> Logout</button>
                                                                :
                                                                <button className='btn btn-sm btn-default' onClick={() => this.handleModalLogin(div.ID)}><i className="fas fa-qrcode"></i> Tautkan WA</button>
                                                        }
                                                    </div>
                                                    <div className='card-body'>
                                                        <div className='d-flex justify-content-end'>
                                                            <b className={div.Sisa > 10 ? "color-default" : "text-danger btn btn-link"} onClick={() => this.handlePaket(div)}><i className='fas fa-calendar'></i> Berahir : {tanggalIndo(div.EndDate)} ({div.Sisa} hari)</b>
                                                        </div>
                                                        <ul className="list-group list-group-flush b-r-10">
                                                            <li className="list-group-item px-4 py-4">
                                                                <div className="fw-6">Jumlah Pesan</div>
                                                                <div className='table-responsive'>
                                                                    <table className='table table-striped'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Pesan</th>
                                                                                <th>Kuota</th>
                                                                                <th>Dipakai</th>
                                                                                <th>Sisa</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                                                        <img src={imgAI} width="20px" height="20px" /> AI Response
                                                                                    </div>
                                                                                </td>
                                                                                <td>{div.MaxAiResponse}</td>
                                                                                <td>{div.PesanAi}</td>
                                                                                <td>{div.MaxAiResponse - div.PesanAi}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                                                        <img src={imgImagesAI} width="20px" height="20px" />  Image Extractor
                                                                                    </div>
                                                                                </td>
                                                                                <td>{div.MaxExtractImg}</td>
                                                                                <td>{div.PesanImg}</td>
                                                                                <td>{div.MaxExtractImg - div.PesanImg}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                                                        <img src={imgVN} width="20px" height="20px" /> Voice Note Reader
                                                                                    </div>
                                                                                </td>
                                                                                <td>{div.MaxExtractVc}</td>
                                                                                <td>{div.PesanVc}</td>
                                                                                <td>{div.MaxExtractVc - div.PesanVc}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                                                        <img src={imgBC} width="20px" height="20px" /> Broadcast / Follow Up
                                                                                    </div>
                                                                                </td>
                                                                                <td>{div.MaxBroadcast}</td>
                                                                                <td>{div.Broadcast}</td>
                                                                                <td>{div.MaxBroadcast - div.Broadcast}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={3}>
                                                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                                                        <img src={imgWA} width="20px" height="20px" /> Total Pesan Periode ini
                                                                                    </div>
                                                                                </td>
                                                                                <td>{div.Pesan}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </li>
                                                            <li className="list-group-item px-4 py-4" onClick={(e) => this.getLead(div)}>
                                                                <div className="fw-6">Jumlah Lead Masuk</div>
                                                                <div className="bg-light-dark  b-r-6 p-10">{div.Leads}</div>
                                                            </li>
                                                        </ul>
                                                        <button className="btn btn-warning w-100" onClick={() => this.modalSettingAI(div.ID)}><img src={imgAI} width="20px" height="20px" />Setting AI</button>
                                                        <p></p>

                                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                                            <button className="btn btn-success btn-sm w-50" disabled={div.IsLogin == 1 ? false : true} onClick={(e) => this.handleModalGroup(div.SessionsID, div.PerusahaanID)}><i className="fas fa-users"></i>List Group</button>
                                                            <button className="btn btn-warning btn-sm w-50" onClick={(e) => window.location.href = '/historychat'}><i className="fas fa-comments"></i>Riwayat Chat</button>
                                                        </div>
                                                        <p></p>
                                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                                            <button className="btn btn-warning btn-sm w-50" disabled={div.IsLogin == 1 ? false : true} onClick={(e) => this.handleModalBlash(div.SessionsID, div.PerusahaanID)}><img src={imgBC} width="20px" height="20px" /> Blash / Broadcast</button>
                                                            <button className="btn btn-info w-50" disabled={div.IsLogin == 1 ? false : true} onClick={(e) => {
                                                                this.setState({ ID: div.SessionsID, Detail: div });
                                                                openModal("modalKirimPesan");
                                                            }}><i className="fas fa-paper-plane"></i> Kirim Pesan</button>
                                                        </div>
                                                        <p></p>
                                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                                            <button className="btn btn-primary btn-sm w-50" onClick={() => this.modalAutoText(div)}><i className="fas fa-keyboard"></i> Auto Text</button>
                                                            <button className="btn btn-danger btn-sm w-50" onClick={(e) => this.modalSetting(div)}><i className="fas fa-tools"></i> Setting</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Row4>
                                        )
                                    })
                                    }
                                    <Row4>
                                        <div className='card card-shadow' onClick={() => this.modalTambahDevice()}>
                                            <div className='card-body d-flex justify-content-center align-items-center' style={{ minHeight: "710px", cursor: "pointer" }}>
                                                <center>
                                                    <i className='fas fa-plus'></i>
                                                    <p></p>
                                                    <h6>Tambah Device</h6>
                                                </center>
                                            </div>
                                        </div>
                                    </Row4>
                                </Row>
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                            </div >
                            : <DivAksesDitolak />}
                </div>

                <Suspense><ModalSettingAi Detail={this.state.Detail} PerusahaanID={this.state.PerusahaanID} submit={() => document.getElementById('btnTutupModalSettingAI').click()} /></Suspense>
                <Suspense><ModalFormAutoText DeviceID={this.state.Detail.ID} PerusahaanID={this.state.PerusahaanID} DataAutoText={this.state.DataAutoText} submit={() => document.getElementById('btnTutupModalAutoText').click()} /></Suspense>
                <Suspense><ModalSettingDevice Detail={this.state.Detail} DataProdukDevice={this.state.DataProdukDevice} submit={() => document.getElementById('btnTutupSetting').click()} /></Suspense>

                <Modal id='modalBlash' className='modal-lg' title="Broadcast / Blash Pesan" form={true} onSubmit={(e) => this.handleBlash(e)}>
                    <ModalBody>
                        <FormInput type='textarea' label='Pesan' rows='20' value={this.state.Pesan} onChange={(e) => this.setState({ Pesan: e.target.value })} placeholder={PlaceHolder} required={true} />
                        <p></p>
                        <h6>Attach File</h6>
                        <button type='button' className='btn btn-default-soft' onClick={() => {
                            this.setState({ IsShowFile: true }, () => openModal("modalFile"))
                        }}><i className="fas fa-paperclip"></i> Pilih File</button>
                        <p></p>
                        {
                            this.state.Attach == "" ? "" :
                                <div className='card shadow'>
                                    <div className='card-body'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div>
                                                <img src={host + "file/" + this.state.Attach} width="50px" height="50px" /> <spam>{this.state.Attach}</spam>
                                            </div>
                                            <i className='fas fa-trash-alt' onClick={(e) => this.setState({ Attach: "" })}></i>
                                        </div>
                                    </div>
                                </div>
                        }
                        <p></p>
                        {
                            this.state.Delay == "" ? "" : <h6 style={{ textAlign: "center" }}>Mengirim Pesan lagi dalam {this.state.Delay / 1000} detik</h6>
                        }
                        <Suspense>
                            <RendTable
                                tbody={Kontak}
                                thead={[
                                    { cap: "", sort: "", type: "opsi" },
                                    { cap: "Nama", sort: "Nama", type: "str" },
                                    { cap: "WhatsApp", sort: "Telp", type: "str" },
                                    { cap: "Status", sort: "stts", type: "str" },
                                ]}
                                id="tableKontak"
                                opt={[
                                    { icon: "checkbox", fn: (e) => this.handlePilihKontak(e) }
                                ]}
                            />
                        </Suspense>
                        <button className='btn btn-link' type='button' onClick={() => openModal("modalTermCondition")}>Term & Condition</button>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDevice">
                        <button className='btn btn-danger' type='submit'><i className='fas fa-send'></i> Kirim</button>
                    </ModalFooter>
                </Modal>

                <Modal id="modalTermCondition" className='modal-xl' title="Term & Condition Penggunaan Broadcast">
                    <ModalBody>
                        <b>Penting:</b> Penggunaan fitur broadcast WhatsApp secara masif dan berlebihan sangat berisiko. Kami tidak bertanggung jawab jika akun Anda diblokir oleh WhatsApp karena aktivitas yang melanggar kebijakan penggunaan mereka.
                        <p></p>
                        <b>Peringatan Penggunaan Broadcast WhatsApp</b><p></p>
                        Penggunaan fitur broadcast WA harus dilakukan dengan bijak. Harap diperhatikan bahwa pengiriman pesan broadcast dalam jumlah yang sangat besar dan frekuensi yang terlalu sering berpotensi melanggar kebijakan WhatsApp.
                        <br></br>
                        Risiko utama dari pelanggaran ini adalah pemblokiran akun WA Anda, baik sementara maupun permanen. Kami menghimbau Anda untuk menggunakan fitur ini secara bertanggung jawab untuk menghindari konsekuensi tersebut. Kami tidak dapat memberikan ganti rugi atau bantuan teknis jika akun Anda terkena sanksi oleh pihak WhatsApp.

                        <p></p>
                        <b>Syarat & Ketentuan Penggunaan Broadcast WhatsApp</b>
                        <br></br>
                        <b>Batasan Penggunaan:</b> Pengguna menyadari bahwa penggunaan fitur broadcast WA harus sesuai dengan kebijakan penggunaan yang ditetapkan oleh WhatsApp. Pengguna dilarang mengirim pesan broadcast dalam jumlah masif dan dalam waktu singkat karena hal ini dapat dianggap sebagai spam.
                        <br></br>
                        <b>Tanggung Jawab Pengguna:</b> Seluruh tanggung jawab atas penggunaan fitur broadcast, termasuk risiko pemblokiran akun, sepenuhnya berada pada pengguna. Kami tidak bertanggung jawab atas kerugian atau sanksi apa pun yang dialami oleh pengguna akibat melanggar kebijakan WhatsApp.
                        <br></br>
                        <b>Bukan Tanggung Jawab Kami:</b> Kami tidak memiliki kewenangan atau kendali atas kebijakan yang diterapkan oleh pihak WhatsApp. Setiap tindakan pemblokiran akun yang dilakukan oleh WhatsApp adalah di luar tanggung jawab kami.
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupmodalTermCondition" />
                </Modal>

                <Modal id='modalFormDevice' title={ID == "" ? "Tambah Device" : "Edit Device"} form={true} onSubmit={(e) => submitForm(e, { crud: "adddevice", fn: () => this.handleMain() })}>
                    <ModalBody>
                        <input type='hidden' name="act" value={ID == "" ? "tambah device" : "edit device"} />
                        <input type='hidden' name="ID" value={ID} />
                        <FormInput type='text' label="Nama Device" name='Nama' placeholder='Nama Device' value={Detail.Nama} onChange={(e) => this.handleChange(e)} required={true} />
                        <FormInput type='number' label="Nomor WhatsApp" name='Telp' placeholder='Nomor Wa' value={Detail.Telp} onChange={(e) => this.handleChange(e)} required={true} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDevice">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i>Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalKirimPesan' title="Kirim Pesan" form={true} onSubmit={(e) => this.handleKirimPesan(e)}>
                    <ModalBody>
                        <input type="hidden" name="PerusahaanID" value={Detail.PerusahaanID} />
                        <FormInput type='number' label="Nomor" placeholder='Nomor' value={this.state.Nomor} onChange={(e) => this.setState({ Nomor: e.target.value })} required={true} />
                        <FormInput type='textarea' label="Pesan" placeholder='Tulis Pesan' value={this.state.Pesan} onChange={(e) => this.setState({ Pesan: e.target.value })} required={true} />
                        <h6>Attach File</h6>
                        <button type='button' className='btn btn-default-soft' onClick={async (e) => {
                            this.setState({ IsShowFile: true }, () => openModal("modalFile"));
                        }}><i className="fas fa-paperclip"></i> Pilih File</button>
                        <p></p>
                        {
                            this.state.Attach == "" ? "" :
                                <div className='card shadow'>
                                    <div className='card-body'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div>
                                                <img src={host + "file/" + this.state.Attach} width="50px" height="50px" /> <spam>{this.state.Attach}</spam>
                                            </div>
                                            <i className='fas fa-trash-alt' onClick={(e) => this.setState({ Attach: "" })}></i>
                                        </div>
                                    </div>
                                </div>
                        }
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalKirimPesan">
                        <button className='btn btn-danger' type='submit'><i className='fas fa-send'></i>Kirim</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalFile' title="File Manager" className='modal-xl' form={false} onClose={() => this.setState({ IsShowFile: false })}>
                    <ModalBody>
                        <Suspense>
                            {this.state.IsShowFile && <FileManager handleclick={(fil) => {
                                this.setState({ Attach: fil.Link, IsShowFile: false });
                                document.getElementById('btnTutupModalFile').click();
                            }} />
                            }
                        </Suspense>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalFile" />
                </Modal>

                <Modal id='modalKontak' title="Kontak" form={false}>
                    <ModalBody>
                        <Suspense>
                            <RendTable
                                tbody={this.state.Kontak}
                                thead={[
                                    { cap: "Nama", sort: "Nama", type: "str" },
                                    { cap: "Nomor", sort: "Nomor", type: "str" },
                                ]}
                            />
                        </Suspense>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalKontak" />
                </Modal>

                <Modal id='modalLead' className='modal-xl' title="Data Lead Masuk">
                    <ModalBody>
                        <Suspense>
                            <RendTable
                                thead={[
                                    { cap: "Pelanggan", sort: "Pelanggan", type: "str" },
                                    { cap: "Keterangan", sort: "Keterangan", type: "str" },
                                    { cap: "Status", sort: "Status", type: "str" }
                                ]}
                                tbody={this.state.DataLead}
                                group={[
                                    { cap: "Tanggal", sort: "Tanggal", type: "datetime" }
                                ]}
                            />
                        </Suspense>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalLead" />
                </Modal>

                <Modal id='modalLogin' title="Login Ke Wa" form={false} >
                    <ModalBody>
                        <center>
                            {
                                qrCode != "" && <QRCodeCanvas value={qrCode} size={256} />
                            }
                        </center>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalLogin" />
                </Modal>

                <Modal id='modalLogout' title="Keluar dari Wa" form={true} onSubmit={(e) => this.handleLogout(e)} >
                    <ModalBody>
                        <h6>Apakah anda yakin akan mengeluarkan device dari WA</h6>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalLogout" >
                        <button type='submit' className='btn btn-danger'>Keluar</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalPaket' className='modal-xl' title="Paket Perpanjangan">
                    <ModalBody>
                        <Tabs header={[
                            {
                                title: "Paket Perpanjang", id: "TabPerpanjang", fn: async () => {
                                    let sql = await api("datapaket", { IsTrial: "0", PaketType: "Register" });
                                    if (sql.status == "sukses") this.setState({ DataPaket: sql.data, PaketType: "Register" });
                                }
                            },
                            {
                                title: "Paket TopUp", id: "TabTopUp", fn: async () => {
                                    let sql = await api("datapaket", { IsTrial: "0", PaketType: "Top Up" });
                                    if (sql.status == "sukses") this.setState({ DataPaket: sql.data, PaketType: "Top Up" });
                                }
                            },
                        ]} >
                            <div>
                                <div className='d-flex justift-content-start align-items-center gap-2' style={{ overflowX: "auto" }}>
                                    <Suspense>
                                        {
                                            this.state.DataPaket.map((div, i) => {
                                                return <CardProduk opt={div} handleclick={(opt) => this.handlePilihPaket(opt)} />
                                            })
                                        }
                                    </Suspense>
                                </div>
                            </div>
                            <div>
                                <div className='d-flex justift-content-start align-items-center gap-2' style={{ overflowX: "auto" }}>
                                    <Suspense>
                                        {
                                            this.state.DataPaket.map((div, i) => {
                                                return <CardProduk opt={div} handleclick={(opt) => this.handlePilihPaket(opt)} />
                                            })
                                        }
                                    </Suspense>
                                </div>
                            </div>
                        </Tabs>

                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalPaket" />
                </Modal>

                <Modal id='modalPayment' className='modal-lg' title="Regristrasi" form={true} validationRef={this.validationRef} onSubmit={(e) => DxSubmitForm(e, this.validationRef, { crud: "crudclient", fn: () => this.handleMain() })}>
                    <ModalBody>
                        <input type='hidden' name='act' value="request perpanjang" />
                        <input type='hidden' name='DeviceID' value={this.state.Detail.ID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='PaketID' value={this.state.DetailPaket.ID} />
                        <Suspense><CardPayment /></Suspense>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalPayment" >
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i> Proses</button>
                    </ModalFooter>
                </Modal>
            </Fragment >
        )
    }

}

export default Main;
