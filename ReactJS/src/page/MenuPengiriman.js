import React, { Fragment } from 'react';
import { saiki, submitForm, openModal, cekProfile, api, DivAksesDitolak, VideoCard, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { DxFormInput, FormInput, FormSwitch } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows';
import DateRangeBox from 'devextreme-react/date-range-box';
import SelectBox from 'devextreme-react/select-box';
import Tutorial from '../component/Tutorial';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [],
            Detail: {},
            PerusahaanID: 0,
            DataAsal: [],
            DataTujuan: [],
            DataKargo: [],
            DataInstan: [],
            DataReguler: [],
            DataOngkir: [],
            FieldOngkir: [
                { cap: "Nama", sort: "name", type: "str" },
                { cap: "Service", sort: "service", type: "str" },
                { cap: "Keterangan", sort: "description", type: "str" },
                { cap: "Ongkir", sort: "cost", type: "number" },
                { cap: "Estimasi", sort: "etd", type: "str" },
            ],
            DataExpedisi: [
                { ID: "jne", Nama: "JNE" },
                { ID: "sicepat", Nama: "SiCepat" },
                { ID: "ide", Nama: "ID Express" },
                { ID: "sap", Nama: "sap" },
                { ID: "jnt", Nama: "J&T" },
                { ID: "ninja", Nama: "Ninja" },
                { ID: "tiki", Nama: "TIKI" },
                { ID: "lion", Nama: "LION" },
                { ID: "anteraja", Nama: "Anter Aja" },
                { ID: "pos", Nama: "POS Indonesia" },
                { ID: "ncs", Nama: "ncs" },
                { ID: "rex", Nama: "rex" },
                { ID: "rpx", Nama: "rpx" },
                { ID: "sentral", Nama: "sentral" },
                { ID: "star", Nama: "star" },
                { ID: "wahana", Nama: "Wahana" },
                { ID: "dse", Nama: "dse" }
            ],
            D1: saiki(),
            D2: saiki(),
            DataStatus: [],
            NoResi: "",
            CariTujuan: "",
            Step1: [],
            RunStep: false,
            StepOngkir: [],
            RunStepOngkir: false,
            StepResi: [],
            RunStepResi: false
        };
        this.__typingTimerAsal = null;
        this.__typingTimerTujuan = null;
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Step = profile.data.Step;
        let Step1 = [], StepOngkir = [], StepResi = [];
        if (Step != "") {
            for (let i in Step) {
                if (i <= 5) Step1.push(Step[i]);
                if (i > 5 && i <= 11) StepOngkir.push(Step[i]);
                if (i > 11) StepResi.push(Step[i]);
            }
        }
        let Field = [
            { cap: "", sort: "", type: "opsi" },
            { cap: "No. Resi", sort: "No. Resi", type: "str" },
            { cap: "Expedisi", sort: "Expedisi", type: "str" },
            { cap: "Jenis", sort: "Jenis", type: "str" },
            { cap: "Pelanggan", sort: "CardName", type: "str" },
            { cap: "Telp", sort: "Telp", type: "str" },
            { cap: "Alamat", sort: "Alamat", type: "str" },
            { cap: "Harga", sort: "Harga", type: "number" },
            { cap: "COD", sort: "IsCOD", type: "boolean2" },
            { cap: "Status", sort: "Status", type: "str" }
        ];
        this.setState({ Field: Field, PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data, Step1, StepOngkir, StepResi }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datapengiriman", { PerusahaanID: this.state.PerusahaanID, D1: this.state.D1, D2: this.state.D2 });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    async handleModalOngkir() {
        this.setState({ Detail: { berat: 1, jumlah: 1 } })
        openModal("modalOngkir", () => {
            setTimeout(() => {
                this.setState({ RunStepOngkir: true })
            }, 1000);
        });
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    handleModalCari(e) {
        this.setState({ ID: e.target.name });
        openModal("modalCariTujuan");
    }

    async handleCariTujuan(val) {
        let __typingTimer;
        clearTimeout(__typingTimer);
        __typingTimer = setTimeout(async () => {
            let sql = await api("getdestination", { search: val });
            if (sql.status == "sukses") this.setState({ DataTujuan: sql.data });
        }, 1000);
    }

    async handleCekOngkir(e) {
        let data = this.state.Detail;
        e.preventDefault();
        if (e.target.checkValidity()) {
            let sql = await api("getongkir", this.state.Detail);
            if (sql.status == "sukses") {
                this.setState({ DataOngkir: sql.data });
            }
        } else {
            e.target.classList.add('was-validated');
        }
    }

    handleModalResi() {
        openModal("modalCekResi", () => {
            setTimeout(() => {
                this.setState({ RunStepResi: true })
            }, 1000);
        });
    }

    async handleCekResi() {
        let sql = await api("tracking", { waybill: this.state.Detail.waybill, courier: this.state.Detail.courier });
        if (sql.status == "sukses") {
            let Data = sql.data;
            let Manifest = Data.manifest;
            this.setState({ DataStatus: Manifest });
        }
    }

    onCurrentValueChange = ({ value: [startDate, endDate] }) => {
        this.setState({ D1: startDate, D2: endDate });
    };

    handleCariAsal = (e) => {
        const query = e.event.target.value;
        this.setState({ searchText: query });

        clearTimeout(this.__typingTimerAsal);
        this.__typingTimerAsal = setTimeout(async () => {
            let sql = await api("getdestination", { search: query });
            if (sql.status === "sukses") this.setState({ DataAsal: sql.data });
        }, 500);
    };

    handleChangeAsal = (e) => {
        let Detail = this.state.Detail;
        Detail.asal = e.value;
        this.setState({ Detail });
        if (this.props.onChange) {
            this.props.onChange(e.value);
        }
    }

    handleCariTujuan = (e) => {
        const query = e.event.target.value;
        this.setState({ searchText: query });

        clearTimeout(this.__typingTimerTujuan);
        this.__typingTimerTujuan = setTimeout(async () => {
            let sql = await api("getdestination", { search: query });
            if (sql.status === "sukses") this.setState({ DataTujuan: sql.data });
        }, 500);
    };

    handleChangeTujuan = (e) => {
        let Detail = this.state.Detail;
        Detail.tujuan = e.value;
        this.setState({ Detail });
        if (this.props.onChange) {
            this.props.onChange(e.value);
        }
    }

    render() {
        let { Detail, ID, DataTujuan, DataAsal } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='row'>
                                    <div className="main-title col-md-6 mb-2">
                                        <label id='lblTitle'>Menu Pengiriman</label>
                                        <button className='btn btn-link' onClick={() => {
                                            this.setState({ RunStep: true });
                                            setTimeout(() => {
                                                let Btn = document.getElementsByClassName("react-joyride__beacon");
                                                for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                            }, 200);
                                        }}><i className='fas fa-info-circle'></i></button>
                                    </div>
                                    <div className='col-md-3 mb-2 d-flex gap-2'>
                                        <button className='btn btn-default w-50' id='btnModalCekResi' onClick={() => this.handleModalResi()}>Cek Resi</button>
                                        <button className='btn btn-default w-50' id='btnModalCekOngkir' onClick={() => this.handleModalOngkir()}>Cek Ongkir</button>
                                    </div>
                                    <div className='col-md-3 mb-2'>
                                        <div className="d-flex align-items-end gap-1">
                                            <DateRangeBox
                                                defaultValue={[this.state.D1, this.state.D2]}
                                                onValueChanged={this.onCurrentValueChange}
                                                id="edtRangeDate"
                                            />
                                            <button className='btn btn-default' onClick={() => this.handleMain()} id='btnCari'><i className='fas fa-search'></i></button>
                                        </div>
                                    </div>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-trash-alt", fn: (e) => this.modalHapus(e) },
                                        { icon: "fas fa-info-circle", fn: (e) => this.modalDetail(e) }
                                    ]}
                                    group={[{ sort: "DocDate", cap: "DocDate" }]}
                                    id="TableDataPengriman"
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.Step1} run={this.state.RunStep} /> : ""}
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalOngkir' className='modal-xl' title="Cek Ongkir" form={true} onSubmit={(e) => this.handleCekOngkir(e)} >
                    <ModalBody>
                        <Row>
                            <Row6>
                                <SelectBox id='edtAsal' dataSource={DataAsal} value={Detail.asal} valueExpr="id" displayExpr="label" placeholder="Silahkan ketik alamat asal" searchEnabled={true} showClearButton={true} width="100%" onValueChanged={this.handleChangeAsal} onInput={this.handleCariAsal} searchMode="contains" searchExpr="label" label='Cari Alamat Asal' />
                            </Row6>
                            <Row6>
                                <SelectBox id='edtTujuan' dataSource={DataTujuan} value={Detail.tujuan} valueExpr="id" displayExpr="label" placeholder="Silahkan ketik alamat tujuan" searchEnabled={true} showClearButton={true} width="100%" onValueChanged={this.handleChangeTujuan} onInput={this.handleCariTujuan} searchMode="contains" searchExpr="label" label='Cari Alamat Tujuan' />
                            </Row6>

                            <Row6><DxFormInput id="edtJumlah" type='number' label='Jumlah' name='jumlah' value={Detail.jumlah || "1"} onChange={(e) => this.handleChange(e, 'jumlah')} required={true} /></Row6>
                            <Row6><DxFormInput id="edtBerat" type="number" label='Berat' name='berat' value={Detail.berat || ""} onChange={(e) => this.handleChange(e, 'berat')} required={true} /></Row6>
                        </Row>
                        <p></p>
                        <h6>List Ongkir</h6>
                        <RendTables
                            tbody={this.state.DataOngkir}
                            thead={this.state.FieldOngkir}
                            group={[{ cap: "Expedisi", sort: "code" }]}
                            id="TableDataOngkir"
                        />
                        {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.StepOngkir} run={this.state.RunStepOngkir} /> : ""}
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalOngkir">
                        <button type='submit' className='btn btn-default' id='btnCekOngkir'><i className='fas fa-save'></i> Cek Ongkir</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalCekResi' className='modal-lg' title='Cek Resi'>
                    <ModalBody>
                        <Row>
                            <Row6><DxFormInput id='edtExpedisi' label='Expedisi' type='select' value={Detail.courier} onChange={(e) => {
                                let Detail = this.state.Detail;
                                Detail.courier = e.value;
                                this.setState({ Detail });
                            }} data={this.state.DataExpedisi} /></Row6>
                            <Row6><DxFormInput id='edtResi' label='No. Resi' value={Detail.waybill} onChange={(e) => {
                                let Detail = this.state.Detail;
                                Detail.waybill = e.value;
                                this.setState({ Detail });
                            }} /></Row6>
                        </Row>
                        <RendTables
                            thead={[
                                { cap: "Jam", sort: "manifest_time", type: "str" },
                                { cap: "Kota", sort: "city_name", type: "str" },
                                { cap: "Keterangan", sort: "manifest_description", type: "str" }
                            ]}
                            tbody={this.state.DataStatus}
                            group={[{ cap: "Tanggal", sort: "manifest_date" }]}
                            id="TableDataResi"
                        />
                        {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.StepResi} run={this.state.RunStepResi} /> : ""}
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalCekResi" >
                        <button type='button' className='btn btn-default' onClick={() => this.handleCekResi()} id='btnCekResi'>Cek Resi</button>
                    </ModalFooter>
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.UserID} onSubmit={(e) => submitForm(e, { crud: "crudproduk", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
            </Fragment>
        )
    }

}

export default Dashboard;
