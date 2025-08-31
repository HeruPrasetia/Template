import React, { Fragment } from 'react';
import { submitForm, openModal, cekProfile, api, DivAksesDitolak, VideoCard, DxSubmitForm, pesan, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { DxFormInput, FormSwitch } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows';
import Tutorial from '../component/Tutorial'

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            DataAkses: [],
            Detail: {},
            PerusahaanID: 0,
            ID: "",
            Step1: [],
            RunStep: false,
            StepForm: [],
            RunStepForm: false
        };
        this.validationForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Step1 = [], StepForm = [];
        if (profile.data.Step != "") {
            let Step = profile.data.Step;
            for (let i in Step) {
                if (i <= 3) Step1.push(Step[i]);
                if (i > 3) StepForm.push(Step[i]);
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
        let sql = await api("datauser", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ ID: data.ID });
        openModal("modalHapus");
    }

    async modalForm(Data) {
        let sql = await api("detailuser", { ID: Data.ID, PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ Detail: Data.ID == "" ? Data : sql.data, DataAkses: sql.akses, ID: Data.ID });
            openModal("modalForm", () => {
                setTimeout(() => {
                    this.setState({ RunStepForm: true })
                }, 1000);
            });
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    handlePilihAksesAll(e) {
        let DataAkses = this.state.DataAkses;
        let Temp = [];
        for (let dd in DataAkses) {
            DataAkses[dd].checked = e.target.checked == true ? 1 : 0;
            Temp.push(DataAkses[dd]);
        }
        this.setState({ DataAkses: Temp });
    }

    handlePilihAkses(e, data, i) {
        let DataAkses = this.state.DataAkses;
        DataAkses[i].checked = e.target.checked == true ? 1 : 0;
        this.setState({ DataAkses });
    }

    async handleChangeStatus(e, data, i) {
        let sql = await api("cruduser", { act: "ubah status", ID: data.ID, Status: e.target.checked == true ? 1 : 0 });
        if (sql.status == "sukses") {
            pesan("", sql.pesan);
            this.handleMain();
        }
    }

    async handleStatusAll(e) {
        let sql = await api("cruduser", { act: "Ganti Semua Status", Status: e.target.checked == true ? 1 : 0, PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            pesan("", sql.pesan);
            this.handleMain();
        }
    }

    render() {
        let { Detail, ID, DataAkses } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='row'>
                                    <div className="main-title col-md-9 mb-2"><label id='lblTitle'>Master User</label><button className='btn btn-link' onClick={() => {
                                        this.setState({ RunStep: true });
                                        setTimeout(() => {
                                            let Btn = document.getElementsByClassName("react-joyride__beacon");
                                            for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                        }, 200);
                                    }}><i className='fas fa-info-circle'></i></button></div>
                                    <div className='col-md-3 d-flex justify-content-end'>
                                        <button className='btn btn-default' onClick={() => this.modalForm({ ID: "" })} id='btnAdd'><i className='fas fa-plus'></i> Tambah User</button>
                                    </div>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={[
                                        { cap: "", sort: "", type: "opsi" },
                                        { cap: "Nama", sort: "Nama", type: "str" },
                                        { cap: "Kode", sort: "Kode", type: "str" },
                                        { cap: "Email", sort: "Email", type: "str" },
                                        { cap: "Telp", sort: "Telp", type: "str" },
                                        { cap: "Status", sort: "Status", type: "checkbox", fn: (e, data, i) => this.handleStatusAll(e, data, i), fnitem: (e, data, i) => this.handleChangeStatus(e, data, i) }
                                    ]}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) }
                                    ]}
                                    id="TableDataUser"
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.Step1} run={this.state.RunStep} /> : ""}
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalForm' className='modal-xl' title={ID == "" ? "Tambah User" : "Edit User"} form={true} validationRef={this.validationForm} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "cruduser", fn: () => this.handleMain() })} >
                    <ModalBody>
                        <input type='hidden' name='act' value={ID == "" ? "tambah" : "edit"} />
                        <input type='hidden' name='ID' value={ID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='IsAffiliate' value={Detail.IsAffiliate} />
                        <input type='hidden' name='Akses' value={JSON.stringify(DataAkses.filter((val) => val.checked == 1))} />
                        <Row>
                            <Row6>
                                <DxFormInput id='edtKode' label='Kode' name='Kode' value={Detail.Kode} onChange={(e) => this.handleChange(e, "Kode")} placeholder='Silahkan Isi kode' required={true} />
                                <DxFormInput id='edtNama' label='Nama' name='Nama' value={Detail.Nama} onChange={(e) => this.handleChange(e, "Nama")} placeholder='Silahkan Isi nama' required={true} />
                                <DxFormInput id='edtEmail' type='email' label='Email' name='Email' value={Detail.Email} onChange={(e) => this.handleChange(e, "Email")} placeholder='Silahkan Isi Email' required={true} />
                                <DxFormInput id='edtTelp' type='number' label='No. WhatsApp' name='Telp' value={Detail.Telp} onChange={(e) => this.handleChange(e, "Telp")} placeholder='Silahkan Isi No Whatsapp' required={true} />
                                {ID == "" ?
                                    <Row>
                                        <Row6><DxFormInput id='edtPwd' type='password' label='Password' name='Pwd' value={Detail.Pwd} onChange={(e) => this.handleChange(e, "Pwd")} placeholder='Silahkan Isi Password' required={true} /></Row6>
                                        <Row6><DxFormInput id='edtPwd2' type='password' label='Ulangi Password' name='Pwd2' value={Detail.Pwd2} onChange={(e) => this.handleChange(e, "Pwd2")} placeholder='Silahkan ulangi Password' required={true} /></Row6>
                                    </Row> : ""
                                }
                                <FormSwitch label='Jadikan Affiliate' id='chkIsAffiliate' checked={Detail.IsAffiliate} onChange={(e) => {
                                    let Detail = this.state.Detail;
                                    Detail.IsAffiliate = e.target.checked == true ? 1 : 0;
                                    this.setState({ Detail });
                                }} />
                            </Row6>
                            <Row6>
                                <RendTables
                                    thead={[
                                        { cap: "Nama", sort: "Nama", type: "str" },
                                        { cap: "Akses", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihAksesAll(e), fnitem: (e, data, i) => this.handlePilihAkses(e, data, i) },
                                    ]}
                                    tbody={DataAkses}
                                    id="TableDataAkses"
                                />
                            </Row6>
                        </Row>
                        <Tutorial data={this.state.StepForm} run={this.state.RunStepForm} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupmodalForm" >
                        <button className='btn btn-default' type='submit' id='btnSave'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.ID} onSubmit={(e) => submitForm(e, { crud: "cruduser", fn: () => this.handleMain(), debug: true })} />
            </Fragment>
        )
    }

}

export default Dashboard;
