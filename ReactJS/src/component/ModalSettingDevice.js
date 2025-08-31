import React, { Fragment, Suspense, lazy } from "react";
import { Modal, ModalBody, ModalFooter } from './Modal.js';
import { DxFormInput, FormSwitch, FormInput, FormControl } from './FormInput.js';
import { Row, Row6 } from './Rows.js'
import { DxSubmitForm, pesan, api, openModal } from "../Modul.js";

const RendTable = lazy(() => import('../component/RendTable'));

export default class ModalSettinfDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: {},
            DataProdukDevice: [],
            ID: "",
            DataGroup: [],
            DataMember: []
        };
        this.validationForm = React.createRef();
    }

    componentDidMount() {
        this.setState({ Detail: this.props.Detail, DataProdukDevice: this.props.DataProdukDevice });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Detail !== this.props.Detail || prevProps.DataProdukDevice !== this.props.DataProdukDevice) {
            this.setState({ Detail: this.props.Detail, DataProdukDevice: this.props.DataProdukDevice });
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    handleCopy(text) {
        window.navigator.clipboard.writeText(text);
        pesan("Berhasil", "Berhasil Copy to clipboard", "info");
    }

    async handleModalGroup(Telp, PerusahaanID, choose = false) {
        let sql = await api("listgroup", { Telp, PerusahaanID });
        console.log(sql);
        if (sql.status == "sukses") {
            this.setState({ DataGroup: sql.data, choose });
            openModal("modalGroup");
        } else {
            pesan("Peringatan", sql.pesan, "error");
        }
    }

    async handleModalMember() {
        let Detail = this.state.Detail;
        if (Detail.GroupPaymentID != "none") {
            let sql = await api("listmember", { GroupID: Detail.GroupPaymentID, Telp: Detail.SessionsID });
            if (sql.status == "sukses") {
                this.setState({ DataMember: sql.data });
                openModal("modalMember");
            }
        } else {
            pesan("Info", "Silahkan pilih Group Pembayaran terlebih dahulu", "warning");
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
            let sql = await api("listmember", { GroupID: Detail.GroupPaymentID, Telp: Detail.SessionsID });
            if (sql.status == "sukses") {
                this.setState({ DataMember: sql.data });
                openModal("modalMember");
            }
        } else {
            pesan("Info", "Silahkan pilih Group Pembayaran terlebih dahulu", "warning");
        }
    }

    async handleChangeProduk(data) {
        let chk = document.getElementById(`tableProduk${data.ID}`);
        let Menu = this.state.DataProdukDevice;
        for (let dd in Menu) {
            if (Menu[dd].ID == data.ID) {
                Menu[dd].checked = chk.checked;
                if (chk.checked == false) {
                    let sql = await api("crudproduk", { act: "hapus produk device", ID: data.DeviceID, PerusahaanID: this.state.Detail.PerusahaanID });
                    if (sql.status == "sukses") {
                        this.setState({ DataProdukDevice: sql.data });
                    } else {
                        pesan("Gagal", sql.pesan, "warning");
                    }
                } else {
                    let sql = await api("crudproduk", { act: "tambah produk device", PerusahaanID: this.state.Detail.PerusahaanID, ID: data.ID, DeviceID: this.state.Detail.ID });
                    if (sql.status == "sukses") {
                        this.setState({ DataProdukDevice: sql.data });
                    } else {
                        pesan("Gagal", sql.pesan, "warning");
                    }
                }
            }
        }
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Fragment>
                <Modal id='modalSetting' className='modal-lg' title="Setting Device" form={true} validationRef={this.validationForm} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "settingdevice", fn: () => this.props.submit() })}>
                    <ModalBody>
                        <input type='hidden' name="ID" value={Detail.ID} />
                        <input type='hidden' name="GroupPaymentID" value={Detail.GroupPaymentID || "none"} />
                        <input type='hidden' name="GroupReportID" value={Detail.GroupReportID || "none"} />
                        <input type='hidden' name="IsUsingBot" value={Detail.IsUsingBot || 0} />
                        <input type='hidden' name="IsTakeOverAdmin" value={Detail.IsTakeOverAdmin} />
                        <input type='hidden' name="IsPrompt" value={Detail.IsPrompt} />
                        <input type='hidden' name="Setting" value={JSON.stringify(Detail.Setting)} />

                        <table className='table table-striped'>
                            <tbody>
                                <tr>
                                    <td>Api Keys</td>
                                    <td width="5px">:</td>
                                    <td>{Detail.ApiKeys} <i className='fas fa-copy' onClick={() => this.handleCopy(Detail.ApiKeys)}></i></td>
                                </tr>
                                <tr>
                                    <td>Device Keys</td>
                                    <td>:</td>
                                    <td>{Detail.SessionsID} <i className='fas fa-copy' onClick={() => this.handleCopy(Detail.SessionsID)}></i></td>
                                </tr>
                                {
                                    Detail.DeviceType == "Live Chat" &&
                                    <Fragment>
                                        <tr>
                                            <td>Download CDN</td>
                                            <td>:</td>
                                            <td>CDN Untuk Web <i className='fas fa-copy' onClick={() => this.handleCopy(`<script src="https://cdn.jsdelivr.net/gh/HeruPrasetia/cdn@v0.0.2/livechat/livechat.js" domain-server="${window.location.hostname}" client-key="${Detail.ApiKeys}" device-key="${Detail.SessionsID}"></script>`)}></i></td>
                                        </tr>
                                        <tr>
                                            <td>Download Add-ON WordPress</td>
                                            <td>:</td>
                                            <td>Download <i className='fas fa-download' onClick={() => window.open("https://wapi.naylatools.com/file/BantuWinLiveChat.zip")}></i></td>
                                        </tr>
                                    </Fragment>
                                }
                            </tbody>
                        </table>
                        <Row>
                            <Row6><DxFormInput type='text' name='Nama' label="Nama" placeholder='Nama Device' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, "Nama")} required={true} /></Row6>
                            <Row6><DxFormInput type='text' name='No. WhatsApp' label="Telp" placeholder='No Wa Device' value={Detail.Telp || "62"} onChange={(e) => this.handleChange(e, "Telp")} required={true} /></Row6>
                            {
                                Detail.DeviceType == "WA" &&
                                <Fragment>
                                    <Row6>
                                        <div className='form-group'>
                                            <label>Group Untuk Laporan</label>
                                            <div className='input-group'>
                                                <FormControl type='text' name='GroupReport' value={Detail.GroupReport} readOnly={true} />
                                                <button className='btn btn-default-soft' type='button' onClick={(e) => this.handleModalGroup(Detail.SessionsID, Detail.PerusahaanID, "report")}><i className='fas fa-search'></i></button>
                                                <button className='btn btn-danger' type='button' onClick={(e) => {
                                                    let Detail = this.state.Detail;
                                                    Detail.GroupReport = "";
                                                    Detail.GroupReportID = "none";
                                                    this.setState({ Detail });
                                                }}><i className='fas fa-trash-alt'></i></button>
                                            </div>
                                        </div>
                                    </Row6>
                                    <Row6><DxFormInput type='time' name='ReportTime' label="Waktu Kirim Laporan" value={Detail.ReportTime || "17:00"} onChange={(e) => this.handleChange(e, "ReportTime")} required={true} /></Row6>

                                    <Row6>
                                        <div className='form-group'>
                                            <label>Group Pembayaran</label>
                                            <div className='input-group'>
                                                <input type='text' className='form-control' name='GroupPayment' value={Detail.GroupPayment || ""} readOnly={true} />
                                                <button className='btn btn-default-soft' type='button' onClick={(e) => this.handleModalGroup(Detail.SessionsID, Detail.PerusahaanID, "payment")}><i className='fas fa-search'></i></button>
                                                <button className='btn btn-danger' type='button' onClick={(e) => {
                                                    let Detail = this.state.Detail;
                                                    Detail.GroupPayment = "";
                                                    Detail.GroupPaymentID = "none";
                                                    Detail.PaymentPIC = "";
                                                    this.setState({ Detail });
                                                }}><i className='fas fa-trash-alt'></i></button>
                                            </div>
                                        </div>
                                    </Row6>
                                    <Row6>
                                        <div className='form-group'>
                                            <label>PIC Pembayaran</label>
                                            <div className='input-group'>
                                                <input type='text' className='form-control' name='PaymentPIC' value={Detail.PaymentPIC || ""} readOnly={true} />
                                                <button className='btn btn-default-soft' type='button' onClick={(e) => this.handleModalMember()}><i className='fas fa-search'></i></button>
                                            </div>
                                        </div>
                                    </Row6>
                                </Fragment>
                            }
                        </Row>
                        <DxFormInput type='select' label='Triger Pengakuan sebagai lead' name="TrigerLead" value={Detail.TrigerLead || ""} onChange={(e) => this.handleChange(e, "TrigerLead")} required={true} data={[
                            { ID: "Nomor Baru", Nama: "Nomor Baru Chat" },
                            { ID: "Chat Baru", Nama: "Chat Baru dihari ini" },
                        ]} />
                        <FormSwitch id='chkIsUsingBot2' label={Detail.IsUsingBot == 1 ? "Bot Aktif" : "Bot Tidak Aktif"} onChange={(e) => {
                            let data = this.state.Detail;
                            data.IsUsingBot = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} checked={Detail.IsUsingBot} />
                        <FormSwitch id='chkIsTakeOverAdmin' label={Detail.IsTakeOverAdmin == 1 ? "Otomatis Ambilalih admin Aktif" : "Otomatis Ambilalih admin Mati"} onChange={(e) => {
                            let data = this.state.Detail;
                            data.IsTakeOverAdmin = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} checked={Detail.IsTakeOverAdmin} />
                        <FormSwitch id='chkIsPrompt' label="Rekomendasi Prompt" onChange={(e) => {
                            let data = this.state.Detail;
                            data.IsPrompt = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} checked={Detail.IsPrompt} />
                        {Detail.DeviceType == "Live Chat" &&
                            <Fragment>
                                <b>Setting Live Chat</b>
                                <Row>
                                    <Row6>
                                        <FormInput label='Title' value={Detail.Setting.title} onChange={(e) => {
                                            let Detail = this.state.Detail;
                                            let Setting = Detail.Setting;
                                            Setting.title = e.target.value;
                                            Detail.Setting = Setting;
                                            this.setState({ Detail });
                                        }} placeholder='Silahkan isi judul' required={true} />
                                    </Row6>
                                    <Row6>
                                        <FormInput label='Warna' type='color' value={Detail.Setting.color} onChange={(e) => {
                                            let Detail = this.state.Detail;
                                            let Setting = Detail.Setting;
                                            Setting.color = e.target.value;
                                            Detail.Setting = Setting;
                                            this.setState({ Detail });
                                        }} placeholder='Silahkan pilih color' required={true} />
                                    </Row6>
                                </Row>
                                <p></p>
                                <FormInput label='Jenis Tombol' type='select' value={Detail.Setting.jenismaskot} onChange={(e) => {
                                    let Detail = this.state.Detail;
                                    let Setting = Detail.Setting;
                                    Setting.jenismaskot = e.target.value;
                                    Setting.maskot = e.target.value == "icon" ? "none" : "";
                                    Detail.Setting = Setting;
                                    this.setState({ Detail });
                                }} placeholder='Silahkan pilih jenis tombol' required={true} data={[
                                    { ID: "images", Nama: "Gambar" },
                                    { ID: "icon", Nama: "Icon" },
                                ]} />
                                {Detail.Setting.jenismaskot == "images" &&
                                    <div className='form-group'>
                                        <label>Gambar Produk</label>
                                        <p></p>
                                        <label>
                                            <input name='Maskot' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihBG(e)} />
                                            <img src={this.state.MaskotImg} htmlFor="BuktiTfPelanggan" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                                        </label>
                                    </div>
                                }
                            </Fragment>
                        }
                        <b>Produk Tertaut</b>
                        <p></p>
                        <Suspense>
                            <RendTable
                                thead={[
                                    { cap: "", sort: "", type: "opsi" },
                                    { cap: "Gambar", sort: "Image", type: "img" },
                                    { cap: "SKU", sort: "SKU", type: "str" },
                                    { cap: "Nama", sort: "Nama", type: "str" },
                                    { cap: "Jenis", sort: "Jenis", type: "str" },
                                    { cap: "Keterangan", sort: "Keterangan", type: "str" },
                                    { cap: "Qty", sort: "Qty", type: "str" },
                                    { cap: "Harga", sort: "Harga", type: "number" },
                                ]}
                                id="tableProduk"
                                tbody={this.state.DataProdukDevice}
                                opt={[
                                    { icon: "checkbox", fn: (e) => this.handleChangeProduk(e) }
                                ]}
                            />
                        </Suspense>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupSetting">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i>Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalGroup' title="Data Group" className='modal-lg' >
                    <ModalBody>
                        <Suspense>
                            <RendTable
                                thead={[
                                    { cap: "ID", sort: "ID", type: "str" },
                                    { cap: "Nama", sort: "subject", type: "str" },
                                    { cap: "Member", sort: "totalParticipants", type: "str" }
                                ]}
                                tbody={this.state.DataGroup}
                                event={{ click: (e) => this.handlePilihGroup(e) }}
                            />
                        </Suspense>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalGroup" />
                </Modal>

                <Modal id='modalMember' title="Data Member Group" className='modal-lg' >
                    <ModalBody>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>WhatsApp</th>
                                    <th>Nama</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.DataMember.map((tr, i) => {
                                        return <tr key={i} onClick={(e) => {
                                            let Detail = this.state.Detail;
                                            Detail.PaymentPIC = tr.id.replaceAll("@s.whatsapp.net", "");
                                            this.setState({ Detail });
                                            document.getElementById('btnTutupModalMember').click();
                                        }}>
                                            <td>{tr.id}</td>
                                            <td>{tr.nomor}</td>
                                            <td>{tr.name}</td>
                                            <td>{tr.isAdmin}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalMember" />
                </Modal>
            </Fragment>
        )
    }
}