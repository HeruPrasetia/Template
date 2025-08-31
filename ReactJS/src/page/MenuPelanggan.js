import React, { Fragment, Suspense, lazy } from 'react';
import { saiki, submitForm, openModal, cekProfile, compressImageBase64, resizeImageBase64, api, DivAksesDitolak, host, DivExpired } from '../Modul';
import { ModalDelete } from '../component/Modal';
import { Row, Row6 } from '../component/Rows.js'
import imgUpload from '../assets/img/img-upload.png';
import imgLoading from '../assets/img/loading-upload.gif';
import { Tabs } from '../component/Tabs';

const DateRangeBox = lazy(() => import('devextreme-react/date-range-box'));
const RendTables = lazy(() => import('../component/RendTable'));
const ModalFormPaket = lazy(() => import('../component/ModalFormPaket.js'));
const ModalDetailPelanggan = lazy(() => import('../component/ModalDetailPelanggan.js'));
const ModalFormPelanggan = lazy(() => import('../component/ModalFormPelanggan.js'));
const ModalDetailPembayaran = lazy(() => import('../component/ModalDetailPembayaran.js'));
const FormSetting = lazy(() => import('../component/FormSetting.js'));
const FormSettingCrm = lazy(() => import('../component/FormSettingCrm.js'));

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Menu: [],
            MenuList: [],
            Detail: {},
            DataDevice: [],
            DataHistory: [],
            PerusahaanID: 0,
            BuktiTfPelanggan: imgUpload,
            BuktiTfPartner: imgUpload,
            DetailDevice: {},
            Paket: [],
            DetailPaket: {},
            Service: {},
            Setting: {},
            ListCss: [
                { Nama: "Carmin", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme/24.2.8/css/dx.carmine.min.css" },
                { Nama: "Fluent Blue Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.fluent.blue.light.min.css" },
                { Nama: "Fluent Saas Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.fluent.saas.light.min.css" },
                { Nama: "Greenmist", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.greenmist.min.css" },
                { Nama: "Light Compact", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.light.compact.min.css" },
                { Nama: "Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.light.min.css" },
                { Nama: "Material Blue Light Compact", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.blue.light.compact.min.css" },
                { Nama: "Material Blue Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.blue.light.min.css" },
                { Nama: "Material Lime Light Compact", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.lime.light.compact.min.css" },
                { Nama: "Material Lime Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.lime.light.min.css" },
                { Nama: "Material Orange Light Compact", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.orange.light.compact.min.css" },
                { Nama: "Material Orange Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.orange.light.min.css" },
                { Nama: "Material Purple Light Compact", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.purple.light.compact.min.css" },
                { Nama: "Material Purple Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.purple.light.min.css" },
                { Nama: "Material Teal Light Compact", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.teal.light.compact.min.css" },
                { Nama: "Material Teal Light", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.material.teal.light.min.css" },
                { Nama: "Soft Blue", ID: "https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/23.2.4/css/dx.softblue.min.css" },
            ],
            DataPayment: [],
            D1: saiki("01"),
            D2: saiki()
        };
        this.validationFormPerpanjang = React.createRef();
        this.validationFormService = React.createRef();
    }


    async componentDidMount() {
        let profile = await cekProfile();
        if (profile.IsPartner == 0) window.location.href = "./";
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("dataclient", {});
        if (sql.status == "sukses") {
            this.setState({ Data: sql.data, Paket: sql.Paket, DataDevice: sql.Device });
        }
    }

    modalHapus(data) {
        this.setState({ UserID: data.ID });
        openModal("modalHapus");
    }

    async modalDetail(data) {
        let sql = await api("detailclient", { ID: data.ID });
        if (sql.status == "sukses") {
            this.setState({ DataDevice: sql.device, Detail: sql.data, DataHistory: sql.history });
            openModal("modalDetail");
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    async modalForm(data = {}) {
        let sql = await api("detailclient", { ID: data.ID });
        let MenuList = [];
        for (let mm of sql.menu) if (mm.checked == 1) MenuList.push(mm);
        this.setState({ Detail: sql.data || data, Menu: sql.menu, MenuList, ID: data.ID });
        openModal("modalForm");
    }

    handlePilihBG(e, obj, compress = false) {
        if (obj == "BuktiTfPelanggan") {
            this.setState({ BuktiTfPelanggan: imgLoading });
        } else {
            this.setState({ BuktiTfPartner: imgLoading });
        }
        let files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();
            let file = files[i];
            let fileExtension = file.name.split('.').pop().toLowerCase();
            let fileSizeKB = file.size / 1024;
            reader.onload = async () => {
                try {
                    let baru = fileSizeKB > 600 && compress == true ? await compressImageBase64(reader.result, fileExtension, 0.8) : reader.result;
                    let img = new Image();
                    img.src = baru;
                    img.onload = async () => {
                        let width = img.width;
                        let height = img.height;
                        let canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        let ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        let pngData = canvas.toDataURL('image/png');
                        let newRes = fileSizeKB > 600 && compress == true ? await resizeImageBase64(pngData, height / 5, width / 5, fileExtension) : pngData;
                        if (obj == "BuktiTfPelanggan") {
                            this.setState({ ChangeImg: "ya", BuktiTfPelanggan: newRes });
                        } else {
                            this.setState({ ChangeImg: "ya", BuktiTfPartner: newRes });
                        }
                    };
                } catch (error) {
                    console.error('Error compressing image:', error.message);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    modalHapusDevice(data) {
        this.setState({ Detail: data, ID: data.ID });
        document.getElementById('btnTutupModalDetail').click();
        openModal("modalHapusDevice");
    }

    async handleFormPaket(data = { ID: "", Image: imgUpload, JenisPaket: "Register" }) {
        let sql = await api("detailpaket", { ID: data.ID });
        if (sql.status == "sukses") {
            if (data.ID == "") {
                data.Image = imgUpload;
            } else {
                sql.data.Image = host + "file/" + sql.data.Image;
            }
            this.setState({ Detail: data.ID == "" ? data : sql.data, ID: data.ID }, openModal("modalFormPaket"));
        }
    }

    async handleMainPayment() {
        let sql = await api("dataregistermain", { D1: this.state.D1, D2: this.state.D2 });
        if (sql.status == "sukses") this.setState({ DataPayment: sql.data });
    }

    onCurrentValueChange = ({ value: [startDate, endDate] }) => {
        this.setState({ D1: startDate, D2: endDate });
    };

    async modalDetailPayment(data) {
        let sql = await api("detailregistermain", { ID: data.ID });
        if (sql.status == "sukses") this.setState({ Detail: sql.data, DetailPaket: sql.data.DataPaket }, openModal("modalDetailPayment"));
    }

    async handleSetting() {
        let sql = await api("datasetting", {});
        console.log(sql);
        console.log(sql);
        if (sql.status == "sukses") {
            let Service = sql.service;
            Service.LogoPanjang = host + 'file/' + Service.LogoPanjang;
            Service.Logo = host + 'file/' + Service.Logo;
            Service.Sidebar = host + 'file/' + Service.Sidebar;
            this.setState({ Service, Setting: sql.setting });
        }
    }

    render() {
        let { Detail, ID, Service, Setting } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    <Tabs header={[
                        { title: "Master Pelanggan", id: "Pelanggan" },
                        { title: "Pembayaran", id: "Payment", fn: () => this.handleMainPayment() },
                        { title: "Paket", id: "Paket" },
                        { title: "Setting", id: "Setting", fn: () => this.handleSetting() },
                    ]} >
                        <div>
                            <div className='card card-shadow'>
                                <div className='card-body'>
                                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                                            <div className="div-content mt-1">
                                                <div className="main-title col-md-10 mb-2">Data Pelanggan</div>
                                                <Suspense>
                                                    <RendTables
                                                        tbody={this.state.Data}
                                                        thead={[
                                                            { cap: "", sort: "", type: "opsi" },
                                                            { cap: "Nama", sort: "Nama", type: "str" },
                                                            { cap: "WhatsApp", sort: "Telp", type: "str" },
                                                            { cap: "Email", sort: "Email", type: "str" },
                                                            { cap: "Tanggal Bergabung", sort: "Tanggal", type: "date" },
                                                            { cap: "Tanggal Aktif", sort: "Aktif", type: "date" },
                                                            { cap: "Tanggal Berakhir", sort: "Sampai", type: "date" },
                                                            { cap: "Jumlah Maks Device", sort: "MaxDevice", type: "str" },
                                                            { cap: "Device", sort: "Device", type: "html" },
                                                            { cap: "Status", sort: "Status", type: "boolean" }
                                                        ]}
                                                        opt={[
                                                            { icon: "fas fa-edit", color: "text-warning", fn: (e) => this.modalForm(e) },
                                                            { icon: "fas fa-info-circle", fn: (e) => this.modalDetail(e) }
                                                        ]}
                                                    />
                                                </Suspense>
                                            </div>
                                            : <DivAksesDitolak />}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='card card-shadow'>
                                <div className='card-body'>
                                    {this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                                        <div className="div-content mt-1">
                                            <div className='row'>
                                                <div className="main-title col-md-6 mb-2">Data Pembayaran</div>
                                                <div className='col-md-6 mb-2'>
                                                    <div className="d-flex justify-content-end align-items-end gap-1">
                                                        <DateRangeBox defaultValue={[this.state.D1, this.state.D2]} onValueChanged={this.onCurrentValueChange} />
                                                        <button className='btn btn-default' onClick={() => this.handleMainPayment()}><i className='fas fa-search'></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Suspense>
                                                <RendTables
                                                    tbody={this.state.DataPayment}
                                                    thead={[
                                                        { cap: "", sort: "", type: "opsi" },
                                                        { cap: "Waktu", sort: "Waktu", type: "datetime" },
                                                        { cap: "Nomor", sort: "DocNumber", type: "str" },
                                                        { cap: "Nama", sort: "Nama", type: "str" },
                                                        { cap: "Email", sort: "Email", type: "str" },
                                                        { cap: "Telp", sort: "Telp", type: "str" },
                                                        { cap: "Jenis", sort: "Jenis", type: "str" }
                                                    ]}
                                                    group={[
                                                        { cap: "Status", sort: "Status", type: "str" }
                                                    ]}
                                                    opt={[
                                                        { icon: "fas fa-info-circle", fn: (e) => this.modalDetailPayment(e) }
                                                    ]}
                                                />
                                            </Suspense>
                                        </div>
                                        : <DivAksesDitolak />}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='card card-shadow'>
                                <div className='card-body'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <b>Paket Langganan</b>
                                        <button className='btn btn-sm btn-default' onClick={() => this.handleFormPaket({ ID: "", JenisPaket: "Register" })}><i className='fas fa-plus'></i> Tambah Paket</button>
                                    </div>
                                    <p></p>
                                    <Suspense>
                                        <RendTables
                                            thead={[
                                                { cap: "", sort: "", type: "opsi" },
                                                { cap: "Nama", sort: "Nama", type: "str" },
                                                { cap: "Jenis Paket", sort: "PaketType", type: "str" },
                                                { cap: "Harga", sort: "Harga", type: "number" },
                                                { cap: "Kuota Response", sort: "KuotaAi", type: "number" },
                                                { cap: "Kuota Image Extractor", sort: "KuotaImg", type: "number" },
                                                { cap: "Kuota Voice Notes", sort: "KuotaVn", type: "number" },
                                                { cap: "Kuota Scarp", sort: "KuotaScrap", type: "number" },
                                                { cap: "Kuota Blash", sort: "KuotaBlash", type: "number" },
                                                { cap: "Paket Trial", sort: "IsTrial", type: "boolean2" },
                                                { cap: "Status", sort: "Status", type: "str" },
                                            ]}
                                            tbody={this.state.Paket}
                                            opt={[
                                                { icon: "fas fa-edit", fn: (e) => this.handleFormPaket(e) },
                                                {
                                                    icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => {
                                                        this.setState({ Detail: e }, openModal("modalHapusPaket"));
                                                    }
                                                },
                                            ]}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                        <div>
                            {this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                                <div className="div-content mt-1">

                                    <Row>
                                        <Row6>
                                            <div className='card card-shadow'>
                                                <div className='card-header'>
                                                    <b>Setting Profile</b>
                                                </div>
                                                <div className='card-body'>
                                                    <p></p>
                                                    <FormSetting Service={Service} />
                                                </div>
                                            </div>
                                        </Row6>
                                        <Row6>
                                            <div className='card card-shadow'>
                                                <div className='card-header'>
                                                    <b>Setting CRM</b>
                                                </div>
                                                <div className='card-body'>
                                                    <p></p>
                                                    <FormSettingCrm Service={Setting} Singkatan={Setting.DataSingkatan} submit={() => this.handleSetting()} />
                                                </div>
                                            </div>
                                        </Row6>
                                    </Row>
                                </div>
                                : <DivAksesDitolak />}
                        </div>
                    </Tabs>
                </div>
                <Suspense><ModalFormPaket ID={ID} Detail={Detail} submit={() => this.handleMain()} /></Suspense>
                <Suspense><ModalFormPelanggan ID={ID} Detail={Detail} Menu={this.state.Menu} submit={() => this.handleMain()} /></Suspense>
                <Suspense><ModalDetailPelanggan Detail={Detail} DataDevice={this.state.DataDevice} DataHistory={this.state.DataHistory} /></Suspense>
                <Suspense><ModalDetailPembayaran ID={ID} Detail={Detail} DetailPaket={this.state.DetailPaket} submit={() => this.handleMainPayment()} /></Suspense>

                <ModalDelete title="Konfirmasi Hapus Paket" ID={this.state.Detail.ID} id='modalHapusPaket' act="hapus paket" onSubmit={(e) => submitForm(e, { crud: "crudpaket", fn: (e) => this.handleMain() })} />

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.UserID} onSubmit={(e) => submitForm(e, { crud: "crudclient", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
                <ModalDelete title="Konfirmasi" id='modalHapusDevice' act='hapus device' ID={this.state.ID} onSubmit={(e) => submitForm(e, { crud: "crudclient", fn: () => this.handleMain(), debug: true })} />
            </Fragment>
        )
    }

}

export default Dashboard;
