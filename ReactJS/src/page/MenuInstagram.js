import React, { Fragment } from 'react';
import { pesan, submitForm, openModal, host, spinText, api, saiki, cekProfile, DivAksesDitolak, DivExpired, VideoCard } from '../Modul';
import { FormControl, FormSwitch, FormInput, FormTextarea } from '../component/FormInput';
import RendTable from '../component/RendTable';
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { Row, Row6, Row4, Row3, Row9 } from '../component/Rows';
import SocketContext from "../SocketContext";
import '../Chat.css';
import imgAI from '../assets/img/AI.png';
import imgAF from '../assets/img/autofollow.png';
import imgPS from '../assets/img/postig.png';
import imgLK from '../assets/img/likeig.png';
import imgBC from '../assets/img/bcig.png';
import imgIF from '../assets/img/infoig.png';

class Main extends React.Component {
    static contextType = SocketContext;
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
            DetailProfile: {},
            ID: "",
            ModeView: localStorage.getItem('ModeView') || "blash",
            Pesan: "",
            LoginStatus: false,
            DataHistory: [],
            ExpandGrid: false,
            DataChat: [],
            DetailChat: [],
            Delay: "",
            DataAutoText: [],
            DataFile: [],
            Attach: [],
            DataLead: [],
            Telp: "",
            Prompt: "",
            Gambar: "",
            choose: false,
            activeTabs: "post",
            DataFollower: [],
            DataFollowing: []
        };
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data });
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
        this.handleMain();
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

    async handleGenerateGambar(e) {
        let btn = e.target;
        btn.disabled = true;
        btn.innerText = 'Sedang melukis . . .';
        let Prompt = "Buatkan gambar untuk Feed di Instagram dengan deskripsi : " + this.state.Prompt;
        let sql = await api("generateimage", { Prompt: Prompt });
        if (sql.status == "sukses") {
            this.setState({ Gambar: sql.pesan });
            btn.disabled = false;
            btn.innerText = "Geberate Gambar";
        } else {
            pesan("Gagal", sql.pesan, "warning");
            btn.disabled = false;
            btn.innerText = "Geberate Gambar";
        }
    }

    async handleModalLogin(data) {
        this.setState({ Detail: data, ID: data.ID });
        openModal("modalLogin");
    }

    handleCloseModalLogin() {
        if (this.qrInterval) {
            clearInterval(this.qrInterval);
            this.qrInterval = null;
        }
        this.setState({ qrCode: null });
    }

    async cekStatus(sessionId = "Gijutsu-cs") {
        let sql = await api("qr", { sessionId }, true);
        return sql;
    }

    async handleModalLogout(Telp) {
        let sql = await api("status", { Telp });
        if (sql.status == "sukses") {
            if (sql.connected == true) {
                this.setState({ ID: Telp });
                openModal("modalLogout");
            } else {
                await api("logout", { Telp });
            }
        } else {
            pesan("Gagal", sql.pesan, "error");
        }
    }

    async handleLogout(e) {
        e.preventDefault();
        e.stopPropagation();
        let sql = await api("logout", { Telp: this.state.ID });
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
        let sql = await api("datadeviceig", { id: "" });
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

    async handleModalGroup(Telp, PerusahaanID, choose = false) {
        let sql = await api("listgroup", { Telp, PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ DataGroup: sql.data, choose });
            openModal("modalGroup");
        } else {
            pesan("Peringatan", sql.pesan, "error");
        }
    }

    async handleTyping(e) {
        if (e.key == "Enter") {
            let Detail = this.state.Detail;
            let sql = await api("send", {
                Telp: this.state.Telp,
                number: Detail.Telp,
                message: e.target.value,
                PerusahaanID: Detail.PerusahaanID
            });
            if (sql.status == "sukses") {
                let DetailChat = this.state.DetailChat;
                DetailChat.push({ Waktu: saiki(), Pesan: e.target.value, UserType: "Admin", Telp: Detail.Telp, DeviceID: this.state.ID, PerusahaanID: this.state.PerusahaanID });
                e.target.value = "";
                this.setState({ DetailChat });
            }
        } else {
            const socket = this.context;
            socket.send(JSON.stringify({ type: "typing", telp: e.target.value, data: "Hello Server" }));
        }
    }

    async modalSetting(data) {
        let sql = await api("detaildevice", { ID: data.ID });
        console.log(sql.data);
        if (sql.status == "sukses") {
            this.setState({ Detail: sql.data });
            openModal("modalSetting");
        }
    }

    handlePilihGroup(e) {
        if (this.state.choose != false) {
            let data = e.data;
            let Detail = this.state.Detail;
            if (this.state.choose == "report") {
                Detail.GroupReportID = data.ID;
                Detail.GroupReport = data.subject;
                this.setState({ Detail, choose: false });
            } else {
                Detail.GroupPaymentID = data.ID;
                Detail.GroupPayment = data.subject;
                this.setState({ Detail, choose: false, DataMember: [] });
            }
            document.getElementById('btnTutupModalGroup').click();
        }
    }

    async handleModalMember() {
        let Detail = this.state.Detail;
        if (Detail.GroupPaymentID != "none") {
            let sql = await api("listmember", { GroupID: Detail.GroupPaymentID, Telp: Detail.Telp });
            if (sql.status == "sukses") {
                this.setState({ DataMember: sql.data });
                openModal("modalMember");
            }
        } else {
            pesan("Info", "Silahkan pilih Group Pembayaran terlebih dahulu", "warning");
        }
    }

    async handleModalCheckProfile(e, data) {
        let btn = e.target;
        btn.disabled = true;
        let span = document.getElementById('lblIF');
        span.innerText = "Mengambil data . .";
        let sql = await api("profileig", { UserName: data.SessionsID, Email: data.Telp, ID: data.ID });
        if (sql.status == "sukses") {
            this.setState({ DetailProfile: sql.data, Detail: data });
            openModal("modalGroup");
            btn.disabled = false;
            span.innerText = "Check Profile";
        } else {
            pesan("Gagal", sql.pesan, "warning");
            btn.disabled = false;
            span.innerText = "Check Profile";
        }
    }

    render() {
        let { Data, Detail, DetailProfile, ID, Kontak } = this.state;
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
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className="main-title">Instagram Agent</div>
                                    <button className='btn btn-default' onClick={() => this.modalTambahDevice()}>Tambah Device</button>
                                </div>
                                <p></p>
                                <Row>
                                    {Data.map((div, i) => {
                                        return (
                                            <Row4 key={i}>
                                                <div className='card shadow-lg' style={{ borderRadius: "20px" }}>
                                                    <div className='card-header card-ig d-flex justify-content-between align-items-center'>
                                                        <h6>{div.Nama} - {div.WhatsApp}</h6>
                                                        {
                                                            div.IsLogin == 1 ?
                                                                <button className='btn btn-sm btn-default-soft' onClick={() => this.handleModalLogout(div.Telp)}><i className="fas fa-sign-out-alt"></i> Logout</button>
                                                                :
                                                                <button className='btn btn-sm btn-default' onClick={() => this.handleModalLogin(div)}><i className="fas fa-qrcode"></i> Login Instagram</button>
                                                        }
                                                    </div>
                                                    <div className='card-body'>
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
                                                                                        <img src={imgBC} width="20px" height="20px" /> Broadcast / Follow Up
                                                                                    </div>
                                                                                </td>
                                                                                <td>{div.MaxBroadcast}</td>
                                                                                <td>{div.Broadcast}</td>
                                                                                <td>{div.MaxBroadcast - div.Broadcast}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                                                        <img src={imgAF} width="20px" height="20px" /> Auto Follow
                                                                                    </div>
                                                                                </td>
                                                                                <td>{div.MaxBroadcast}</td>
                                                                                <td>{div.Broadcast}</td>
                                                                                <td>{div.MaxBroadcast - div.Broadcast}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <button className="btn btn-ig w-100" onClick={() => this.modalSettingAI(div.ID)}><img src={imgAI} width="20px" height="20px" />Setting AI</button>
                                                        <p></p>
                                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                                            <button className="btn btn-ig btn-sm w-50" disabled={div.IsLogin == 1 ? false : true} onClick={(e) => this.handleModalCheckProfile(e, div)}><img src={imgIF} width="20px" height="20px" /> <span id='lblIF'>Check Profile</span></button>
                                                            <button className="btn btn-ig btn-sm w-50"><img src={imgAF} width="20px" height="20px" /> Auto Follow</button>
                                                        </div>
                                                        <p></p>
                                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                                            <button className="btn btn-ig btn-sm w-50" disabled={div.IsLogin == 1 ? false : true} onClick={(e) => this.handleModalBlash(div.Telp, div.PerusahaanID)}><img src={imgBC} width="20px" height="20px" /> Blash / Broadcast</button>
                                                            <button className="btn btn-ig w-50" disabled={div.IsLogin == 1 ? false : true} onClick={(e) => {
                                                                this.setState({ ID: div.Telp, Detail: div });
                                                                openModal("modalKirimPesan");
                                                            }}><img src={imgPS} width="20px" height="20px" /> Post Media</button>
                                                        </div>
                                                        <p></p>
                                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                                            <button className="btn btn-ig btn-sm w-50" onClick={() => this.modalAutoText(div)}><img src={imgLK} width="20px" height="20px" /> Auto Like</button>
                                                            <button className="btn btn-danger btn-sm w-50" onClick={(e) => this.modalSetting(div)}><i className="fas fa-tools"></i> Setting</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Row4>
                                        )
                                    })
                                    }
                                </Row>
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                            </div>
                            : <DivAksesDitolak />}
                </div >

                <Modal id='modalSettingAI' className='modal-xl' title="Setting AI Asisten" form={true} onSubmit={(e) => submitForm(e, { crud: "settingai", fn: () => this.handleMain() })}>
                    <ModalBody>
                        <input type='hidden' name="ID" value={ID} />
                        <input type='hidden' name="IsAiActive" value={Detail.IsAiActive || 0} />
                        <input type='hidden' name="IsUsingBot" value={Detail.IsUsingBot || 0} />
                        <input type='hidden' name="IsSwitch" value={Detail.IsSwitch || 0} />
                        <FormInput type='text' name='Produk' label="Nama Produk / Jasa" placeholder='Isi Informasi mengenai nama produk / jasa anda' value={Detail.Produk || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <FormInput type='textarea' name='ClosingText' rows={10} label="Kalimat atau kata-kata closing" placeholder='Silahkan template closing text' value={Detail.ClosingText || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <FormInput type='textarea' name='Otak' rows={30} label="Informasi Untuk AI" placeholder='Silahkan isi Informasi untuk di pelajari oleh AI' value={Detail.Otak || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <p></p>
                        <div className='d-flex gap-2'>
                            <FormSwitch id='chkIsAiActive' label={Detail.IsAiActive == 1 ? "AI Aktif" : "AI Tidak Aktif"} onChange={(e) => {
                                let data = this.state.Detail;
                                data.IsAiActive = e.target.checked == true ? 1 : 0;
                                this.setState({ Detail: data });
                            }} checked={Detail.IsAiActive} />
                            <FormSwitch id='chkIsUsingBot' label={Detail.IsUsingBot == 1 ? "Bot Aktif" : "Bot Tidak Aktif"} onChange={(e) => {
                                let data = this.state.Detail;
                                data.IsUsingBot = e.target.checked == true ? 1 : 0;
                                this.setState({ Detail: data });
                            }} checked={Detail.IsUsingBot} />
                        </div>
                        <FormSwitch id='chkIsSwitch' label={Detail.IsSwitch == 1 ? "Otomatis Switch Aktif" : "Otomatis Switch Mati"} onChange={(e) => {
                            let data = this.state.Detail;
                            data.IsSwitch = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} checked={Detail.IsSwitch} />
                        <Row>
                            <Row6><FormInput type='time' name='TimeStart' label="Waktu Aktif" value={Detail.TimeStart || "17:00"} onChange={(e) => this.handleChange(e)} required={true} /></Row6>
                            <Row6><FormInput type='time' name='TimeEnd' label="Waktu Mati" value={Detail.TimeEnd || "07:00"} onChange={(e) => this.handleChange(e)} required={true} /></Row6>
                        </Row>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalSettingAI">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i>Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalSetting' className='modal-lg' title="Setting Device" form={true} onSubmit={(e) => submitForm(e, { crud: "adddevice", fn: () => this.handleMain() })}>
                    <ModalBody>
                        <input type='hidden' name="ID" value={Detail.ID} />
                        <input type='hidden' name="act" value="edit" />
                        <input type='hidden' name="IsUsingBot" value={Detail.IsUsingBot || 0} />
                        <input type='hidden' name="IsTakeOverAdmin" value={Detail.IsTakeOverAdmin || 1} />
                        <FormInput type='text' name='Nama' label="Nama" placeholder='Nama Device' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <FormInput type='text' name='Telp' label="UserName" placeholder='No Wa Device' value={Detail.Telp || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <FormSwitch id='chkIsUsingBot2' label={Detail.IsUsingBot == 1 ? "Bot Aktif" : "Bot Tidak Aktif"} onChange={(e) => {
                            let data = this.state.Detail;
                            data.IsUsingBot = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} checked={Detail.IsUsingBot} />
                        <FormSwitch id='chkIsTakeOverAdmin' label={Detail.chkIsTakeOverAdmin == 1 ? "Otomatis Ambil Alih admin Aktif" : "Otomatis Ambil Alih admin Mati"} onChange={(e) => {
                            let data = this.state.Detail;
                            data.chkIsTakeOverAdmin = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} checked={Detail.chkIsTakeOverAdmin} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalSetting">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i>Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalBlash' className='modal-lg' title="Broadcast / Blash Pesan" form={true} onSubmit={(e) => this.handleBlash(e)}>
                    <ModalBody>
                        <FormInput type='textarea' label='Pesan' rows='20' value={this.state.Pesan} onChange={(e) => this.setState({ Pesan: e.target.value })} placeholder={PlaceHolder} required={true} />
                        <p></p>
                        <h6>Attach File</h6>
                        <button type='button' className='btn btn-default-soft' onClick={async (e) => {
                            let sql = await api("datafile", { PerusahaanID: Detail.PerusahaanID });
                            if (sql.status == "sukses") {
                                this.setState({ DataFile: sql.data });
                                openModal("modalFile");
                            }
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
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDevice">
                        <button className='btn btn-danger' type='submit'><i className='fas fa-send'></i> Kirim</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalAutoText' className='modal-lg' title="Database Autotext" form={true} onSubmit={(e) => submitForm(e, { crud: "updateautotext", fn: () => this.handleMain(this.state.PerusahaanID) })}>
                    <ModalBody>
                        <input type='hidden' name='AutoText' value={JSON.stringify(this.state.DataAutoText)} />
                        <input type='hidden' name='DeviceID' value={Detail.ID} />
                        <input type='hidden' name='PerusahaanID' value={Detail.PerusahaanID} />
                        <div className='table-responsive'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Pertanyaan</th>
                                        <th>Jawaban</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.DataAutoText.map((td, i) => {
                                            return (<tr key={i}>
                                                <td><i className='fas fa-trash-alt' onClick={() => {
                                                    let data = this.state.DataAutoText;
                                                    delete data[i];
                                                    this.setState({ DataAutoText: data });
                                                }}></i></td>
                                                <td><FormControl value={td.Pertanyaan} required={true} onChange={(e) => {
                                                    let data = this.state.DataAutoText;
                                                    data[i].Pertanyaan = e.target.value;
                                                    this.setState({ DataAutoText: data });
                                                }} /></td>
                                                <td><FormTextarea value={td.Jawaban} required={true} onChange={(e) => {
                                                    let data = this.state.DataAutoText;
                                                    data[i].Jawaban = e.target.value;
                                                    this.setState({ DataAutoText: data });
                                                }} /></td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                            <button className='btn btn-default w-100' type='button' onClick={() => {
                                let data = this.state.DataAutoText;
                                data.push({ Pertanyaan: "", Jawaban: "" });
                                this.setState({ DataAutoText: data });
                            }}>Tambah Data</button>
                        </div>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalAutoText">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalFormDevice' title={ID == "" ? "Tambah Device" : "Edit Device"} form={true} onSubmit={(e) => submitForm(e, { crud: "adddeviceig", fn: () => this.handleMain() })}>
                    <ModalBody>
                        <input type='hidden' name="act" value={ID == "" ? "tambah device" : "edit device"} />
                        <input type='hidden' name="ID" value={ID} />
                        <FormInput type='text' label="Nama Device" name='Nama' placeholder='Nama Device' value={Detail.Nama} onChange={(e) => this.handleChange(e)} required={true} />
                        <FormInput type='text' label="UserName Instagram" name='Telp' placeholder='UserName' value={Detail.Telp} onChange={(e) => this.handleChange(e)} required={true} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDevice">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i>Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalGroup' title="Data Group" className='modal-lg' >
                    <ModalBody>
                        <Row>
                            <Row3>
                                <img src={host + "proxy-img?url=" + Detail.profile_pic_url} width="100px" height="100px" style={{ borderRadius: "50%" }} />
                            </Row3>
                            <Row9>
                                <h6>{DetailProfile.username}</h6>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <span>{DetailProfile.media_count} Post</span>
                                    <span>{DetailProfile.follower_count} Follower</span>
                                    <span>{DetailProfile.following_count} Following</span>
                                </div>
                            </Row9>
                        </Row>
                        <div className='container'>
                            <div className="tabs-new">
                                <input type="radio" id="tabsSatu" name="tabs" className='input-radio' checked={this.state.activeTabs == "post" ? true : false} onChange={(e) => this.setState({ activeTabs: "post" })} />
                                <label className="tab-new" for="tabsSatu">Post<span className="notification-new">{DetailProfile.media_count}</span></label>
                                <input type="radio" id="tabsDua" name="tabs" className='input-radio' onChange={async (e) => {
                                    let span = document.getElementById('spanFollower');
                                    span.className = 'spinner-border spinner-border-sm text-primary';
                                    span.innerText = ""
                                    let sql = await api("getfollower", { UserName: "heru_in@localhost", targetUsername: Detail.username });
                                    if (sql.status == "sukses") this.setState({ DataFollower: sql.data, activeTabs: "follower" });
                                    span.className = 'notification-new';
                                    span.innerText = DetailProfile.follower_count;
                                }} checked={this.state.activeTabs == "follower" ? true : false} />
                                <label className="tab-new" for="tabsDua">Follower<span className="notification-new" id='spanFollower'>{DetailProfile.follower_count}</span></label>
                                <input type="radio" id="tabsTiga" name="tabs" className='input-radio' checked={this.state.activeTabs == "following" ? true : false} onChange={(e) => this.setState({ activeTabs: "following" })} />
                                <label className="tab-new" for="tabsTiga">Following<span className="notification-new">{DetailProfile.following_count}</span></label>
                                <span className="glider-new"></span>
                            </div>
                            <RendTable
                                thead={[
                                    { cap: "ID", sort: "pk", type: "str" },
                                    { cap: "UserName", sort: "username", type: "str" },
                                    { cap: "Nama", sort: "full_name", type: "str" },
                                ]}
                                tbody={this.state.DataFollower}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalGroup" />
                </Modal>

                <Modal id='modalKirimPesan' title="Post Media" form={true} onSubmit={(e) => submitForm(e, { crud: 'postmediaig', fn: () => this.handleMain(), debug: true })}>
                    <ModalBody>
                        <input type="hidden" name="UserName" value={Detail.SessionsID} />
                        <input type="hidden" name="ImagePath" value={JSON.stringify(this.state.Attach)} />
                        <FormInput type='textarea' label="Caption" placeholder='Silahkan isi caption' value={this.state.Pesan} onChange={(e) => this.setState({ Pesan: e.target.value })} required={true} />
                        <FormInput type='textarea' label="Buat Gambar dengan AI" placeholder='Silahkan Tuliskan Prompt' value={this.state.Prompt} onChange={(e) => this.setState({ Prompt: e.target.value })} />
                        <button type='button' className='btn btn-default btn-sm w-100' onClick={(e) => this.handleGenerateGambar(e)}>Generate Gambar</button>
                        {
                            this.state.Gambar == "" ? "" :
                                <div className='card'>
                                    <div className='card-body'>
                                        <img src={'data:image/png;base64,' + this.state.Gambar} style={{ width: "100%" }} />
                                        <p></p>
                                        <div className='d-flex gap-2'>
                                            <button type='button' className='btn w-50 btn-sm btn-default'><i className='fas fa-save'></i> Simpan</button>
                                            <button type='button' className='btn w-50 btn-sm btn-danger'><i className='fas fa-trash-alt'></i> Hapus</button>
                                        </div>
                                    </div>

                                </div>
                        }

                        <b>Media</b>
                        <p></p>
                        <button type='button' className='btn btn-default-soft' onClick={async (e) => {
                            let sql = await api("datafile", { PerusahaanID: Detail.PerusahaanID });
                            if (sql.status == "sukses") {
                                this.setState({ DataFile: sql.data });
                                openModal("modalFile");
                            }
                        }}><i className="fas fa-paperclip"></i> Pilih Media</button>
                        <p></p>
                        {
                            this.state.Attach.map((img, i) => {
                                return (
                                    <div className='card shadow' key={i}>
                                        <div className='card-body'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div>
                                                    <img src={host + "file/" + img} width="50px" height="50px" style={{ objectFit: "cover" }} /> <spam>{img}</spam>
                                                </div>
                                                <i className='fas fa-trash-alt' onClick={(e) => {
                                                    let Attach = this.state.Attach;
                                                    delete Attach[i];
                                                    this.setState({ Attach });
                                                }}></i>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalKirimPesan">
                        <button className='btn btn-danger' type='submit'><i className='fas fa-send'></i>Kirim</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalFile' title="File Manager" className='modal-xl' form={false}>
                    <ModalBody>
                        <Row>
                            {
                                this.state.DataFile.map((fil, i) => {
                                    return (<div className='col-md-3' key={i} onClick={(e) => {
                                        let Attach = this.state.Attach;
                                        Attach.push(fil.Link);
                                        this.setState({ Attach });
                                        document.getElementById('btnTutupModalFile').click();
                                    }}>
                                        <img src={`${host}file/${fil.Link}`} width="100%" />
                                    </div>)
                                })
                            }
                        </Row>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalFile" />
                </Modal>

                <Modal id='modalKontak' title="Kontak" form={false}>
                    <ModalBody>
                        <RendTable
                            tbody={this.state.Kontak}
                            thead={[
                                { cap: "Nama", sort: "Nama", type: "str" },
                                { cap: "Nomor", sort: "Nomor", type: "str" },
                            ]}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalKontak" />
                </Modal>

                <Modal id='modalLogin' title="Login Ke Wa" form={true} onSubmit={(e) => submitForm(e, { crud: "loginig", fn: () => this.handleMain(), debug: true })} >
                    <ModalBody>
                        <input type='hidden' name='ID' value={ID} />
                        <FormInput label='Username' name='Username' value={Detail.Username || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <FormInput type='password' label='Password' name='Password' value={Detail.Password || ""} onChange={(e) => this.handleChange(e)} required={true} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalLogin" >
                        <button type='submit' className='btn btn-default'><i className='fas fa-login'></i> Login</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalLogout' title="Keluar dari Wa" form={true} onSubmit={(e) => this.handleLogout(e)} >
                    <ModalBody>
                        <h6>Apakah anda yakin akan mengeluarkan device dari WA</h6>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalLogout" >
                        <button type='submit' className='btn btn-danger'>Keluar</button>
                    </ModalFooter>
                </Modal>
            </Fragment >
        )
    }

}

export default Main;
