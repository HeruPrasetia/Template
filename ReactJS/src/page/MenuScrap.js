import React, { Fragment } from 'react';
import { submitForm, DxSubmitForm, openModal, cekProfile, api, DivAksesDitolak, VideoCard, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { Row, Row9, Row3, Row6 } from '../component/Rows'
import { FormInput, DxFormInput } from '../component/FormInput';
import Tutorial from '../component/Tutorial';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Telp", sort: "Telp", type: "str" },
                { cap: "Alamat", sort: "Alamat", type: "str" },
                { cap: "Longitude", sort: "Longitude", type: "str" },
                { cap: "Latitude", sort: "Latitude", type: "str" },
            ],
            FieldHasil: [
                { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihAll(e), fnitem: (e, data, i) => this.handlePilih(e, data, i) },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Telp", sort: "Telp", type: "str" },
                { cap: "Alamat", sort: "Alamat", type: "str" },
                { cap: "Longitude", sort: "Longitude", type: "str" },
                { cap: "Latitude", sort: "Latitude", type: "str" }
            ],
            DataHasil: [],
            Kontak: [],
            Detail: {},
            PerusahaanID: 0,
            Search: "",
            Type: "store",
            NextToken: "",
            Tag: "",
            Sumber: "Google Maps",
            DataDevice: [],
            DeviceID: "",
            DataGroup: [],
            Step1: [],
            RunStep: false,
            StepForm: [],
            RunStepForm: false
        };
        this.validatiobReffForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Step1 = [], StepForm = [];
        let Step = profile.data.Step;
        if (Step != "") {
            for (let i in Step) {
                if (i <= 2) Step1.push(Step[i]);
                if (i > 2) StepForm.push(Step[i]);
            }
        }
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data, Step1, StepForm }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datascrap", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    async handleScrap(e, NextToken = "") {
        let btn = e.target;
        btn.disbled = true;
        btn.innerText = "Mengambil . . .";
        let sql = await api("scrap", { search: this.state.Search, type: this.state.Type, NextToken: NextToken, PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ DataHasil: sql.data, Kontak: sql.data, NextToken: sql.NextToken });
        btn.disbled = false;
        if (e.target.id == 'btnScrap') {
            btn.innerText = "Ambil Data";
        } else {
            btn.innerText = "Halaman Selanjutnya";
        }
    }

    handlePilihAll(e) {
        let DataHasil = this.state.DataHasil;
        let Temp = [];
        for (let dd in DataHasil) {
            DataHasil[dd].checked = e.target.checked;
            Temp.push(DataHasil[dd]);
        }
        this.setState({ DataHasil: Temp, Kontak: e.target.checked == true ? Temp : [] });
    }

    handlePilih(e, data, i) {
        let chk = document.getElementById(`tabelKontak${data.ID}`);
        let Menu = this.state.DataHasil;
        let Akses = [];
        for (let dd in Menu) {
            if (Menu[dd].ID == data.ID) Menu[dd].checked = chk.checked;
            if (Menu[dd].checked == true) Akses.push(Menu[dd]);
        }
        this.setState({ DataHasil: Menu, Kontak: Akses });
    }

    async handleChangeSumber(Sumber) {
        if (Sumber == "Group WhatsApp") {
            let FieldHasil = [
                { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihAll(e), fnitem: (e, data, i) => this.handlePilih(e, data, i) },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Telp", sort: "Telp", type: "str" }
            ];
            let sql = await api("datadevice", { PerusahaanID: this.state.PerusahaanID });
            if (sql.status == "sukses") this.setState({ DataDevice: sql.data, Sumber, FieldHasil });
        } else {
            let FieldHasil = [
                { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihAll(e), fnitem: (e, data, i) => this.handlePilih(e, data, i) },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Telp", sort: "Telp", type: "str" },
                { cap: "Alamat", sort: "Alamat", type: "str" },
                { cap: "Longitude", sort: "Longitude", type: "str" },
                { cap: "Latitude", sort: "Latitude", type: "str" },
                { cap: "Foto", sort: "Foto", type: "str" },
            ]
            this.setState({ Sumber, FieldHasil });
        }
    }

    async handleCariGroup(DeviceID) {
        let Device = this.state.DataDevice;
        let Telp = Device.filter(x => x.ID);
        let sql = await api("listgroup", { Telp: Telp[0].SessionsID });
        if (sql.status == "sukses") {
            let DataGroup = [];
            for (let dd of sql.data) DataGroup.push({ ID: dd.ID, Nama: dd.subject });
            this.setState({ DataGroup, DeviceID });
        }
    }

    async handleGetKontak(GroupID) {
        let Device = this.state.DataDevice;
        let Telp = Device.filter(x => x.ID);
        let sql = await api("listMember", { GroupID, Telp: Telp[0].SessionsID });
        let DataHasil = [];
        if (sql.status == "sukses") {
            for (let dd of sql.data) DataHasil.push({ ID: dd.id, Telp: dd.id.split('@')[0], Nama: dd.name });
            this.setState({ DataHasil, GroupID });
        }
    }

    render() {
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className="main-title">
                                        <label id='lblTitle'>Scrap Kontak</label>
                                        <button className='btn btn-link' onClick={() => {
                                            this.setState({ RunStep: true });
                                            setTimeout(() => {
                                                let Btn = document.getElementsByClassName("react-joyride__beacon");
                                                for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                            }, 200);
                                        }}><i className='fas fa-info-circle'></i></button>
                                    </div>
                                    <button className='btn btn-default' id='btnAdd' onClick={() => {
                                        this.setState({ NextToken: "", DataHasil: [], Tag: "" })
                                        openModal("modalScrap", () => {
                                            setTimeout(() => {
                                                this.setState({ RunStepForm: true })
                                            }, 1000);
                                        });
                                    }}>Scrap Data</button>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    id="TableDataScrap"
                                    limit={2}
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.Step1} run={this.state.RunStep} /> : ""}
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalScrap' className='modal-lg' title="Scrap Data" form={true} validationRef={this.validatiobReffForm} onSubmit={(e) => DxSubmitForm(e, this.validatiobReffForm, { crud: "crudscrap", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} >
                    <ModalBody>
                        <input type='hidden' name='act' value="tambah" />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='Kontak' value={JSON.stringify(this.state.Kontak)} />
                        <DxFormInput type='select' id='edtSubmer' label='Sumber' name='Sumber' value={this.state.Sumber} onChange={(e) => this.handleChangeSumber(e.value)} data={[
                            { ID: "Google Maps", Nama: "Google Maps" },
                            { ID: "Group WhatsApp", Nama: "Group WhatsApp" }
                        ]} />
                        <p></p>
                        {this.state.Sumber == "Google Maps" ?
                            <Fragment>
                                <Row>
                                    <Row9><DxFormInput type='search' id="edtCari" placeholder='Cari Tempat / Usaha' value={this.state.Search} onChange={(e) => this.setState({ Search: e.value })} /></Row9>
                                    <Row3>
                                        <DxFormInput type='select' id="edtJenis" placeholder='Cari Tempat / Usaha' value={this.state.Type} onChange={(e) => this.setState({ Type: e.value })} data={[
                                            { ID: "store", Nama: "store" },
                                            { ID: "place", Nama: "place" },
                                            { ID: "restaurant", Nama: "restaurant" },
                                            { ID: "supermarket", Nama: "supermarket" },
                                            { ID: "airport", Nama: "airport" },
                                            { ID: "church", Nama: "church" },
                                            { ID: "stadium", Nama: "stadium" },
                                            { ID: "university", Nama: "university" },
                                            { ID: "hotel", Nama: "hotel" },
                                            { ID: "parking", Nama: "parking" },
                                            { ID: "taxi_stand", Nama: "taxi_stand" },
                                            { ID: "car_dealer", Nama: "car_dealer" },
                                            { ID: "Lain", Nama: "lain" },
                                        ]} />
                                    </Row3>
                                </Row>
                                <p></p>
                                {
                                    this.state.NextToken == "" ?
                                        <button type='button' className='btn btn-default w-100' onClick={(e) => this.handleScrap(e)} id='btnAmbil'>Ambil Data</button>
                                        :
                                        <div className='d-flex gap-2'>
                                            <button type='button' id='btnScrap' className='btn btn-default w-50' onClick={(e) => this.handleScrap(e)}>Ambil Data</button>
                                            <button type='button' id='btnNextPage' className='btn btn-default w-50' onClick={(e) => this.handleScrap(e, this.state.NextToken)}>Data Selanjutnya</button>
                                        </div>
                                }
                                <p></p>
                            </Fragment>
                            : <Fragment>
                                <Row>
                                    <Row6><DxFormInput type='select' label='Device' value={this.state.DeviceID} onChange={(e) => this.handleCariGroup(e.value)} data={this.state.DataDevice} /></Row6>
                                    <Row6><DxFormInput type='select' label='Group' value={this.state.GroupID} onChange={(e) => this.handleGetKontak(e.value)} data={this.state.DataGroup} /></Row6>
                                </Row>
                            </Fragment>
                        }

                        <RendTables
                            tbody={this.state.DataHasil}
                            thead={this.state.FieldHasil}
                            id="tabelKontak"
                        />
                        <p></p>
                        <FormInput type='tag' label='Kelompok / Tag' name='Tag' value={this.state.Tag || ""} onChange={(e) => this.setState({ Tag: e.target.value })} PerusahaanID={this.state.PerusahaanID} />
                        {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.StepForm} run={this.state.RunStepForm} /> : ""}
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalScrap">
                        <button type='submit' className='btn btn-default' id='btnSave'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        )
    }

}

export default Dashboard;
