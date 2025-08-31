import React, { Fragment, lazy, Suspense } from 'react';
import { saiki, submitForm, openModal, cekProfile, api, DivAksesDitolak, DivExpired } from '../Modul';
import { ModalDelete } from '../component/Modal';
import imgUpload from '../assets/img/img-upload.png';
import { Tabs } from '../component/Tabs';

const DateRangeBox = lazy(() => import('devextreme-react/date-range-box'));
const RendTables = lazy(() => import('../component/RendTable'));
const ModalDetailPelanggan = lazy(() => import('../component/ModalDetailPelanggan.js'));
const ModalDetailPembayaran = lazy(() => import('../component/ModalDetailPembayaran.js'));

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
            DataPayment: [],
            D1: saiki("01"),
            D2: saiki(),
            DataPromo: []
        };
        this.validationFormPelanggan = React.createRef();
        this.validationFormPerpanjang = React.createRef();
        this.validationFormService = React.createRef();
        this.validationFormPaket = React.createRef();
    }


    async componentDidMount() {
        let profile = await cekProfile();
        if (profile.data.IsAffiliate == 0) window.location.href = "./";
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
        let sql = await api("dataclient", { Reff: this.state.SysAkses.Kode });
        if (sql.status == "sukses") {
            this.setState({ Data: sql.data });
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

    async modalForm(data = {}) {
        let sql = await api("detailclient", { ID: data.ID });
        let MenuList = [];
        for (let mm of sql.menu) if (mm.checked == 1) MenuList.push(mm);
        this.setState({ Detail: sql.data || data, Menu: sql.menu, MenuList, ID: data.ID });
        openModal("modalForm");
    }

    async handleMainPayment() {
        let sql = await api("dataregistermain", { D1: this.state.D1, D2: this.state.D2, Reff: this.state.SysAkses.Kode });
        if (sql.status == "sukses") this.setState({ DataPayment: sql.data });
    }

    async handleMainPromo() {
        let sql = await api("datapromo", { D1: this.state.D1, D2: this.state.D2, NoReff: this.state.SysAkses.Kode });
        if (sql.status == "sukses") this.setState({ DataPromo: sql.data });
    }

    onCurrentValueChange = ({ value: [startDate, endDate] }) => {
        this.setState({ D1: startDate, D2: endDate });
    };

    async modalDetailPayment(data) {
        let sql = await api("detailregistermain", { ID: data.ID });
        if (sql.status == "sukses") this.setState({ Detail: sql.data, DetailPaket: sql.data.DataPaket }, openModal("modalDetailPayment"));
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    <Tabs header={[
                        { title: "Master Pelanggan", id: "Pelanggan" },
                        { title: "Pembayaran", id: "Payment", fn: () => this.handleMainPayment() },
                        { title: "Voucher & Promo", id: "Promo", fn: () => this.handleMainPayment() },
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
                                                            { cap: "Status", sort: "Status", type: "boolean" }
                                                        ]}
                                                        opt={[
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
                                    {this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                                        <div className="div-content mt-1">
                                            <div className="main-title col-md-6 mb-2">Data Promo & Voucher</div>
                                            <Suspense>
                                                <RendTables
                                                    tbody={this.state.DataPromo}
                                                    thead={[
                                                        { cap: "", sort: "", type: "opsi" },
                                                        { cap: "Kode", sort: "Kode", type: "str" },
                                                        { cap: "Nama", sort: "Nama", type: "str" },
                                                        { cap: "NoReff", sort: "Noreff", type: "str" },
                                                        { cap: "Keterangan", sort: "Keterangan", type: "str" },
                                                        { cap: "Jenis Transaksi", sort: "Jenis", type: "str" },
                                                        { cap: "Jenis Potongan", sort: "JenisNominal", type: "str" },
                                                        { cap: "Nominal", sort: "Nominal", type: "str" },
                                                        { cap: "Kuota", sort: "Kuota", type: "str" },
                                                        { cap: "Dipakai", sort: "Penggunaan", type: "str" },
                                                        { cap: "Tanggal Aktif", sort: "StartDate", type: "date" },
                                                        { cap: "Tanggal Berahir", sort: "EndDate", type: "date" },
                                                        { cap: "Status", sort: "Status", type: "str" },
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
                    </Tabs>
                </div>

                <Suspense><ModalDetailPelanggan Detail={Detail} DataDevice={this.state.DataDevice} DataHistory={this.state.DataHistory} /></Suspense>
                <Suspense><ModalDetailPembayaran ID={ID} Detail={Detail} DetailPaket={this.state.DetailPaket} submit={() => this.handleMainPayment()} /></Suspense>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.UserID} onSubmit={(e) => submitForm(e, { crud: "crudclient", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
                <ModalDelete title="Konfirmasi" id='modalHapusDevice' act='hapus device' ID={this.state.ID} onSubmit={(e) => submitForm(e, { crud: "crudclient", fn: () => this.handleMain(), debug: true })} />
            </Fragment>
        )
    }

}

export default Dashboard;
